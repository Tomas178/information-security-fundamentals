import { readFile } from 'node:fs/promises';
import { integerRoot, pollardRho } from './big-int-math.js';
import {
  bitLength,
  bytesToString,
  intToBytes,
  intToString,
  stringToInt,
} from './pagalbines-funkcijos.js';
import {
  decrypt,
  encrypt,
  privateExponent,
  rsaGenerator,
} from './rsa-generator.js';
import { PublicKey } from './interfaces.js';

const NAME = 'Tomas Petronis';

function parseVariant(fileContent: string): Map<string, bigint[][]> {
  const sections = new Map<string, bigint[][]>();
  let currentSection: bigint[][] = [];

  const lines = fileContent
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  for (const line of lines) {
    if (/^\d+\.$/.test(line)) {
      currentSection = [];
      sections.set(line.slice(0, -1), currentSection);
      continue;
    }

    currentSection.push(
      line.replace(/[(),]/g, ' ').trim().split(/\s+/).map(BigInt)
    );
  }

  return sections;
}

// With m^e < n the power is never reduced modulo n, so c = m^e holds over the
// integers and m is the exact e-th root of c.
function smallMessageAttack(cipher: bigint, { e }: PublicKey): bigint {
  const message = integerRoot(cipher, e);
  if (message ** e !== cipher) {
    throw new Error('c is not an exact e-th power, so m^e >= n');
  }
  return message;
}

function smallFactorAttack(cipher: bigint, { e, n }: PublicKey): bigint {
  const p = pollardRho(n);
  const q = n / p;
  console.log(`p = ${p} (${bitLength(p)} bits)`);
  console.log(`q = ${q} (${bitLength(q)} bits)`);
  return decrypt(cipher, { d: privateExponent(e, p, q), n });
}

// PM = 0x00 || 0x02 || PS || 0x00 || m (slide 9). The leading 0x00 is lost when
// the decrypted integer is turned into bytes, so the block starts at 0x02. Its
// length is not compared with k: in variant 7 PS is one byte longer than
// k - l - 3 (l seems to be counted in characters, not UTF-8 bytes), so the
// block fills all k bytes and has no room for the leading 0x00 anyway.
function removePkcs1v15Padding(block: Uint8Array): Uint8Array {
  const separatorIndex = block.indexOf(0x00, 1);
  const paddingLength = separatorIndex - 1;
  if (block[0] !== 0x02 || separatorIndex === -1 || paddingLength < 8) {
    throw new Error('Invalid RSAES-PKCS1-v1_5 padding');
  }
  return block.subarray(separatorIndex + 1);
}

const variantFilePath = new URL('./7.txt', import.meta.url);
const variantFile = await readFile(variantFilePath, { encoding: 'utf-8' });
const variant = parseVariant(variantFile);

const [[e1]] = variant.get('1')!;
const [[e3, n3], [c3]] = variant.get('3')!;
const [[e4, n4], [c4]] = variant.get('4')!;
const [[d5, n5], [c5]] = variant.get('5')!;

console.log(`1. Generating RSA keys with e = ${e1}`);
const keys = rsaGenerator(e1);
console.log(
  `p: ${bitLength(keys.p)} bits, q: ${bitLength(keys.q)} bits, n: ${bitLength(keys.n)} bits\n`
);

console.log(`2. Encrypting "${NAME}" with (e, n)`);
const nameCipher = encrypt(stringToInt(NAME), keys);
const decryptedName = intToString(decrypt(nameCipher, keys));
if (decryptedName !== NAME) {
  throw new Error(`Decrypting the cipher gave "${decryptedName}"`);
}
console.log(`Decrypted back with (d, n): "${decryptedName}"\n`);

console.log('3. Taking the e-th root of c');
const thirdTaskText = intToString(smallMessageAttack(c3, { e: e3, n: n3 }));
console.log(`Decrypted text: "${thirdTaskText}"\n`);

console.log('4. Factoring n with Pollard rho');
console.time('Pollard rho');
const fourthTaskText = intToString(smallFactorAttack(c4, { e: e4, n: n4 }));
console.timeEnd('Pollard rho');
console.log(`Decrypted text: "${fourthTaskText}"\n`);

console.log('5. Decrypting with (d, n) and removing RSAES-PKCS1-v1_5 padding');
const paddedBlock = intToBytes(decrypt(c5, { d: d5, n: n5 }));
const fifthTaskText = bytesToString(removePkcs1v15Padding(paddedBlock));
console.log(`Decrypted text: "${fifthTaskText}"\n`);

console.log('Atsakymas:');
console.log(
  [
    keys.p,
    keys.q,
    `(${keys.e}, ${keys.n})`,
    `(${keys.d}, ${keys.n})`,
    nameCipher,
    thirdTaskText,
    fourthTaskText,
    fifthTaskText,
  ].join('\n')
);
