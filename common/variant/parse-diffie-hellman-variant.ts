export type VariantSection = Record<string, bigint>;

// Ši funkcija sugeneruota buvo su dirbtiniu intelektu
export function parseDiffieHellmanVariant(
  fileContent: string
): VariantSection[] {
  return fileContent
    .split(/^\s*\d+\.\s*$/m)
    .slice(1)
    .map((section) =>
      Object.fromEntries(
        [...section.matchAll(/(\w+)\s*=\s*(\d+)/g)].map(([, name, value]) => [
          name,
          BigInt(value),
        ])
      )
    );
}
