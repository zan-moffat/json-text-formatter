import "./style.css";
import { formatDeck } from "./formatter";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <main class="page">
    <header>
      <h1>JSON Deck Formatter</h1>
      <p>Paste a deck’s JSON below and convert it to the bespoke format.</p>
    </header>

    <section class="formatter">
      <div class="field">
        <label for="json-input">JSON input</label>
        <textarea
          id="json-input"
          placeholder='Paste JSON here...'
          spellcheck="false"
        ></textarea>
      </div>

      <div class="actions">
        <button id="convert-button" class="primary">Convert</button>
        <button id="clear-button" class="secondary">Clear</button>
      </div>

      <p id="error-message" class="error" role="alert"></p>

      <div class="field">
        <label for="formatted-output">Formatted output</label>
        <textarea
          id="formatted-output"
          placeholder="The formatted deck will appear here..."
          readonly
          spellcheck="false"
        ></textarea>
      </div>

      <button id="copy-button" class="secondary" disabled>
        Copy output
      </button>
    </section>
  </main>
`;

const input = document.querySelector<HTMLTextAreaElement>("#json-input");
const output =
  document.querySelector<HTMLTextAreaElement>("#formatted-output");
const convertButton =
  document.querySelector<HTMLButtonElement>("#convert-button");
const clearButton =
  document.querySelector<HTMLButtonElement>("#clear-button");
const copyButton =
  document.querySelector<HTMLButtonElement>("#copy-button");
const errorMessage =
  document.querySelector<HTMLParagraphElement>("#error-message");

if (
  !input ||
  !output ||
  !convertButton ||
  !clearButton ||
  !copyButton ||
  !errorMessage
) {
  throw new Error("The application interface could not be initialized.");
}

convertButton.addEventListener("click", () => {
  errorMessage.textContent = "";

  try {
    output.value = formatDeck(input.value);
    copyButton.disabled = false;
  } catch (error) {
    output.value = "";
    copyButton.disabled = true;

    errorMessage.textContent =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred.";
  }
});

clearButton.addEventListener("click", () => {
  input.value = "";
  output.value = "";
  errorMessage.textContent = "";
  copyButton.disabled = true;
  input.focus();
});

copyButton.addEventListener("click", async () => {
  if (!output.value) {
    return;
  }

  try {
    await navigator.clipboard.writeText(output.value);

    copyButton.textContent = "Copied!";

    window.setTimeout(() => {
      copyButton.textContent = "Copy output";
    }, 1500);
  } catch {
    errorMessage.textContent =
      "The browser could not copy the output. Select and copy it manually.";
  }
});