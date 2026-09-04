import { indexedDictionary } from '../../common/dictionary/indexed-dictionary.js';
import { reversedDictionary } from '../../common/dictionary/reversed-dictionary.js';

const KP = 0.069;
const KR = 1 / indexedDictionary.size;

export function friedmannKappaTest(text: string): number {
  return Math.floor((KP - KR) / (calculateKO(text) - KR));
}

function calculateKO(text: string): number {
  const letterCounts = new Map<number, number>();

  for (const letter of text.toLowerCase()) {
    const letterIndex = reversedDictionary.get(letter);

    if (letterIndex === undefined) {
      continue;
    }

    letterCounts.set(letterIndex, (letterCounts.get(letterIndex) ?? 0) + 1);
  }

  const N = [...letterCounts.values()].reduce((sum, count) => sum + count, 0);

  if (N < 2) {
    throw new Error('Text must contain at least two letters!');
  }

  let sum = 0;
  for (const count of letterCounts.values()) {
    sum += count * (count - 1);
  }

  return sum / (N * (N - 1));
}
