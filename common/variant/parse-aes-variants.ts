import { type Block, byteStringToBlocks } from '../aes/aes-helpers.js';

type AesVariant = { roundKeys: Block[]; cipher: Block[] };

export function parseAesVariants(fileContent: string): AesVariant[] {
  return fileContent
    .split(/^\s*\d+\.\s*$/m)
    .slice(1)
    .map((section) => {
      const [keyHex, cipherHex] = section.trim().split(/\s+/);

      return {
        roundKeys: byteStringToBlocks(keyHex),
        cipher: byteStringToBlocks(cipherHex),
      };
    });
}
