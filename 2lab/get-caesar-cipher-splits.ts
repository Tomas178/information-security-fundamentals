import { reversedDictionary } from '../common/dictionary/reversed-dictionary.js';

export function getCaesarCipherSplits(
  encryptedText: string,
  encryptionKeyLength: number
): string[] {
  const caesarCiphers = Array.from({ length: encryptionKeyLength }, () => '');

  let cipherIndex = 0;
  for (const char of encryptedText) {
    const letter = char.toLowerCase();

    if (!reversedDictionary.has(letter)) {
      continue;
    }

    caesarCiphers[cipherIndex] += char;

    cipherIndex = (cipherIndex + 1) % encryptionKeyLength;
  }

  return caesarCiphers;
}
