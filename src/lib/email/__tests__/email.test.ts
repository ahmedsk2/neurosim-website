// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import nodemailer, { type Transporter } from 'nodemailer';
import { resolvePlaceholders, renderTemplate, reviewerTicketLink, type TemplateContext } from '../templates';
import { getTransport, __setTransportForTests, type TransportResult } from '../transport';

// Mock the Prisma singleton so sendFindingEmail can be unit-tested with no real DB. vi.hoisted
// gives the spies to the hoisted vi.mock factory.
const db = vi.hoisted(() => ({
  findUnique: vi.fn(),
  auditCreate: vi.fn(),
  findingUpdate: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    finding: { findUnique: db.findUnique, update: db.findingUpdate },
    findingAudit: { create: db.auditCreate },
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

describe('transport configuration', () => {
  const saved = { host: process.env.SMTP_HOST, from: process.env.SMTP_FROM };
  afterEach(() => {
    process.env.SMTP_HOST = saved.host;
    process.env.SMTP_FROM = saved.from;
    __setTransportForTests(null);
  });

  it('reports not-configured when SMTP_HOST / SMTP_FROM are unset', () => {
    delete process.env.SMTP_HOST;
    delete process.env.SMTP_FROM;
    __setTransportForTests(null); // force a rebuild from env
    const t = getTransport();
    expect(t.configured).toBe(false);
    if (!t.configured) expect(t.reason).toMatch(/not configured/i);
  });

  it('reports configured when SMTP_HOST + SMTP_FROM are set', () => {
    process.env.SMTP_HOST = 'smtp.example';
    process.env.SMTP_FROM = 'noreply@example';
    __setTransportForTests(null);
    expect(getTransport().configured).toBe(true);
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
