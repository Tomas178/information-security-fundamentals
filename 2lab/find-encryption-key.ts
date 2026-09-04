import { getCaesarCipherSplits } from './get-caesar-cipher-splits.js';
import { friedmannKappaTest } from './keyLengthTests/friedmann-kappa.js';

export function findEncryptionKey(text: string): string {
  let encryptionKey = '';
  const encryptionKeyLength = friedmannKappaTest(text);
  const caesarCipherSplits = getCaesarCipherSplits(text, encryptionKeyLength);
  console.log({ caesarCipherSplits });

  return encryptionKey;
}
