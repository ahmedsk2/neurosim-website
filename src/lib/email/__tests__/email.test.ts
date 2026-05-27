// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import nodemailer, { type Transporter } from 'nodemailer';
import { resolvePlaceholders, renderTemplate, reviewerTicketLink, type TemplateContext } from '../templates';
import { getTransport, loadSmtpConfig, __setTransportForTests, type TransportResult } from '../transport';
import { encryptSecret } from '../crypto';

// Mock the Prisma singleton so the email lib can be unit-tested with no real DB. vi.hoisted
// gives the spies to the hoisted vi.mock factory.
const db = vi.hoisted(() => ({
  findUnique: vi.fn(),
  auditCreate: vi.fn(),
  findingUpdate: vi.fn(),
  smtpFindUnique: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    finding: { findUnique: db.findUnique, update: db.findingUpdate },
    findingAudit: { create: db.auditCreate },
    smtpSetting: { findUnique: db.smtpFindUnique },
    $transaction: async (cb: (tx: unknown) => unknown) =>
      cb({ finding: { update: db.findingUpdate }, findingAudit: { create: db.auditCreate } }),
  },
}));

// Imported after the mock is declared (vi.mock is hoisted above imports anyway).
import { sendFindingEmail } from '../send';

const CTX: TemplateContext = {
  reviewerName: 'Dr. Reviewer',
  ticketTitle: 'ICP figure caption is wrong',
  page: 'modalities/icp',
  status: 'accepted',
  link: 'https://web.example/review/findings/5/',
};

describe('template placeholder resolution', () => {
  it('resolves every placeholder', () => {
    const out = resolvePlaceholders(
      'Hi {{reviewerName}}, {{ticketTitle}} on {{page}} is {{status}}: {{link}}',
      CTX,
    );
    expect(out).toBe(
      'Hi Dr. Reviewer, ICP figure caption is wrong on modalities/icp is accepted: https://web.example/review/findings/5/',
    );
  });

  it('leaves unknown tokens intact so typos stay visible', () => {
    expect(resolvePlaceholders('Hello {{nope}} {{reviewerName}}', CTX)).toBe('Hello {{nope}} Dr. Reviewer');
  });

  it('renderTemplate resolves subject and body together', () => {
    const r = renderTemplate({ subject: 'Re: {{ticketTitle}}', body: 'status {{status}}' }, CTX);
    expect(r.subject).toBe('Re: ICP figure caption is wrong');
    expect(r.body).toBe('status accepted');
  });

  it('reviewerTicketLink builds an absolute, trailing-slash link and de-dupes the base slash', () => {
    expect(reviewerTicketLink(5, 'https://web.example')).toBe('https://web.example/review/findings/5/');
    expect(reviewerTicketLink(5, 'https://web.example/')).toBe('https://web.example/review/findings/5/');
  });
});

describe('transport configuration (DB row over env, encrypted password)', () => {
  const saved = {
    host: process.env.SMTP_HOST,
    from: process.env.SMTP_FROM,
    port: process.env.SMTP_PORT,
    pass: process.env.SMTP_PASS,
    key: process.env.SMTP_ENCRYPTION_KEY,
  };
  const KEY = Buffer.alloc(32, 9).toString('base64');
  beforeEach(() => db.smtpFindUnique.mockResolvedValue(null)); // default: no DB row -> env only
  afterEach(() => {
    if (saved.host === undefined) delete process.env.SMTP_HOST;
    else process.env.SMTP_HOST = saved.host;
    if (saved.from === undefined) delete process.env.SMTP_FROM;
    else process.env.SMTP_FROM = saved.from;
    if (saved.port === undefined) delete process.env.SMTP_PORT;
    else process.env.SMTP_PORT = saved.port;
    if (saved.pass === undefined) delete process.env.SMTP_PASS;
    else process.env.SMTP_PASS = saved.pass;
    if (saved.key === undefined) delete process.env.SMTP_ENCRYPTION_KEY;
    else process.env.SMTP_ENCRYPTION_KEY = saved.key;
    __setTransportForTests(null);
  });

  it('reports not-configured when neither the DB row nor env supply host/from', async () => {
    delete process.env.SMTP_HOST;
    delete process.env.SMTP_FROM;
    __setTransportForTests(null);
    const t = await getTransport();
    expect(t.configured).toBe(false);
    if (!t.configured) expect(t.reason).toMatch(/not configured/i);
  });

  it('reports configured when env supplies host + from (no DB row)', async () => {
    process.env.SMTP_HOST = 'smtp.example';
    process.env.SMTP_FROM = 'noreply@example';
    __setTransportForTests(null);
    expect((await getTransport()).configured).toBe(true);
  });

  it('loadSmtpConfig: a non-empty DB field overrides env; a blank DB field falls back to env', async () => {
    process.env.SMTP_HOST = 'env.example';
    process.env.SMTP_FROM = 'env@example';
    process.env.SMTP_PORT = '25';
    process.env.SMTP_PASS = 'envpass';
    db.smtpFindUnique.mockResolvedValue({
      host: 'db.example',
      port: 2525,
      secure: true,
      user: 'dbuser',
      pass: null, // blank -> env SMTP_PASS fallback (plaintext, env-only by design)
      from: null, // blank -> env fallback
    });
    const cfg = await loadSmtpConfig();
    expect(cfg.host).toBe('db.example');
    expect(cfg.port).toBe(2525);
    expect(cfg.secure).toBe(true);
    expect(cfg.user).toBe('dbuser');
    expect(cfg.from).toBe('env@example');
    expect(cfg.pass).toBe('envpass');
  });

  it('loadSmtpConfig: decrypts the stored (encrypted) DB password when a key is set', async () => {
    process.env.SMTP_ENCRYPTION_KEY = KEY;
    db.smtpFindUnique.mockResolvedValue({
      host: 'db.example',
      port: 587,
      secure: false,
      user: 'u',
      pass: encryptSecret('db-secret'),
      from: 'db@example',
    });
    const cfg = await loadSmtpConfig();
    expect(cfg.pass).toBe('db-secret'); // ciphertext decrypted just-in-time
  });

  it('getTransport: degrades to misconfigured (no crash) when the stored password cannot be decrypted', async () => {
    delete process.env.SMTP_ENCRYPTION_KEY; // missing key -> decrypt fails
    db.smtpFindUnique.mockResolvedValue({
      host: 'db.example',
      port: 587,
      secure: false,
      user: 'u',
      pass: 'not-valid-ciphertext',
      from: 'db@example',
    });
    __setTransportForTests(null);
    const t = await getTransport();
    expect(t.configured).toBe(false);
    if (!t.configured) expect(t.reason).toMatch(/misconfigured/i);
  });
});

describe('sendFindingEmail', () => {
  const okTransport: TransportResult = {
    configured: true,
    transporter: nodemailer.createTransport({ jsonTransport: true }),
    from: 'MNM-Edu <noreply@example>',
  };

  beforeEach(() => {
    db.findUnique.mockReset();
    db.auditCreate.mockReset();
    db.findingUpdate.mockReset();
  });
  afterEach(() => __setTransportForTests(null));

  it('not configured: returns 503 and never queries the DB', async () => {
    __setTransportForTests({ configured: false, reason: 'SMTP is not configured.' });
    const r = await sendFindingEmail({
      findingId: 5,
      subject: 'S',
      body: 'B',
      templateKey: 'accepted',
      edited: false,
      actorId: 'admin1',
    });
    expect(r).toEqual({ ok: false, status: 503, error: 'SMTP is not configured.' });
    expect(db.findUnique).not.toHaveBeenCalled();
  });

  it('success (jsonTransport): writes an email_sent audit row with metadata only (no body) and stamps lastNotifiedAt', async () => {
    __setTransportForTests(okTransport);
    db.findUnique.mockResolvedValue({ id: 5, status: 'accepted', author: { email: 'reviewer@example.com' } });

    const r = await sendFindingEmail({
      findingId: 5,
      subject: 'Your finding was accepted',
      body: 'Hi Dr. Reviewer, ...',
      templateKey: 'accepted',
      edited: true,
      actorId: 'admin1',
    });

    expect(r).toEqual({ ok: true });
    expect(db.auditCreate).toHaveBeenCalledTimes(1);
    const auditArg = db.auditCreate.mock.calls[0]?.[0]?.data as {
      action: string;
      findingId: number;
      actorId: string;
      detail: string;
    };
    expect(auditArg.action).toBe('email_sent');
    expect(auditArg.findingId).toBe(5);
    expect(auditArg.actorId).toBe('admin1');
    const detail = JSON.parse(auditArg.detail);
    expect(detail).toEqual({
      to: 'reviewer@example.com',
      subject: 'Your finding was accepted',
      statusAtSend: 'accepted',
      templateKey: 'accepted',
      edited: true,
    });
    // The email body is never persisted.
    expect(Object.keys(detail)).not.toContain('body');
    expect(JSON.stringify(detail)).not.toContain('Hi Dr. Reviewer');
    // lastNotifiedAt stamped with a Date.
    expect(db.findingUpdate).toHaveBeenCalledTimes(1);
    const updateArg = db.findingUpdate.mock.calls[0]?.[0]?.data as { lastNotifiedAt: unknown };
    expect(updateArg.lastNotifiedAt).toBeInstanceOf(Date);
  });

  it('SMTP failure: surfaces the error, writes NO audit row, does not touch status', async () => {
    __setTransportForTests({
      configured: true,
      transporter: { sendMail: vi.fn().mockRejectedValue(new Error('SMTP down')) } as unknown as Transporter,
      from: 'noreply@example',
    });
    db.findUnique.mockResolvedValue({ id: 5, status: 'open', author: { email: 'reviewer@example.com' } });

    const r = await sendFindingEmail({
      findingId: 5,
      subject: 'S',
      body: 'B',
      templateKey: 'general',
      edited: false,
      actorId: 'admin1',
    });

    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.status).toBe(502);
    expect(db.auditCreate).not.toHaveBeenCalled();
    expect(db.findingUpdate).not.toHaveBeenCalled();
  });

  it('missing finding: returns 404', async () => {
    __setTransportForTests(okTransport);
    db.findUnique.mockResolvedValue(null);
    const r = await sendFindingEmail({
      findingId: 999,
      subject: 'S',
      body: 'B',
      templateKey: 'general',
      edited: false,
      actorId: 'admin1',
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.status).toBe(404);
    expect(db.auditCreate).not.toHaveBeenCalled();
  });
});
