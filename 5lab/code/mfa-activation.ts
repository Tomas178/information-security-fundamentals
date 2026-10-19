import { fileURLToPath } from 'node:url';
import { Secret, TOTP } from 'otpauth';
import QRCode from 'qrcode';
import { encrypt } from './secret-encryption.js';
import { acceptedStep } from './totp-verification.js';
import { users } from './users-db.js';

const ISSUER = 'ISP';
const QR_CODE_FILE = fileURLToPath(new URL('../totp-qr.png', import.meta.url));

export async function mfaSetup(username: string): Promise<string> {
  const user = users.get(username)!;
  if (user.mfaEnabled) {
    throw new Error('MFA is already enabled');
  }

  const totp = new TOTP({
    issuer: ISSUER,
    label: username,
    secret: new Secret({ size: 20 }),
  });
  // Saved now, but MFA stays off until the user confirms the first code.
  user.totpSecret = encrypt(totp.secret.base32);

  const uri = totp.toString();
  await QRCode.toFile(QR_CODE_FILE, uri, { scale: 8 });
  return uri;
}

export function mfaConfirm(username: string, code: string): boolean {
  const user = users.get(username)!;
  if (user.mfaEnabled) {
    return false;
  }

  const step = acceptedStep(user, code);
  if (step === null) {
    return false;
  }
  user.mfaEnabled = true;
  user.lastUsedStep = step;
  return true;
}
