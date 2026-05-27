import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

/**
 * App-level encryption for the at-rest SMTP password (SmtpSetting.pass). AES-256-GCM with a
 * 32-byte key held only in env (SMTP_ENCRYPTION_KEY, base64 or hex). The DB stores ONLY
 * ciphertext, so dev.db can be copied/inspected without exposing the credential. The stored
 * form is base64(iv[12] || authTag[16] || ciphertext) in a single field.
 *
 * All failures throw SmtpCryptoError so callers (the transport) can degrade gracefully to a
 * "misconfigured" state rather than crashing or sending unauthenticated.
 */
const ALGORITHM = 'aes-256-gcm';
const IV_LEN = 12;
const TAG_LEN = 16;

export class SmtpCryptoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SmtpCryptoError';
  }
}

/** Parse SMTP_ENCRYPTION_KEY (base64 or hex) into a 32-byte key, or null if unusable. */
function getKey(): Buffer | null {
  const raw = process.env.SMTP_ENCRYPTION_KEY?.trim();
  if (!raw) return null;
  const b64 = Buffer.from(raw, 'base64');
  if (b64.length === 32) return b64;
  const hex = Buffer.from(raw, 'hex');
  if (hex.length === 32) return hex;
  return null;
}

/** True when a usable 32-byte key is configured. */
export function hasEncryptionKey(): boolean {
  return getKey() !== null;
}

/** Encrypt a secret to base64(iv || tag || ciphertext). Throws SmtpCryptoError if no key. */
export function encryptSecret(plaintext: string): string {
  const key = getKey();
  if (!key) {
    throw new SmtpCryptoError('SMTP_ENCRYPTION_KEY is missing or not a 32-byte base64/hex value.');
  }
  const iv = randomBytes(IV_LEN);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, ciphertext]).toString('base64');
}

/** Decrypt a base64(iv || tag || ciphertext) string. Throws SmtpCryptoError on any failure. */
export function decryptSecret(stored: string): string {
  const key = getKey();
  if (!key) {
    throw new SmtpCryptoError('SMTP_ENCRYPTION_KEY is missing or not a 32-byte base64/hex value.');
  }
  const buf = Buffer.from(stored, 'base64');
  if (buf.length <= IV_LEN + TAG_LEN) {
    throw new SmtpCryptoError('Stored SMTP secret is malformed (too short).');
  }
  const iv = buf.subarray(0, IV_LEN);
  const tag = buf.subarray(IV_LEN, IV_LEN + TAG_LEN);
  const ciphertext = buf.subarray(IV_LEN + TAG_LEN);
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);
  try {
    return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8');
  } catch {
    // GCM auth-tag mismatch (wrong key or tampered data) or any decode failure.
    throw new SmtpCryptoError('SMTP password could not be decrypted (wrong key or tampered data).');
  }
}
