import type { AppState, StateListener } from './types';

const STORAGE_KEY = 'speed-reader-state';

const defaultState: AppState = {
  text: '',
  words: [],
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
