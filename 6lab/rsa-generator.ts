import { modInv, modPow, prime } from 'bigint-crypto-utils';
import { bitLength } from './pagalbines-funkcijos.js';
import { PrivateKey, PublicKey, RsaKeys } from './interfaces.js';

async function generatePrime(bits: number, e: bigint): Promise<bigint> {
  while (true) {
    const num = await prime(bits, 40);
    if (num % e !== 1n) {
      return num;
    }
  }
}

export function eulerFunction(p: bigint, q: bigint): bigint {
  return (p - 1n) * (q - 1n);
}

export function privateExponent(e: bigint, p: bigint, q: bigint): bigint {
  return modInv(e, eulerFunction(p, q));
}

export async function rsaGenerator(
  e: bigint,
  primeBits = 256
): Promise<RsaKeys> {
  let p: bigint;
  let q: bigint;
  do {
    p = await generatePrime(primeBits, e);
    q = await generatePrime(primeBits, e);
  } while (p === q || bitLength(p * q) !== 2 * primeBits);

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
