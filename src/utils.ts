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
  const cleaned = word.replace(/[.,;:!?"'""''()[\]{}—–-]/g, "").toUpperCase();

  if (cleaned.length === 0) return "";
  if (cleaned.length === 1) {
    return `<span class="focus-char">${cleaned}</span>`;
  }

  // Find the middle character
  const midIndex = Math.floor((cleaned.length - 1) / 2);
  const before = cleaned.slice(0, midIndex);
  const middle = cleaned[midIndex];
  const after = cleaned.slice(midIndex + 1);

  // Each char is 1ch wide in monospace; offset to center the focus char
  const offset = Math.ceil((after.length - before.length) / 2);
  const style = offset !== 0 ? ` style="margin-left: ${offset}ch"` : "";

  return `<span class="word-text"${style}>${before}<span class="focus-char">${middle}</span>${after}</span>`;
}
