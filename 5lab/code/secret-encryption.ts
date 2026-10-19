import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

const encryptionKey = randomBytes(32);
export function encrypt(plainText: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', encryptionKey, iv);
  const cipherText = Buffer.concat([
    cipher.update(plainText, 'utf8'),
    cipher.final(),
  ]);
  return [iv, cipher.getAuthTag(), cipherText]
    .map((part) => part.toString('base64'))
    .join(':');
}

export function decrypt(stored: string): string {
  const [iv, authTag, cipherText] = stored
    .split(':')
    .map((part) => Buffer.from(part, 'base64'));
  const decipher = createDecipheriv('aes-256-gcm', encryptionKey, iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([
    decipher.update(cipherText),
    decipher.final(),
  ]).toString('utf8');
}
