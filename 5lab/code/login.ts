import argon2 from 'argon2';
import { User } from './interfaces.js';
import { acceptedStep } from './totp-verification.js';
import { users } from './users-db.js';

export const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000;

export async function login(
  username: string,
  password: string,
  code: string
): Promise<boolean> {
  const user = users.get(username);
  if (!user || Date.now() < user.lockedUntil) {
    return false;
  }

  // Factor 1: the password, checked against its Argon2id hash.
  if (!(await argon2.verify(user.passwordHash, password))) {
    recordFailure(user);
    return false;
  }

  // Factor 2: the server computes the expected codes itself and compares.
  if (user.mfaEnabled) {
    const step = acceptedStep(user, code);
    if (step === null) {
      recordFailure(user);
      return false;
    }
    user.lastUsedStep = step;
  }

  user.failedAttempts = 0;
  return true;
}

function recordFailure(user: User): void {
  user.failedAttempts++;
  if (user.failedAttempts >= MAX_FAILED_ATTEMPTS) {
    user.failedAttempts = 0;
    user.lockedUntil = Date.now() + LOCK_DURATION_MS;
  }
}
