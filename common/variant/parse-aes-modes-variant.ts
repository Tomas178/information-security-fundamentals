import { type Block, byteStringToBlocks } from '../aes/aes-helpers.js';

type AesModesVariant = { roundKeys: Block[]; iv: Block; ciphers: Block[][] };

export function parseAesModesVariant(fileContent: string): AesModesVariant {
  const [header, ...sections] = fileContent.split(/^\s*\d+\.\s*$/m);
  const { key, iv } = Object.fromEntries(
    [...header.matchAll(/(\w+)\s*=\s*([0-9a-f]+)/gi)].map(
      ([, name, value]) => [name, value]
    )
  );

  return {
    roundKeys: byteStringToBlocks(key),
    iv: byteStringToBlocks(iv)[0],
    ciphers: sections.map((section) => byteStringToBlocks(section.trim())),
  };
}
