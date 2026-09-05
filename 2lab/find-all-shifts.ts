import { indexedDictionary } from '../common/dictionary/indexed-dictionary.js';
import { reversedDictionary } from '../common/dictionary/reversed-dictionary.js';
import { lithuanianLetterFrequencies } from '../common/dictionary/lithuanian-letter-frequencies.js';

export function findAllShifts(caesarCiphers: string[]): number[] {
  return caesarCiphers.map(findCaesarCipherShift);
}

function findCaesarCipherShift(cipherText: string): number {
  let bestShift = 0;
  let bestScore = Infinity;

  for (let shift = 0; shift < indexedDictionary.size; shift++) {
    const decrypted = decryptWithShift(cipherText, shift);
    const score = calculateChiSquared(decrypted);

    if (score < bestScore) {
      bestScore = score;
      bestShift = shift;
    }
  }

  return bestShift;
}

function decryptWithShift(cipherText: string, shift: number): string {
  const alphabetLength = indexedDictionary.size;
  let result = '';

  for (const char of cipherText) {
    const index = reversedDictionary.get(char.toLowerCase());

    if (index === undefined) {
      continue;
    }

    const decryptedIndex = (index - shift + alphabetLength) % alphabetLength;
    result += indexedDictionary.get(decryptedIndex);
  }

  return result;
}

function calculateChiSquared(text: string): number {
  const letterCounts = new Map<string, number>();
  let totalLetters = 0;

  for (const char of text) {
    letterCounts.set(char, (letterCounts.get(char) ?? 0) + 1);
    totalLetters++;
  }

  if (totalLetters === 0) {
    return Infinity;
  }

  let chiSquared = 0;
  for (const [letter, expectedPercentage] of lithuanianLetterFrequencies) {
    const observedCount = letterCounts.get(letter) ?? 0;
    const expectedCount = (expectedPercentage / 100) * totalLetters;

    chiSquared += Math.pow(observedCount - expectedCount, 2) / expectedCount;
  }

  return chiSquared;
}
