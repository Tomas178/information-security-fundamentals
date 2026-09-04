export function isUpperCase(char: string): boolean {
  return char === char.toUpperCase() && char !== char.toLowerCase();
}
