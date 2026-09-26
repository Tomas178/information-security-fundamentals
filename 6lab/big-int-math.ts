import { randomBytes } from 'node:crypto';
import { bitLength, bytesToInt } from './pagalbines-funkcijos.js';

function mod(x: bigint, n: bigint): bigint {
  return ((x % n) + n) % n;
}

export function modPow(
  base: bigint,
  exponent: bigint,
  modulus: bigint
): bigint {
  let result = 1n;
  let power = mod(base, modulus);
  let remainingExponent = exponent;

  while (remainingExponent > 0n) {
    if ((remainingExponent & 1n) === 1n) {
      result = (result * power) % modulus;
    }
    power = (power * power) % modulus;
    remainingExponent >>= 1n;
  }

  return result;
}

export function gcd(a: bigint, b: bigint): bigint {
  let [x, y] = [a, b];
  while (y !== 0n) {
    [x, y] = [y, x % y];
  }
  return x;
}

// Extended Euclidean algorithm.
export function modInverse(a: bigint, m: bigint): bigint {
  let [remainder, nextRemainder] = [mod(a, m), m];
  let [coefficient, nextCoefficient] = [1n, 0n];

  while (nextRemainder !== 0n) {
    const quotient = remainder / nextRemainder;
    [remainder, nextRemainder] = [
      nextRemainder,
      remainder - quotient * nextRemainder,
    ];
    [coefficient, nextCoefficient] = [
      nextCoefficient,
      coefficient - quotient * nextCoefficient,
    ];
  }

  if (remainder !== 1n) {
    throw new Error(`${a} has no inverse modulo ${m}`);
  }

  return mod(coefficient, m);
}

// Largest x such that x^degree <= value.
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

export function randomBigInt(bits: number): bigint {
  const bytes = randomBytes(Math.ceil(bits / 8));
  return bytesToInt(bytes) >> BigInt(bytes.length * 8 - bits);
}

// Miller-Rabin: a composite n survives one random base with probability <= 1/4.
export function isProbablePrime(n: bigint, rounds = 40): boolean {
  if (n < 4n) return n === 2n || n === 3n;
  if (n % 2n === 0n) return false;

  let d = n - 1n;
  let s = 0;
  while (d % 2n === 0n) {
    d /= 2n;
    s++;
  }

  for (let round = 0; round < rounds; round++) {
    const base = 2n + (randomBigInt(bitLength(n)) % (n - 3n));
    let x = modPow(base, d, n);
    if (x === 1n || x === n - 1n) continue;

    let isComposite = true;
    for (let i = 1; i < s; i++) {
      x = (x * x) % n;
      if (x === n - 1n) {
        isComposite = false;
        break;
      }
    }
    if (isComposite) return false;
  }

  return true;
}

// Pollard's rho with Floyd's cycle detection. It needs about sqrt(p) steps,
// where p is the smallest prime factor of n, so a 40-bit factor falls quickly.
export function pollardRho(n: bigint): bigint {
  if (n % 2n === 0n) return 2n;

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

    if (divisor !== n) return divisor;
  }
}
