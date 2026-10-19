import { TOTP } from 'otpauth';
import { User } from './interfaces.js';
import { decrypt } from './secret-encryption.js';

export function acceptedStep(user: User, code: string): number | null {
  if (user.totpSecret === null) {
    return null;
  }

  const totp = new TOTP({ secret: decrypt(user.totpSecret) });
  const now = Date.now();
  const delta = totp.validate({ token: code, timestamp: now, window: 1 });
  if (delta === null) {
    return null;
  }

  const step = totp.counter({ timestamp: now }) + delta;
  return step > user.lastUsedStep ? step : null;
}
