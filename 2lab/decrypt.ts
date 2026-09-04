import { indexedDictionary } from '../common/dictionary/indexed-dictionary.js';
import { reversedDictionary } from '../common/dictionary/reversed-dictionary.js';
import { isUpperCase } from '../common/is-upper-case.js';
import { mod } from '../common/mod.js';

export function decrypt(encryptedText: string, encryptionKey: string): string {
  let decryptedText = '';
  let encryptionKeyIndex = 0;

  for (let i = 0; i < encryptedText.length; i++) {
    const textLetter = encryptedText[i];
    const keyLetter = encryptionKey[encryptionKeyIndex];

    const letterIndexes = getLetterIndexes(textLetter, keyLetter);

    if (letterIndexes === undefined) {
      decryptedText += textLetter;
      continue;
    }

    const [textLetterIndex, keyLetterIndex] = letterIndexes;

    const newLetterIndex = mod(
      textLetterIndex - keyLetterIndex,
      indexedDictionary.size
    );

    let letterAfterDecryption = indexedDictionary.get(newLetterIndex)!;
    if (isUpperCase(textLetter)) {
      letterAfterDecryption = letterAfterDecryption.toUpperCase();
    }

    decryptedText += letterAfterDecryption;

    encryptionKeyIndex = (encryptionKeyIndex + 1) % encryptionKey.length;
  }

  return decryptedText;
}

function getLetterIndexes(
  textLetter: string,
  keyLetter: string
): [number, number] | undefined {
  const [textLetterIndexInDictionary, keyLetterIndexInDictionary] = [
    reversedDictionary.get(textLetter.toLowerCase()),
    reversedDictionary.get(keyLetter.toLowerCase()),
  ];

  if (
    textLetterIndexInDictionary === undefined ||
    keyLetterIndexInDictionary === undefined
  ) {
    return undefined;
  }

  return [textLetterIndexInDictionary, keyLetterIndexInDictionary];
}
