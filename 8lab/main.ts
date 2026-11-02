import { generatePrimeSync } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { modInv, modPow } from 'bigint-crypto-utils';
import { sqrt } from 'extra-bigint';

type VariantSection = Record<string, bigint>;

// Ši funkcija sugeneruota buvo su dirbtiniu intelektu
function parseVariant(fileContent: string): VariantSection[] {
  return fileContent
    .split(/^\s*\d+\.\s*$/m)
    .slice(1)
    .map((section) =>
      Object.fromEntries(
        [...section.matchAll(/(\w+)\s*=\s*(\d+)/g)].map(([, name, value]) => [
          name,
          BigInt(value),
        ])
      )
    );
}

function diffieHellmanSecret({ g, p, a, b }: VariantSection): bigint {
  const serverPublicKey = modPow(g, b, p);

  return modPow(serverPublicKey, a, p);
}

function ceilSquareRoot(value: bigint): bigint {
  const root = sqrt(value)!;

  return root * root < value ? root + 1n : root;
}

function babyStepGiantStep({ g, p, x }: VariantSection): bigint | undefined {
  const m = ceilSquareRoot(p - 1n);

  const gm = modPow(g, m, p);
  const r1 = new Map<bigint, bigint>();
  for (let j = 0n, value = 1n; j < m; j++, value = (value * gm) % p) {
    if (!r1.has(value)) {
      r1.set(value, j);
    }
  }

  const gInverse = modInv(g, p);
  for (let i = 0n, value = x; i < m; i++, value = (value * gInverse) % p) {
    const j = r1.get(value);
    if (j !== undefined) {
      return (m * j + i) % (p - 1n);
    }
  }
}

function isGenerator(
  g: bigint,
  p: bigint,
  primeFactorsOfPhi: bigint[]
): boolean {
  const phi = p - 1n;

  return primeFactorsOfPhi.every((factor) => modPow(g, phi / factor, p) !== 1n);
}

const GENERATOR = 2n;
const PRIME_BITS = 100;
function generatePrimeWithGenerator(bits: number, g: bigint): bigint {
  while (true) {
    const p = generatePrimeSync(bits, { safe: true, bigint: true });
    if (isGenerator(g, p, [2n, (p - 1n) / 2n])) {
      return p;
    }
  }
}

const variantFilePath = new URL('./7.txt', import.meta.url);
const variantFile = await readFile(variantFilePath, { encoding: 'utf-8' });
const [keyExchange, discreteLogarithm] = parseVariant(variantFile);

const answers = [
  ['Paslaptis', diffieHellmanSecret(keyExchange)],
  ['a', babyStepGiantStep(discreteLogarithm)],
  ['p', generatePrimeWithGenerator(PRIME_BITS, GENERATOR)],
];

console.log('Atsakymas:');
console.log(
  answers
    .map(([label, value], index) => `${index + 1}. ${label}: ${value}`)
    .join('\n')
);
