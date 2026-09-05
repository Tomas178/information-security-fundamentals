import { indexedDictionary } from '../common/dictionary/indexed-dictionary.js';
import { findAllShifts } from './find-all-shifts.js';
import { getCaesarCipherSplits } from './get-caesar-cipher-splits.js';
import { friedmannKappaTest } from './keyLengthTests/friedmann-kappa.js';
import { kasiskiTest } from './keyLengthTests/kasiski.js';
import { TaskConfig } from './vigenere-cipher.js';

export function findEncryptionKey({
  encryptedText,
}: Pick<TaskConfig, 'encryptedText'>): string {
  let encryptionKey = '';
  const keyLengthTests = getKeyLengths(encryptedText);
  console.log({ keyLengthTests });

  const caesarCipherSplits = getCaesarCipherSplits(
    encryptedText,
    keyLengthTests.kasiski
  );
  const shifts = findAllShifts(caesarCipherSplits);

  for (const shift of shifts) {
    encryptionKey += indexedDictionary.get(shift) ?? '';
  }

  return encryptionKey;
}

interface KeyLengthTests {
  friedmannKappa: number;
  kasiski: number;
}

function getKeyLengths(encryptedText: string): KeyLengthTests {
  const encryptionKeyLengthByFriedmannKappaTest =
    friedmannKappaTest(encryptedText);

  const encryptionKeyLengthByKasiskiTest = kasiskiTest(encryptedText);

  return {
    friedmannKappa: encryptionKeyLengthByFriedmannKappaTest,
    kasiski: encryptionKeyLengthByKasiskiTest,
  };
}
