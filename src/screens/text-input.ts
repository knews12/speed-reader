import { getState, setState } from "../store";
import { navigate } from "../router";
import { parseWords } from "../utils";

export function renderTextInput(container: HTMLElement): void {
  const state = getState();
  const wordCount = state.words.length;
  const hasProgress =
    state.currentWordIndex > 0 && state.currentWordIndex < wordCount;

  container.innerHTML = `
    <div class="screen text-input-screen">
      <header>
        <h1 class="screen-title">Speed Reader</h1>
        <p class="subtitle">Read faster by displaying one word at a time</p>
      </header>

      <main>
        <div class="instructions">
          <p><strong>Step 1:</strong> Paste or type your text below</p>
          <p><strong>Step 2:</strong> Click "Start Reading" to begin</p>
        </div>

        <div class="textarea-wrapper">
          <textarea
            id="text-input"
            placeholder="Paste or type your text here..."
            autofocus
          >${state.text}</textarea>
        </div>

        <div class="info-bar">
          <span id="word-count">${wordCount} words</span>
          ${hasProgress ? `<span class="progress-indicator">Continue from word ${state.currentWordIndex + 1}</span>` : ""}
        </div>

        <div class="stats">
          <div class="stat">
            <span class="stat-value">${state.statistics.totalWordsRead}</span>
            <span class="stat-label">Words Read</span>
          </div>
          <div class="stat">
            <span class="stat-value">${state.statistics.totalSessions}</span>
            <span class="stat-label">Sessions</span>
          </div>
        </div>
      </main>

      <footer>
        <button id="start-btn" class="primary-btn" ${wordCount === 0 ? "disabled" : ""}>
          ${hasProgress ? "Continue Reading" : "Start Reading"}
        </button>
      </footer>
    </div>
  `;

  const textarea = document.getElementById("text-input") as HTMLTextAreaElement;
  const wordCountEl = document.getElementById("word-count") as HTMLSpanElement;
  const startBtn = document.getElementById("start-btn") as HTMLButtonElement;

  textarea.addEventListener("input", () => {
    const newText = textarea.value;
    const newWords = parseWords(newText);
    const oldWords = state.words;

    const textChanged = newText !== state.text;
    const shouldResetPosition =
      textChanged && newWords.join(" ") !== oldWords.join(" ");

    setState({
      text: newText,
      words: newWords,
      currentWordIndex: shouldResetPosition ? 0 : state.currentWordIndex,
    });

    wordCountEl.textContent = `${newWords.length} words`;
    startBtn.disabled = newWords.length === 0;

    if (shouldResetPosition) {
      startBtn.textContent = "Start Reading";
      const progressIndicator = container.querySelector(".progress-indicator");
      if (progressIndicator) {
        progressIndicator.remove();
      }
    }
  });

  startBtn.addEventListener("click", () => {
    if (getState().words.length > 0) {
      navigate("/reader");
    }
  });
}
