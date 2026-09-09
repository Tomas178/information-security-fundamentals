// Failas konvertuotas iš pagalbines_funkcjos.py su Claude pagalba.
function bitLength(input: bigint): number {
  if (input === 0n) return 0;
  return input.toString(2).length;
}

function byteLength(input: bigint): number {
  return Math.floor((bitLength(input) + 7) / 8);
}

function stringToBytes(input: string): Uint8Array {
  return new TextEncoder().encode(input);
}

function bytesToInt(input: Uint8Array): bigint {
  let result = 0n;
  for (const byte of input) {
    result = (result << 8n) | BigInt(byte);
  }
  return result;
}

function intToBytes(input: bigint): Uint8Array {
  const len = byteLength(input);
  const bytes = new Uint8Array(len);
  let n = input;
  for (let i = len - 1; i >= 0; i--) {
    bytes[i] = Number(n & 0xffn);
    n >>= 8n;
  }
  return bytes;
}

function bytesToString(input: Uint8Array): string {
  return new TextDecoder('utf-8').decode(input);
}

function intToString(input: bigint): string {
  return bytesToString(intToBytes(input));
}

function stringToInt(input: string): bigint {
  return bytesToInt(stringToBytes(input));
}

const vardas = 'Vardas Pavardė';
const integer = stringToInt(vardas);
console.log(integer);
const str = intToString(integer);
console.log(str);
