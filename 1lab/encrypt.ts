import { indexedDictionary } from '../common/dictionary/indexed-dictionary.js';
import { reversedDictionary } from '../common/dictionary/reversed-dictionary.js';
import { isUpperCase } from '../common/is-upper-case.js';
import { CeasarCipherConfig } from './caesar-cipher.js';
import { mod } from './mod.js';

export function encrypt(config: CeasarCipherConfig): string {
  const wordToEncrypt = config.word;
  let encryptedWord = '';

  for (let i = 0; i < wordToEncrypt.length; i++) {
    const letter = wordToEncrypt[i];
    let isUpperCaseLetter = isUpperCase(letter);

    const letterIndexInDictionary = reversedDictionary.get(
      letter.toLowerCase()
    );
    if (letterIndexInDictionary === undefined) {
      encryptedWord += letter;
      continue;
    }

    const newLetterIndex = mod(
      letterIndexInDictionary + config.bias,
      indexedDictionary.size
    );
    let letterAfterEncryption = indexedDictionary.get(newLetterIndex)!;
    if (isUpperCaseLetter) {
      letterAfterEncryption = letterAfterEncryption.toUpperCase();
    }

    encryptedWord += letterAfterEncryption;
  }

  return encryptedWord;
}
