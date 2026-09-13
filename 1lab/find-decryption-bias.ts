import { indexedDictionary } from '../common/dictionary/indexed-dictionary.js';
import { decryptionTaskConfig } from './caesar-cipher.js';
import { decrypt } from './decrypt.js';

function findDecryptionBias(word: string): void {
  for (let bias = 0; bias < indexedDictionary.size; bias++) {
    console.log(bias, decrypt({ word, bias }));
  }
}

findDecryptionBias(decryptionTaskConfig.word);
