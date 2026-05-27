// @vitest-environment node
import { describe, it, expect, afterEach } from 'vitest';
import { encryptSecret, decryptSecret, hasEncryptionKey, SmtpCryptoError } from '../crypto';

const KEY = Buffer.alloc(32, 1).toString('base64'); // a deterministic 32-byte test key (base64)
const saved = process.env.SMTP_ENCRYPTION_KEY;

describe('SMTP secret encryption (AES-256-GCM)', () => {
  afterEach(() => {
    if (saved === undefined) delete process.env.SMTP_ENCRYPTION_KEY;
    else process.env.SMTP_ENCRYPTION_KEY = saved;
  });

  it('round-trips a secret and does not leak plaintext into the ciphertext', () => {
    process.env.SMTP_ENCRYPTION_KEY = KEY;
    const ct = encryptSecret('hunter2-app-password');
    expect(ct).not.toContain('hunter2');
    expect(decryptSecret(ct)).toBe('hunter2-app-password');
  });

  it('uses a random IV (different ciphertext each call) yet both decrypt', () => {
    process.env.SMTP_ENCRYPTION_KEY = KEY;
    const a = encryptSecret('same');
    const b = encryptSecret('same');
    expect(a).not.toBe(b);
    expect(decryptSecret(a)).toBe('same');
    expect(decryptSecret(b)).toBe('same');
  });

  it('detects tampering via the GCM auth tag', () => {
    process.env.SMTP_ENCRYPTION_KEY = KEY;
    const bytes = Array.from(Buffer.from(encryptSecret('secret'), 'base64'));
    bytes[bytes.length - 1] = (bytes[bytes.length - 1] ?? 0) ^ 0xff; // corrupt a ciphertext byte
    expect(() => decryptSecret(Buffer.from(bytes).toString('base64'))).toThrow(SmtpCryptoError);
  });

  it('fails to decrypt with the wrong key', () => {
    process.env.SMTP_ENCRYPTION_KEY = KEY;
    const ct = encryptSecret('secret');
    process.env.SMTP_ENCRYPTION_KEY = Buffer.alloc(32, 2).toString('base64');
    expect(() => decryptSecret(ct)).toThrow(SmtpCryptoError);
  });

  it('throws SmtpCryptoError when the key is missing', () => {
    delete process.env.SMTP_ENCRYPTION_KEY;
    expect(hasEncryptionKey()).toBe(false);
    expect(() => encryptSecret('x')).toThrow(SmtpCryptoError);
    expect(() => decryptSecret('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=')).toThrow(SmtpCryptoError);
  });

  it('accepts a hex-encoded key as well', () => {
    process.env.SMTP_ENCRYPTION_KEY = Buffer.alloc(32, 3).toString('hex'); // 64 hex chars
    expect(hasEncryptionKey()).toBe(true);
    expect(decryptSecret(encryptSecret('hx'))).toBe('hx');
  });
});
