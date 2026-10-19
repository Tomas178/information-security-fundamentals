export interface User {
  passwordHash: string;
  totpSecret: string | null;
  mfaEnabled: boolean;
  lastUsedStep: number;
  failedAttempts: number;
  lockedUntil: number;
}
