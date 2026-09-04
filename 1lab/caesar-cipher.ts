import { decrypt } from './decrypt.js';
import { encrypt } from './encrypt.js';

export interface CeasarCipherConfig {
  word: string;
  bias: number;
}

const encryptionTaskConfig: CeasarCipherConfig = {
  word: 'Briedis girioj, o jau iešmą drožia',
  bias: 19,
};

const decryptionTaskConfig: CeasarCipherConfig = {
  word: 'Ųrvgr vkąmcr, z tgč jaziką gčjfrg',
  bias: 19,
};

console.log(`STARTING ENCRYPTION OF WORD: ${encryptionTaskConfig.word}`);
console.log(
  `Encryption of "${encryptionTaskConfig.word}" is "${encrypt(encryptionTaskConfig)}"`
);
console.log('ENCRYPTION ENDED!\n');

console.log(`STARTING DECRYPTION OF WORD: ${decryptionTaskConfig.word}`);
console.log(
  `Decryption of "${decryptionTaskConfig.word}" is "${decrypt(decryptionTaskConfig)}"`
);
console.log('DECRYPTION ENDED!');
