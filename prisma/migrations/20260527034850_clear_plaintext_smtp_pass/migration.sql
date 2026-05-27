-- Purge any pre-existing PLAINTEXT SMTP password. SmtpSetting.pass now holds only AES-256-GCM
-- ciphertext (see src/lib/email/crypto.ts); legacy plaintext from earlier testing cannot be
-- decrypted, so clear it and have the admin re-enter the password once in /review/settings
-- (it is encrypted on save). No-op on a fresh database.
UPDATE "SmtpSetting" SET "pass" = NULL WHERE "pass" IS NOT NULL;
