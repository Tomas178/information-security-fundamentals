import { createHash, scryptSync } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import bcrypt from 'bcrypt';
import argon2 from 'argon2';
import {
  buildFailureMessage,
  buildStartMessage,
  buildSuccessMessage,
} from './message-builder.js';

export interface HashConfig {
  hashToFind: string;
  salt: string | null;
}

const md5Config: HashConfig = {
  hashToFind: '606a85b0d404cfb272c2c7bca1768c9b',
  salt: '604ba56c76edce75',
};

const sha256Config: HashConfig = {
  hashToFind:
    'b713ac97b26e6f18b504a6e61729529773bf00844a3d7e1d274149e50c9943a5',
  salt: 'be8ff55288d6ec29',
};

const bcryptConfig: HashConfig = {
  hashToFind: '$2b$11$R0sm7V1kUxoUanxr9ghlz.YlZxiEyjiV1t9USdxg.yP0NsyvBra7a',
  salt: null,
};

const scryptConfig: HashConfig = {
  hashToFind:
    '9034f524e6c6675c95b84991d8dbf2c926ec783301481272baf8dd870436a5fd317554a952fc39ec94462e57a8e69064671d8bc04b495e54d7c946c841a93f06',
  salt: '18d484f315915fb5',
};

const argon2Config: HashConfig = {
  hashToFind:
    '$argon2id$v=19$m=47104,t=4,p=1$KUqF3d3Mc7bekS2HmJd8Zw$+xMgndkhrFHbeJWe/qhTIoKzlIZEqY0xDlQ5gdJqm58',
  salt: null,
};

const HASHES_TO_FIND = {
  MD5: md5Config,
  SHA256: sha256Config,
  bcrypt: bcryptConfig,
  scrypt: scryptConfig,
  argon2: argon2Config,
};

const ALGORITHM = {
  MD5: 'md5',
  SHA256: 'sha256',
} as const;

type ObjectValues<T> = T[keyof T];
type Algorithm = ObjectValues<typeof ALGORITHM>;

const createSpecificHash = (algorithm: Algorithm, input: string): string =>
  createHash(algorithm).update(input, 'utf-8').digest('hex');

const isHashMatch = (
  algorithm: Algorithm,
  password: string,
  hashToFind: string
) => createSpecificHash(algorithm, password) === hashToFind;

const SCRYPT_OPTIONS = { N: Math.pow(2, 16), r: 2, p: 1 };

function isScryptMatch(
  password: string,
  salt: string,
  hashToFind: string
): boolean {
  const keyLength = hashToFind.length / 2;
  const derivedKey = scryptSync(password, salt, keyLength, SCRYPT_OPTIONS);
  return derivedKey.toString('hex') === hashToFind;
}

const isBcryptMatch = (password: string, hashToFind: string): boolean =>
  bcrypt.compareSync(password, hashToFind);

const isArgon2Match = (
  password: string,
  hashToFind: string
): Promise<boolean> => argon2.verify(hashToFind, password).catch(() => false);

const filePath = new URL('./rockyou.txt', import.meta.url);
const passwordsFile = await readFile(filePath, { encoding: 'utf-8' });

const allPasswords = passwordsFile
  .split(/\r?\n/)
  .filter(line => line.length > 0);

const first1000Passwords = allPasswords.slice(0, 1000);

async function findPassword(
  algorithmLabel: string,
  passwordsDictionary: string[],
  hashConfig: HashConfig,
  isMatch: (
    password: string,
    hashConfig: HashConfig
  ) => boolean | Promise<boolean>
): Promise<string | null> {
  console.log(algorithmLabel);
  console.log(buildStartMessage(hashConfig));
  for (const password of passwordsDictionary) {
    if (await isMatch(password, hashConfig)) {
      console.log(buildSuccessMessage(hashConfig, password));
      console.log('\n\n');
      return password;
    }
  }

  console.log(buildFailureMessage(hashConfig));
  console.log('\n\n');
  return null;
}

await findPassword(
  'MD5',
  allPasswords,
  HASHES_TO_FIND.MD5,
  (password, config) =>
    isHashMatch(ALGORITHM.MD5, password + config.salt, config.hashToFind)
);

await findPassword(
  'SHA256',
  allPasswords,
  HASHES_TO_FIND.SHA256,
  (password, config) =>
    isHashMatch(ALGORITHM.SHA256, password + config.salt, config.hashToFind)
);

await findPassword(
  'BCRYPT',
  first1000Passwords,
  HASHES_TO_FIND.bcrypt,
  (password, config) => isBcryptMatch(password, config.hashToFind)
);

await findPassword(
  'SCRYPT',
  first1000Passwords,
  HASHES_TO_FIND.scrypt,
  (password, config) => isScryptMatch(password, config.salt!, config.hashToFind)
);

await findPassword(
  'ARGON2',
  first1000Passwords,
  HASHES_TO_FIND.argon2,
  (password, config) => isArgon2Match(password, config.hashToFind)
);
