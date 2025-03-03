import { COMMAND } from "../models/constants";

export function getWebviewContent(): string {
  const { modifier, separator, shift } = (() => {
    const platform = process.platform;
    if (platform === "darwin") {
      return {
        modifier: "⌘",
        separator: "",
        shift: "⇧",
      };
    }
    return {
      modifier: "Ctrl",
      separator: "+",
      shift: "⇧",
    };
  })();

  return /*html*/ `
  <!DOCTYPE html>
  <html lang="en">
      <head>
          <meta charset="utf-8" />
          <title>Local AI Chat</title>
          
          <style>
              body,
              html {
                  height: 100%;
                  margin: 10px;
                  padding: 10px;
                  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  box-sizing: border-box;
                  overflow: hidden;
                  width: 100%;
                  color: var(--vscode-editor-foreground);
                  background-color: var(--vscode-editor-background);
              }
              h1 {
                  font-size: 24px;
                  margin-bottom: 20px;
              }
              #container {
                  display: flex;
                  flex-direction: column;
                  width: 100%;
                  height: 90vh;
              }
              #prompt {
                  width: 100%;
                  padding: 12px;
                  font-size: 1rem;
                  border: 1px solid var(--vscode-editorWidget-border);
                  border-radius: 6px;
                  margin-bottom: 12px;
                  resize: vertical;
                  min-height: 80px;
                  background-color: var(--vscode-input-background);
                  color: var(--vscode-input-foreground);
              }
              #askBtn {
                  background-color: var(--vscode-button-background);
                  color: var(--vscode-button-foreground);
                  border: none;
                  padding: 12px;
                  font-size: 1rem;
                  border-radius: 6px;
                  cursor: pointer;
                  transition: background-color 0.3s ease;
              }
              #askBtn:hover {
                  background-color: var(--vscode-button-hoverBackground);
              }
              #askBtn:disabled {
                  background-color: var(--vscode-button-secondaryBackground);
                  cursor: not-allowed;
              }
              /* "Select Files" button styling */
              #selectFilesBtn {
                  background-color: var(--vscode-button-background);
                  color: var(--vscode-button-foreground);
                  border: none;
                  padding: 12px;
                  font-size: 1rem;
                  border-radius: 6px;
                  cursor: pointer;
                  transition: background-color 0.3s ease;
              }
              #selectFilesBtn:hover {
                  background-color: var(--vscode-button-hoverBackground);
              }
              #selectFilesBtn:disabled {
                  background-color: var(--vscode-button-secondaryBackground);
                  cursor: not-allowed;
              }
              /* "Clear Files" button styling */
              #clearFilesBtn {
                  background-color: var(--vscode-button-background);
                  color: var(--vscode-button-foreground);
                  border: none;
                  padding: 12px;
                  font-size: 1rem;
                  border-radius: 6px;
                  cursor: pointer;
                  transition: background-color 0.3s ease;
              }
              #clearFilesBtn:hover {
                  background-color: var(--vscode-button-hoverBackground);
              }
              #clearFilesBtn:disabled {
                  background-color: var(--vscode-button-secondaryBackground);
                  cursor: not-allowed;
              }
              /* Files container for button and file info */
              .files-container {
                  display: flex;
                  align-items: center;
                  gap: 12px;
                  margin-top: 12px;
                  margin-bottom: 12px;
              }
              #context {
                  display: none;
                  padding: 10px;
              }
              #selectedFiles {
                  display: block;
                  padding: 10px;
              }
              .text {
                  padding: 12px;
                  background-color: var(--vscode-editorInfo-background);
                  font-weight: bold;
                  border-radius: 6px;
                  color: var(--vscode-editorInfo-foreground);
              }
              #response-container {
                  flex-grow: 1;
                  overflow-y: auto;
                  padding: 12px;
                  background-color: var(--vscode-editorWidget-background);
                  border-radius: 6px;
                  margin-top: 12px;
                  font-family: monospace, monospace;
                  white-space: pre-wrap;
                  word-wrap: break-word;
                  color: var(--vscode-editor-foreground);
              }
              .bold {
                  font-weight: bold;
              }
              .checkbox-container {
                  display: flex;
                  align-items: center;
                  padding: 8px 12px;
                  margin: 8px 0;
                  border-radius: 6px;
                  background-color: var(--vscode-editorWidget-background);
                  transition: background-color 0.2s ease;
              }
  
              .checkbox-container:hover {
                  background-color: var(--vscode-list-hoverBackground);
              }
  
              #useActiveEditor {
                  appearance: none;
                  width: 16px;
                  height: 16px;
                  margin-right: 12px;
                  border: 1px solid var(--vscode-checkbox-border);
                  border-radius: 3px;
                  background-color: var(--vscode-checkbox-background);
                  cursor: pointer;
                  position: relative;
                  vertical-align: middle;
              }
  
              #useActiveEditor:checked {
                  background-color: var(--vscode-checkbox-selectBackground);
                  border-color: var(--vscode-checkbox-selectBorder);
              }
  
              #useActiveEditor:checked::after {
                  content: "✓";
                  position: absolute;
                  top: -2px;
                  left: 2px;
                  color: var(--vscode-checkbox-foreground);
                  font-size: 14px;
              }
  
              .checkbox-container label {
                  cursor: pointer;
                  user-select: none;
                  font-size: 13px;
                  display: flex;
                  align-items: center;
                  color: var(--vscode-foreground);
              }
  
              .info {
                  font-size: 12px;
                  opacity: 0.8;
                  margin-left: 28px;
                  margin-top: 4px;
                  color: var(--vscode-descriptionForeground);
              }
              .loading {
                  position: relative;
                  opacity: 0.6;
              }
              .loading::after {
                  content: "";
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  width: 16px;
                  height: 16px;
                  margin: -8px 0 0 -8px;
                  border: 2px solid var(--vscode-button-foreground);
                  border-radius: 50%;
                  border-right-color: transparent;
                  animation: spin 1s linear infinite;
              }
              @keyframes spin {
                  100% {
                      transform: rotate(360deg);
                  }
              }
              .button-container button {
                  display: flex;
                  align-items: center;
                  gap: 4px;
              }
              .shortcut {
                  opacity: 0.7;
                  font-size: 0.9em;
                  margin-left: 8px;
                  white-space: nowrap;
              }
              #response {
                  line-height: 1.5;
                  padding: 8px;
              }
              .response-meta {
                  font-size: 0.9em;
                  color: var(--vscode-descriptionForeground);
                  margin-bottom: 8px;
                  padding-bottom: 8px;
                  border-bottom: 1px solid var(--vscode-editorWidget-border);
              }

          </style>
          
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlight.js@11.7.0/styles/github.min.css">
          
      </head>
      <body>
          <h1>Local AI Chat</h1>
          <div id="container">
              <textarea id="prompt" placeholder="Enter your instructions here"></textarea>
              <div class="checkbox-container">
                  <input type="checkbox" id="useActiveEditor" checked />
                  <label for="useActiveEditor">Use active editor content</label>
              </div>
              <div class="info">
                  When enabled, includes the current file's content in the AI context
              </div>
              <div id="context" class="text">No active windows or selected text to be used as AI context</div>
              <div class="files-container">
                  <button id="selectFilesBtn">Select Files<span class="shortcut">(${modifier}${separator}K)</span></button>
                  <button id="clearFilesBtn" disabled>Clear Files<span class="shortcut">(${modifier}${separator}${shift}${separator}K)</span></button>
                  <div id="selectedFiles" class="info">Select additional project files to be used as AI context.</div>
              </div>
              <div class="button-container">
                  <button id="askBtn">Ask<span class="shortcut">(${modifier}${separator}Enter)</span></button>
              </div>
              <div id="response-container">
                  <div id="response">Your AI response will appear here.</div>
              </div>
          </div>
          <script>
              const vscode = acquireVsCodeApi();
              const COMMAND = ${JSON.stringify(COMMAND)};
              const contextElement = document.getElementById("context");
              const selectedFilesElement = document.getElementById("selectedFiles");
              const responseElement = document.getElementById("response");
              const promptElement = document.getElementById("prompt");
              const askBtn = document.getElementById("askBtn");
              const useActiveEditorCheckbox = document.getElementById("useActiveEditor");
              const selectFilesBtn = document.getElementById("selectFilesBtn");
              const clearFilesBtn = document.getElementById("clearFilesBtn");
              const responseContainer = document.getElementById("response-container");

              // Listen for messages from the extension.
              window.addEventListener("message", (event) => {
                  const { command, data } = event.data;
                  switch (command) {
                      case COMMAND.UPDATE_CONTEXT:
                          if (data && data.trim()) {
                              contextElement.innerText = data;
                              contextElement.style.display = "block";
                          } else {
                              contextElement.style.display = "none";
                          }
                          break;
                      case COMMAND.CHAT_RESPONSE:
                          //responseElement.innerHTML = marked.parse(data);
                          responseElement.innerHTML = data;
                          responseContainer.scrollTop = responseContainer.scrollHeight;
                          
                          askBtn.disabled = false;
                          askBtn.classList.remove("loading");
                          break;
                      case COMMAND.SELECTED_FILES:
                          if (data && Array.isArray(data) && data.length > 0) {
                              selectedFilesElement.innerText = data.map((file) => file.name).join(", ");
                              selectedFilesElement.style.display = "block";
                              clearFilesBtn.disabled = false;
                          } else if (data && typeof data === "string" && data.trim() !== "") {
                              selectedFilesElement.innerText = data;
                              selectedFilesElement.style.display = "block";
                              clearFilesBtn.disabled = false;
                          } else {
                              selectedFilesElement.style.display = "none";
                          }
                          break;
                      case COMMAND.ERROR:
                          responseElement.innerHTML = '<span style="color: var(--vscode-errorForeground);">Error: ' + data + "</span>";
                          askBtn.disabled = false;
                          askBtn.classList.remove("loading");
                          break;
                  }
              });
  
              // Send message when "Ask" is clicked.
              askBtn.addEventListener("click", () => {
                  const text = promptElement.value.trim();
                  if (text) {
                      askBtn.disabled = true;
                      askBtn.classList.add("loading");
                      responseElement.textContent = "Thinking...";
                      vscode.postMessage({
                          command: COMMAND.CHAT,
                          text,
                          useActiveEditor: useActiveEditorCheckbox.checked,
                      });
                  }
              });
  
              // Keyboard shortcuts.
              document.addEventListener("keydown", (e) => {
                  if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                      e.preventDefault();
                      askBtn.click();
                  } else if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === "k" || e.key === "K")) {
                      e.preventDefault();
                      if (!clearFilesBtn.disabled) {
                          clearFilesBtn.click();
                      }
                  } else if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
                      e.preventDefault();
                      selectFilesBtn.click();
                  }
              });
  
              // Trigger file selection by sending a message to the extension.
              selectFilesBtn.addEventListener("click", () => {
                  vscode.postMessage({
                      command: COMMAND.SELECTFILES,
                  });
              });
  
              // Clear selected files when "Clear Files" is clicked.
              clearFilesBtn.addEventListener("click", () => {
                  selectedFilesElement.innerText = "";
                  selectedFilesElement.style.display = "none";
                  vscode.postMessage({
                      command: COMMAND.CLEARFILES,
                  });
                  clearFilesBtn.disabled = true;
                  contextElement.style.display = "none";
              });
          </script>
      </body>
  </html>
  `;
}
