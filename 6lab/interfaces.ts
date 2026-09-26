export interface PublicKey {
  e: bigint;
  n: bigint;
}

export interface PrivateKey {
  d: bigint;
  n: bigint;
}

export interface RsaKeys extends PublicKey, PrivateKey {
  p: bigint;
  q: bigint;
}
