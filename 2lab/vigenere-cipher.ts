import { decrypt } from './decrypt.js';

const encryptedText = 'Ėmįąnc ąnvmėčšgųv fz čehee nčfčkž';

const encryptionKey = 'nevėžis';

console.log(
  `Decrypting text: "${encryptedText}" with key: "${encryptionKey}"...`
);
console.log(`Decrypted text: "${decrypt(encryptedText, encryptionKey)}"`);
console.log('DECRYPTION ENDED!');
