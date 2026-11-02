import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { PrivateKey, PublicKey } from '../6lab/interfaces.js';
import { decrypt, encrypt } from '../6lab/rsa-generator.js';
import { bytesToInt, intToBytes } from './pagalbines_funkcijos.js';

const NAME = 'Tomas Petronis';

const RSA_KEY_FROM_6LAB: PublicKey & PrivateKey = {
  e: 63079n,
  n: 10152670144912573341221650622151891124836082092964702439978032524266317881815636086101155207655053071560056976925917662902932147466016784660160156032230033n,
  d: 254142680746634431519031473745269203476849246576376688798575014756361323663764006744231100090693023003223597707685046139082481904116944785068096679839127n,
};

function sha256(data: Uint8Array): Buffer {
  return createHash('sha256').update(data).digest();
}

function sign(fingerprint: Uint8Array, key: PublicKey & PrivateKey): bigint {
  const fingerprintNumber = bytesToInt(fingerprint);
  const signature = decrypt(fingerprintNumber, key);

  return signature;
}

const certificatePath = new URL('./sertifikatas.txt', import.meta.url);
await writeFile(
  certificatePath,
  [NAME, RSA_KEY_FROM_6LAB.n, RSA_KEY_FROM_6LAB.e].join('\n')
);
const certificate = await readFile(certificatePath);

const fingerprint = sha256(certificate);
const fingerprintSignature = sign(fingerprint, RSA_KEY_FROM_6LAB);

const ts10 = BigInt(Math.floor(Date.now() / 1000));
const ts16 = intToBytes(ts10);

const timestampedFingerprint = sha256(Buffer.concat([fingerprint, ts16]));
const timestampedSignature = sign(timestampedFingerprint, RSA_KEY_FROM_6LAB);

console.log(
  [
    `ts10: ${ts10}`,
    `ts16: ${Buffer.from(ts16).toString('hex')}`,
    `SHA256 (hex): ${timestampedFingerprint.toString('hex')}`,
    `SHA256 (decimal): ${bytesToInt(timestampedFingerprint)}`,
  ].join('\n')
);

const answers = [
  ['Sertifikato piršto antspaudas', fingerprint.toString('hex')],
  ['Piršto antspaudo parašas', fingerprintSignature],
  [
    'Sertifikato ir laiko žymos piršto antspaudas',
    timestampedFingerprint.toString('hex'),
  ],
  ['ts10', ts10],
  ['Sertifikato ir laiko žymos piršto antspaudo parašas', timestampedSignature],
];

console.log('\nAtsakymas:');
console.log(
  answers
    .map(([label, value], index) => `${index + 1}. ${label}: ${value}`)
    .join('\n')
);
