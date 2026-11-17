import { readFile } from 'node:fs/promises';
import { type Block, blocksToString } from '../common/aes/aes-helpers.js';
import {
  decryptBlock,
  encryptBlock,
  xorBlocks,
} from '../common/aes/block-cipher.js';
import { parseAesModesVariant } from '../common/variant/parse-aes-modes-variant.js';

function decryptEcb(cipher: Block[], roundKeys: Block[]): Block[] {
  return cipher.map((block) => decryptBlock(block, roundKeys));
}

function decryptCbc(cipher: Block[], roundKeys: Block[], iv: Block): Block[] {
  return cipher.map((block, index) =>
    xorBlocks(
      decryptBlock(block, roundKeys),
      index === 0 ? iv : cipher[index - 1]
    )
  );
}

function decryptPcbc(cipher: Block[], roundKeys: Block[], iv: Block): Block[] {
  const plain: Block[] = [];

  let chain = iv;
  for (const block of cipher) {
    const plainBlock = xorBlocks(decryptBlock(block, roundKeys), chain);
    plain.push(plainBlock);
    chain = xorBlocks(plainBlock, block);
  }

  return plain;
}

function decryptCfb(cipher: Block[], roundKeys: Block[], iv: Block): Block[] {
  return cipher.map((block, index) =>
    xorBlocks(
      encryptBlock(index === 0 ? iv : cipher[index - 1], roundKeys),
      block
    )
  );
}

function decryptOfb(cipher: Block[], roundKeys: Block[], iv: Block): Block[] {
  const plain: Block[] = [];

  let keystream = iv;
  for (const block of cipher) {
    keystream = encryptBlock(keystream, roundKeys);
    plain.push(xorBlocks(block, keystream));
  }

  return plain;
}

const variantFilePath = new URL('./7.txt', import.meta.url);
const variantFile = await readFile(variantFilePath, { encoding: 'utf-8' });
const { roundKeys, iv, ciphers } = parseAesModesVariant(variantFile);
const [ecb, cbc, pcbc, cfb, ofb] = ciphers;

const answers = [
  ['AES-ECB atviras tekstas', blocksToString(decryptEcb(ecb, roundKeys))],
  ['AES-CBC atviras tekstas', blocksToString(decryptCbc(cbc, roundKeys, iv))],
  ['AES-PCBC atviras tekstas', blocksToString(decryptPcbc(pcbc, roundKeys, iv))],
  ['AES-CFB atviras tekstas', blocksToString(decryptCfb(cfb, roundKeys, iv))],
  ['AES-OFB atviras tekstas', blocksToString(decryptOfb(ofb, roundKeys, iv))],
];

console.log('Atsakymas:');
console.log(
  answers
    .map(([label, value], index) => `${index + 1}. ${label}: ${value}`)
    .join('\n')
);
