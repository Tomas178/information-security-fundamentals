import { indexedDictionary } from '../common/dictionary/indexed-dictionary.js';
import { reversedDictionary } from '../common/dictionary/reversed-dictionary.js';
import { isUpperCase } from '../common/is-upper-case.js';

interface CeasarCipherConfig {
  word: string;
  bias: number;
}

function encrypt(config: CeasarCipherConfig): string {
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

    const newLetterIndex = (letterIndexInDictionary + config.bias) % 32;
    let letterAfterEncryption = indexedDictionary.get(newLetterIndex)!;
    if (isUpperCaseLetter) {
      letterAfterEncryption = letterAfterEncryption.toUpperCase();
    }

    encryptedWord += letterAfterEncryption;
  }

  return encryptedWord;
}

function decrypt(config: CeasarCipherConfig): string {}

const encryptionTaskConfig: CeasarCipherConfig = {
  word: 'Briedis girioj, o jau iešmą drožia',
  bias: 19,
};

const decryptionTaskConfig: CeasarCipherConfig = {
  word: 'Ųrvgr vkąmcr, z tgč jaziką gčjfrg',
  bias: 19,
};

console.log(`STARTING ENCRYPTION OF WORD: ${encryptionTaskConfig.word}`);
console.log(
  `Encryption of "${encryptionTaskConfig.word}" is "${encrypt(encryptionTaskConfig)}"`
);
console.log('ENCRYPTION ENDED!\n');

console.log(`STARTING DECRYPTION OF WORD: ${decryptionTaskConfig.word}`);
console.log(
  `Decryption of "${decryptionTaskConfig.word}" is "${decrypt(decryptionTaskConfig)}"`
);
console.log('DECRYPTION ENDED!');
