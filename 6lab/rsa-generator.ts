import {
  isProbablePrime,
  modInverse,
  modPow,
  randomBigInt,
} from './big-int-math.js';
import { PrivateKey, PublicKey, RsaKeys } from './interfaces.js';

// Slide 7: with a prime e, choosing p and q so that p mod e != 1 keeps e and
// phi(n) = (p - 1)(q - 1) coprime. The top two bits make n exactly 2 * bits.
function generatePrime(bits: number, e: bigint): bigint {
  const topTwoBits = 3n << BigInt(bits - 2);

  while (true) {
    const candidate = randomBigInt(bits) | topTwoBits | 1n;
    if (candidate % e !== 1n && isProbablePrime(candidate)) {
      return candidate;
    }
  }
}

export function eulerFunction(p: bigint, q: bigint): bigint {
  return (p - 1n) * (q - 1n);
}

export function privateExponent(e: bigint, p: bigint, q: bigint): bigint {
  return modInverse(e, eulerFunction(p, q));
}

export function rsaGenerator(e: bigint, primeBits = 256): RsaKeys {
  const p = generatePrime(primeBits, e);
  let q = generatePrime(primeBits, e);
  while (q === p) {
    q = generatePrime(primeBits, e);
  }

  return { p, q, n: p * q, e, d: privateExponent(e, p, q) };
}

export function encrypt(message: bigint, { e, n }: PublicKey): bigint {
  if (message >= n) {
    throw new Error('Message must be smaller than n');
  }
  return modPow(message, e, n);
}

export function decrypt(cipher: bigint, { d, n }: PrivateKey): bigint {
  return modPow(cipher, d, n);
}
