import { indexedDictionary } from '../common/dictionary/indexed-dictionary.js';
import { findAllShifts } from './find-all-shifts.js';
import { getCaesarCipherSplits } from './get-caesar-cipher-splits.js';
import { friedmannKappaTest } from './keyLengthTests/friedmann-kappa.js';

export function findEncryptionKey(text: string): string {
  let encryptionKey = '';
  const encryptionKeyLength = friedmannKappaTest(text);
  const caesarCipherSplits = getCaesarCipherSplits(text, encryptionKeyLength);
  const shifts = findAllShifts(caesarCipherSplits);

  for (const shift of shifts) {
    encryptionKey += indexedDictionary.get(shift) ?? '';
  }

  return encryptionKey;
}
