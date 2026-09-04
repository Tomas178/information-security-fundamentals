import { indexedDictionary } from '../common/indexed-dictionary.js';

interface CeasarCipherConfig {
  word: string;
  bias: number;
}

function encrypt(config: CeasarCipherConfig): string {}

function decrypt(config: CeasarCipherConfig): string {}

const encryptionTaskConfig = {
  word: 'Briedis girioj, o jau iešmą drožia',
  bias: 19,
};

const decryptionTaskConfig = {
  word: 'Ųrvgr vkąmcr, z tgč jaziką gčjfrg',
  bias: 19,
};

console.log(
  `Encryption of ${encryptionTaskConfig.word} is ${encrypt(encryptionTaskConfig)}`
);
console.log(
  `Decryption of ${decryptionTaskConfig.word} is ${decrypt(decryptionTaskConfig)}`
);
