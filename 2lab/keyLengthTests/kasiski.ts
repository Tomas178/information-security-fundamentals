import { reversedDictionary } from '../../common/dictionary/reversed-dictionary.js';

const DEFAULT_NGRAM_LENGTH = 3;
const DEFAULT_MAX_KEY_LENGTH = 20;

export interface DivisorFrequency {
  divisor: number;
  frequency: number;
}

export function kasiskiTest(
  encryptedText: string,
  ngramLength = DEFAULT_NGRAM_LENGTH,
  maxKeyLength = DEFAULT_MAX_KEY_LENGTH
): number {
  const table = kasiskiDivisorFrequencyTable(
    encryptedText,
    ngramLength,
    maxKeyLength
  );

  if (table.length === 0) {
    throw new Error(
      'Nerasta pasikartojančių n-gramų. Padidinkite teksto ilgį, sumažinkite n-gramos ilgį arba padidink maxKeyLength!'
    );
  }

  return table.reduce((best, current) =>
    current.frequency * current.divisor > best.frequency * best.divisor
      ? current
      : best
  ).divisor;
}

function kasiskiDivisorFrequencyTable(
  encryptedText: string,
  ngramLength = DEFAULT_NGRAM_LENGTH,
  maxKeyLength = DEFAULT_MAX_KEY_LENGTH
): DivisorFrequency[] {
  const letterSequence = extractLetterSequence(encryptedText);
  const positionsByNgram = groupPositionsByNgram(letterSequence, ngramLength);
  const divisorCounts = new Map<number, number>();

  for (const positions of positionsByNgram.values()) {
    if (positions.length < 2) {
      continue;
    }

    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const distance = positions[j] - positions[i];

        for (const divisor of divisorsOf(distance, maxKeyLength)) {
          divisorCounts.set(divisor, (divisorCounts.get(divisor) ?? 0) + 1);
        }
      }
    }
  }

  return [...divisorCounts.entries()]
    .map(([divisor, frequency]) => ({ divisor, frequency }))
    .sort((a, b) => a.divisor - b.divisor);
}

function extractLetterSequence(text: string): number[] {
  const sequence: number[] = [];
  for (const letter of text.toLowerCase()) {
    const letterIndex = reversedDictionary.get(letter);

    if (letterIndex === undefined) {
      continue;
    }

    sequence.push(letterIndex);
  }

  return sequence;
}

function groupPositionsByNgram(
  letterSequence: number[],
  ngramLength: number
): Map<string, number[]> {
  const positionsByNgram = new Map<string, number[]>();

  for (let i = 0; i <= letterSequence.length - ngramLength; i++) {
    const ngram = letterSequence.slice(i, i + ngramLength).join(',');
    const positions = positionsByNgram.get(ngram);

    if (positions === undefined) {
      positionsByNgram.set(ngram, [i]);
    } else {
      positions.push(i);
    }
  }

  return positionsByNgram;
}

function divisorsOf(n: number, max: number): number[] {
  const divisors: number[] = [];

  for (let d = 2; d <= max; d++) {
    if (n % d === 0) {
      divisors.push(d);
    }
  }

  return divisors;
}
