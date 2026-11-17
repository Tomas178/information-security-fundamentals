import { readFile } from 'node:fs/promises';
import {
  type Block,
  blocksToByteString,
  blocksToString,
  stringToBlocks,
} from '../common/aes/aes-helpers.js';
import { decryptBlock, encryptBlock } from '../common/aes/block-cipher.js';
import { parseAesVariants } from '../common/variant/parse-aes-variants.js';

function encrypt(text: string, roundKeys: Block[]): string {
  return blocksToByteString(
    stringToBlocks(text).map((block) => encryptBlock(block, roundKeys))
  );
}

function decrypt(cipher: Block[], roundKeys: Block[]): string {
  return blocksToString(cipher.map((block) => decryptBlock(block, roundKeys)));
}

const VARIANT = 7;
const SURNAME = 'Petronis';

const variantFilePath = new URL('./variantai.txt', import.meta.url);
const variantFile = await readFile(variantFilePath, { encoding: 'utf-8' });
const { roundKeys, cipher } = parseAesVariants(variantFile)[VARIANT - 1];

const answers = [
  ['Atšifruotas tekstas', decrypt(cipher, roundKeys)],
  ['Šifras', encrypt(SURNAME, roundKeys)],
  ['Naudotas raktas', blocksToByteString(roundKeys)],
];

console.log('Atsakymas:');
console.log(
  answers
    .map(([label, value], index) => `${index + 1}. ${label}: ${value}`)
    .join('\n')
);
