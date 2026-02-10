import type { AppState, StateListener } from './types';
import { parseWords } from './utils';

const STORAGE_KEY = 'speed-reader-state';

const DEFAULT_TEXT = `Welcome to Speed Reader, a tool designed to help you read faster and more efficiently. Traditional reading involves moving your eyes across lines of text, which creates unnecessary delays as your brain processes each word individually. Speed reading eliminates this inefficiency by presenting one word at a time in a fixed position, allowing your eyes to remain stationary while your brain focuses entirely on comprehension.

The benefits of speed reading are substantial. Research suggests that the average person reads at about 200 to 250 words per minute, but with practice using tools like this one, you can gradually increase your reading speed to 400, 500, or even 600 words per minute while maintaining strong comprehension. This means you could potentially read twice as much material in the same amount of time, whether that's books, articles, reports, or any other written content.

Speed reading is particularly valuable in our information-rich world where we're constantly bombarded with text from emails, documents, news articles, and social media. By training yourself to read faster, you can stay informed without feeling overwhelmed, process work documents more efficiently, and find more time for leisure reading. The key is consistent practice, starting at a comfortable speed and gradually increasing as your brain adapts to processing information more quickly.

To get started, simply click the Start Reading button below. Use the speed slider to adjust the words per minute to a comfortable level, then gradually increase it as you improve. The restart button lets you begin again from the first word, and you can use the arrow keys to navigate when paused. Happy reading!`;

const defaultState: AppState = {
  text: DEFAULT_TEXT,
  words: parseWords(DEFAULT_TEXT),
  currentWordIndex: 0,
  isPlaying: false,
  wordsPerMinute: 200,
  statistics: {
    totalWordsRead: 0,
    totalSessions: 0,
  },
};

function loadFromStorage(): AppState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as AppState;
      return { ...parsed, isPlaying: false };
    }
  } catch {
    // Ignore parse errors
  }
  return defaultState;
}

function saveToStorage(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage errors
  }
}

let state: AppState = loadFromStorage();
const listeners: Set<StateListener> = new Set();

export function getState(): AppState {
  return state;
}

export function setState(partial: Partial<AppState>): void {
  state = { ...state, ...partial };
  saveToStorage(state);
  listeners.forEach((listener) => listener(state));
}

export function subscribe(listener: StateListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
