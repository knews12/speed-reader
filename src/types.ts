export interface AppState {
  text: string;
  words: string[];
  currentWordIndex: number;
  isPlaying: boolean;
  wordsPerMinute: number;
  statistics: {
    totalWordsRead: number;
    totalSessions: number;
  };
}

export type StateListener = (state: AppState) => void;

export type RouteHandler = (container: HTMLElement) => void;
