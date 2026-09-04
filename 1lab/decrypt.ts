import { indexedDictionary } from '../common/dictionary/indexed-dictionary.js';
import { reversedDictionary } from '../common/dictionary/reversed-dictionary.js';
import { isUpperCase } from '../common/is-upper-case.js';
import { CeasarCipherConfig } from './caesar-cipher.js';
import { mod } from './mod.js';

export function decrypt(config: CeasarCipherConfig): string {
  const wordToDecrypt = config.word;
  let decryptedWord = '';

  for (let i = 0; i < wordToDecrypt.length; i++) {
    const letter = wordToDecrypt[i];
    const isUpperCaseLetter = isUpperCase(letter);

    const letterIndexInDictionary = reversedDictionary.get(
      letter.toLowerCase()
    );
    if (letterIndexInDictionary === undefined) {
      decryptedWord += letter;
      continue;
    }

    const newLetterIndex = mod(
      letterIndexInDictionary - config.bias,
      indexedDictionary.size
    );
    let letterAfterDecryption = indexedDictionary.get(newLetterIndex)!;
    if (isUpperCaseLetter) {
      letterAfterDecryption = letterAfterDecryption.toUpperCase();
    }

    decryptedWord += letterAfterDecryption;
  }

  return decryptedWord;
}
