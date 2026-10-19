import { TOTP, URI } from 'otpauth';
import { login, MAX_FAILED_ATTEMPTS } from './code/login.js';
import { mfaConfirm, mfaSetup } from './code/mfa-activation.js';
import { register, users } from './code/users-db.js';

const USERNAME = 'tomas';
const PASSWORD = 'Secure-Password-2026';
const WRONG_CODE = '123456';

async function printResult(
  description: string,
  attempt: boolean | Promise<boolean>
): Promise<void> {
  console.log(`${description} -> ${(await attempt) ? 'accepted' : 'rejected'}`);
}

await register(USERNAME, PASSWORD);
const uri = await mfaSetup(USERNAME);
// The authenticator app knows only what the QR code holds: the otpauth URI.
const phone = URI.parse(uri) as TOTP;
const storedSecret = users.get(USERNAME)!.totpSecret!;

console.log(`Secret for manual entry: ${phone.secret.base32}`);
console.log('QR code saved: totp-qr.png');
console.log(`DB field totpSecret: ${storedSecret.slice(0, 40)}...`);

await printResult(
  `Activation with wrong code ${WRONG_CODE}`,
  mfaConfirm(USERNAME, WRONG_CODE)
);
const firstCode = phone.generate();
await printResult(
  `Activation with code ${firstCode}`,
  mfaConfirm(USERNAME, firstCode)
);

// The code the app will show 30 s from now; window: 1 accepts it already.
const nextCode = phone.generate({ timestamp: Date.now() + 30_000 });
await printResult(
  `Login with wrong password and code ${nextCode}`,
  login(USERNAME, 'wrong-password', nextCode)
);
await printResult(
  `Login with already used code ${firstCode}`,
  login(USERNAME, PASSWORD, firstCode)
);
await printResult(
  `Login with next-step code ${nextCode}`,
  login(USERNAME, PASSWORD, nextCode)
);

for (let i = 0; i < MAX_FAILED_ATTEMPTS; i++) {
  await login(USERNAME, PASSWORD, WRONG_CODE);
}
const lockedUntil = new Date(users.get(USERNAME)!.lockedUntil);
console.log(
  `${MAX_FAILED_ATTEMPTS} wrong codes in a row -> account locked until ${lockedUntil.toLocaleTimeString('en-GB')}`
);
