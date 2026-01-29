export function parseWords(text: string): string[] {
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);
}

export function calculateInterval(wordsPerMinute: number): number {
  return 60000 / wordsPerMinute;
}

export function formatWordForDisplay(word: string): string {
  const cleaned = word
    .replace(/[.,;:!?"'""''()[\]{}—–-]/g, '')
    .toUpperCase();

  if (cleaned.length === 0) return '';
  if (cleaned.length === 1) {
    return `<span class="word-before"></span><span class="focus-char">${cleaned}</span><span class="word-after"></span>`;
  }

  const midIndex = Math.floor((cleaned.length - 1) / 2);
  const before = cleaned.slice(0, midIndex);
  const middle = cleaned[midIndex];
  const after = cleaned.slice(midIndex + 1);

  return `<span class="word-before">${before}</span><span class="focus-char">${middle}</span><span class="word-after">${after}</span>`;
}
