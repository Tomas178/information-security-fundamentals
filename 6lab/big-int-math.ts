import { gcd } from 'bigint-crypto-utils';

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
