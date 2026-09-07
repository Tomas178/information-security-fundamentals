import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

const leakedHashesFilePath = new URL(
  './counterstrike-leaked-hashes.txt',
  import.meta.url
);
const passwordsDictionaryFilePath = new URL(
  './rockyou_1000.txt',
  import.meta.url
);

const [passwordsDictionaryFile, leakedHashesFile] = await Promise.all([
  readFile(passwordsDictionaryFilePath, { encoding: 'utf-8' }),
  readFile(leakedHashesFilePath, { encoding: 'utf-8' }),
]);

const splitByNewLine = (fileContent: string) =>
  fileContent.split(/\r?\n/).filter(line => line.length > 0);

const [allPasswords, leakedHashes] = [
  splitByNewLine(passwordsDictionaryFile),
  splitByNewLine(leakedHashesFile),
];

const crackedPasswords = new Map<string, string>();

console.time('Cracking Passwords');
for (let i = 0; i < allPasswords.length; i++) {
  const passwordHash = createHash('md5').update(allPasswords[i]).digest('hex');
  for (const leakedHash of leakedHashes) {
    if (passwordHash === leakedHash) {
      crackedPasswords.set(allPasswords[i], leakedHash);
      break;
    }
  }
}
console.timeEnd('Cracking Passwords');

console.log('\nCRACKED PASSWORDS:');
console.table(
  [...crackedPasswords.entries()].map(([password, hash]) => ({
    Password: password,
    Hash: hash,
  }))
);
console.log(`\nTotal Cracked Passwords: ${crackedPasswords.size}`);
