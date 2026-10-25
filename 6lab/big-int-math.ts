import { gcd } from 'bigint-crypto-utils';
import { bitLength } from './pagalbines-funkcijos.js';

export function integerRoot(value: bigint, degree: bigint): bigint {
  let low = 0n;
  let high = 1n << (BigInt(bitLength(value)) / degree + 1n);

  while (low < high) {
    const middle = (low + high + 1n) / 2n;
    if (middle ** degree <= value) {
      low = middle;
    } else {
      high = middle - 1n;
    }
  }

  return low;
}

export function pollardRho(n: bigint): bigint {
  if (n % 2n === 0n) {
    return 2n;
  }

  for (let c = 1n; ; c++) {
    const next = (x: bigint) => (x * x + c) % n;
    let tortoise = 2n;
    let hare = 2n;
    let divisor = 1n;

    while (divisor === 1n) {
      tortoise = next(tortoise);
      hare = next(next(hare));
      divisor = gcd(tortoise > hare ? tortoise - hare : hare - tortoise, n);
    }

    if (divisor !== n) {
      return divisor;
    }
  }
}
