import { HashConfig } from './brute-force-find-password.js';

export const buildStartMessage = (hashConfig: HashConfig) =>
  hashConfig.salt
    ? `Finding password for hash: '${hashConfig.hashToFind}' with salt '${hashConfig.salt}'`
    : `Finding password for hash: '${hashConfig.hashToFind}'`;

export const buildSuccessMessage = (
  hashConfig: HashConfig,
  password: string
) =>
  hashConfig.salt
    ? `Password of hash: '${hashConfig.hashToFind}' with salt '${hashConfig.salt}' is: '${password}'`
    : `Password of hash: '${hashConfig.hashToFind}' is: '${password}'`;

export const buildFailureMessage = (hashConfig: HashConfig) =>
  hashConfig.salt
    ? `No password was found for hash: '${hashConfig.hashToFind}' with salt '${hashConfig.salt}'`
    : `No password was found for hash: '${hashConfig.hashToFind}'`;
