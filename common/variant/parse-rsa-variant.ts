// Ši funkcija sugeneruota buvo su dirbtiniu intelektu
export function parseRsaVariant(fileContent: string): Map<string, bigint[][]> {
  const sections = new Map<string, bigint[][]>();
  let currentSection: bigint[][] = [];

  const lines = fileContent
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  for (const line of lines) {
    if (/^\d+\.$/.test(line)) {
      currentSection = [];
      sections.set(line.slice(0, -1), currentSection);
      continue;
    }

    currentSection.push(
      line.replace(/[(),]/g, ' ').trim().split(/\s+/).map(BigInt)
    );
  }

  return sections;
}
