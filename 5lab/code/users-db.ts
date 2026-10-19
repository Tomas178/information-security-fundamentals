import argon2 from 'argon2';
import { User } from './interfaces.js';

export const users = new Map<string, User>();

export async function register(
  username: string,
  password: string
): Promise<void> {
  users.set(username, {
    passwordHash: await argon2.hash(password),
    totpSecret: null,
    mfaEnabled: false,
    lastUsedStep: -1,
    failedAttempts: 0,
    lockedUntil: 0,
  });
}
