import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

interface HashConfig {
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

const HASHES_TO_FIND = {
  MD5: md5Config,
  SHA256: sha256Config,
};

const ALGORITHM = {
  MD5: 'md5',
  SHA256: 'sha256',
};

type ObjectValues<T> = T[keyof T];
type Algorithm = ObjectValues<typeof ALGORITHM>;

const createSpecificHash = (algorithm: Algorithm, input: string): string =>
  createHash(algorithm).update(input, 'utf-8').digest('hex');

const isHashMatch = (
  algorithm: Algorithm,
  password: string,
  hashToFind: string
) => createSpecificHash(algorithm, password) === hashToFind;

const filePath = new URL('./rockyou.txt', import.meta.url);
const passwordsFile = await readFile(filePath, { encoding: 'utf-8' });

const passwords = passwordsFile.split(/\r?\n/).filter(line => line.length > 0);

console.log('MD5');
console.log(
  `Finding password for hash: '${HASHES_TO_FIND.MD5.hashToFind}' with salt '${HASHES_TO_FIND.MD5.salt}'`
);
let foundMD5Hash = false;
for (const password of passwords) {
  if (
    isHashMatch(
      ALGORITHM.MD5,
      password + HASHES_TO_FIND.MD5.salt,
      HASHES_TO_FIND.MD5.hashToFind
    )
  ) {
    console.log(
      `Password of hash: '${HASHES_TO_FIND.MD5.hashToFind}' with salt '${HASHES_TO_FIND.MD5.salt}' is: '${password}'`
    );
    foundMD5Hash = true;
    break;
  }
}

if (!foundMD5Hash) {
  console.log(
    `No password was found for hash: '${HASHES_TO_FIND.MD5.hashToFind}' with salt '${HASHES_TO_FIND.MD5.salt}'`
  );
}
console.log('\n\n');

console.log('SHA256');
console.log(
  `Finding password for hash: '${HASHES_TO_FIND.SHA256.hashToFind}' with salt '${HASHES_TO_FIND.SHA256.salt}'`
);
let foundSHA256Hash = false;
for (const password of passwords) {
  if (
    isHashMatch(
      ALGORITHM.SHA256,
      password + HASHES_TO_FIND.SHA256.salt,
      HASHES_TO_FIND.SHA256.hashToFind
    )
  ) {
    console.log(
      `Password of hash: '${HASHES_TO_FIND.SHA256.hashToFind}' with salt '${HASHES_TO_FIND.SHA256.salt}' is: '${password}'`
    );
    foundSHA256Hash = true;
    break;
  }
}

if (!foundSHA256Hash) {
  console.log(
    `No password was found for hash: '${HASHES_TO_FIND.SHA256.hashToFind}' with salt '${HASHES_TO_FIND.SHA256.salt}'`
  );
}
