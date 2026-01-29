export function parseWords(text: string): string[] {
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);
}

export function calculateInterval(wordsPerMinute: number): number {
  return 60000 / wordsPerMinute;
}
