import { getState, setState, subscribe } from '../store';
import { navigate } from '../router';
import { calculateInterval, formatWordForDisplay } from '../utils';

class ReadingEngine {
  private intervalId: number | null = null;

  start(): void {
    const state = getState();
    if (state.words.length === 0) return;

    setState({ isPlaying: true });
    this.tick();
  }

  pause(): void {
    if (this.intervalId !== null) {
      clearTimeout(this.intervalId);
      this.intervalId = null;
    }
    setState({ isPlaying: false });
  }

  toggle(): void {
    if (getState().isPlaying) {
      this.pause();
    } else {
      this.start();
    }
  }

  private tick(): void {
    const state = getState();
    if (!state.isPlaying) return;

    const nextIndex = state.currentWordIndex + 1;

    if (nextIndex >= state.words.length) {
      this.pause();
      setState({
        statistics: {
          ...state.statistics,
          totalWordsRead: state.statistics.totalWordsRead + 1,
          totalSessions: state.statistics.totalSessions + 1,
        },
      });
      return;
    }

    setState({
      currentWordIndex: nextIndex,
      statistics: {
        ...state.statistics,
        totalWordsRead: state.statistics.totalWordsRead + 1,
      },
    });

    const interval = calculateInterval(getState().wordsPerMinute);
    this.intervalId = window.setTimeout(() => this.tick(), interval);
  }

  setSpeed(wpm: number): void {
    setState({ wordsPerMinute: wpm });
    if (getState().isPlaying) {
      if (this.intervalId !== null) {
        clearTimeout(this.intervalId);
      }
      const interval = calculateInterval(wpm);
      this.intervalId = window.setTimeout(() => this.tick(), interval);
    }
  }

  previousWord(): void {
    const state = getState();
    if (!state.isPlaying && state.currentWordIndex > 0) {
      setState({ currentWordIndex: state.currentWordIndex - 1 });
    }
  }

  nextWord(): void {
    const state = getState();
    if (!state.isPlaying && state.currentWordIndex < state.words.length - 1) {
      setState({ currentWordIndex: state.currentWordIndex + 1 });
    }
  }

  restart(): void {
    this.pause();
    setState({ currentWordIndex: 0 });
    this.start();
  }

  destroy(): void {
    this.pause();
  }
}

export function renderSpeedReader(container: HTMLElement): void {
  const state = getState();

  if (state.words.length === 0) {
    navigate('/');
    return;
  }

  const engine = new ReadingEngine();

  container.innerHTML = `
    <div class="screen speed-reader-screen">
      <header>
        <button id="back-btn" class="icon-btn" aria-label="Back">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <div class="progress-text">
          <span id="progress">Word ${state.currentWordIndex + 1} of ${state.words.length}</span>
        </div>
      </header>

      <main class="word-display">
        <span id="current-word">${formatWordForDisplay(state.words[state.currentWordIndex] || '')}</span>
      </main>

      <footer>
        <div class="speed-control">
          <label for="speed-slider">${state.wordsPerMinute} WPM</label>
          <input
            type="range"
            id="speed-slider"
            min="100"
            max="600"
            step="10"
            value="${state.wordsPerMinute}"
          />
        </div>

        <div class="playback-controls">
          <button id="restart-btn" class="secondary-btn">Restart</button>
          <button id="play-pause-btn" class="primary-btn">
            ${state.isPlaying ? 'Pause' : 'Play'}
          </button>
        </div>

        <div class="keyboard-hint">
          Space: play/pause | Arrow keys: navigate
        </div>
      </footer>
    </div>
  `;

  const currentWordEl = document.getElementById('current-word') as HTMLSpanElement;
  const progressEl = document.getElementById('progress') as HTMLSpanElement;
  const playPauseBtn = document.getElementById('play-pause-btn') as HTMLButtonElement;
  const speedSlider = document.getElementById('speed-slider') as HTMLInputElement;
  const speedLabel = speedSlider.previousElementSibling as HTMLLabelElement;
  const backBtn = document.getElementById('back-btn') as HTMLButtonElement;

  const unsubscribe = subscribe((newState) => {
    const word = newState.words[newState.currentWordIndex];
    currentWordEl.innerHTML = word ? formatWordForDisplay(word) : 'DONE';
    progressEl.textContent = `Word ${newState.currentWordIndex + 1} of ${newState.words.length}`;
    playPauseBtn.textContent = newState.isPlaying ? 'Pause' : 'Play';
  });

  const restartBtn = document.getElementById('restart-btn') as HTMLButtonElement;

  playPauseBtn.addEventListener('click', () => engine.toggle());
  restartBtn.addEventListener('click', () => engine.restart());

  speedSlider.addEventListener('input', () => {
    const wpm = parseInt(speedSlider.value, 10);
    speedLabel.textContent = `${wpm} WPM`;
    engine.setSpeed(wpm);
  });

  backBtn.addEventListener('click', () => {
    engine.destroy();
    unsubscribe();
    navigate('/');
  });

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }

    switch (e.code) {
      case 'Space':
        e.preventDefault();
        engine.toggle();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        engine.previousWord();
        break;
      case 'ArrowRight':
        e.preventDefault();
        engine.nextWord();
        break;
    }
  };

  document.addEventListener('keydown', handleKeydown);

  const originalNavigate = window.history.pushState.bind(window.history);
  window.history.pushState = function (...args) {
    engine.destroy();
    unsubscribe();
    document.removeEventListener('keydown', handleKeydown);
    return originalNavigate(...args);
  };
}
