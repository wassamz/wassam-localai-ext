export function getWebviewContent(): string {
  return /*html*/ `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>Local AI Helper</title>
        <style>
          body, html {
            height: 100%;
            margin: 10px;
            padding: 10px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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
  
          #context {
            padding: 12px;
            background-color: var(--vscode-editorInfo-background);
            font-weight: bold;
            border-radius: 6px;
            margin-top: 12px;
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
        </style>
      </head>
      <body>
        <h1>Local AI Helper</h1>
        <div id="container">
          <textarea id="prompt" placeholder="Enter your instructions here"></textarea>
          <button id="askBtn">Ask</button>
          <div id="context">No active context.</div>
          <div id="response-container">
            <div id="response">Your AI response will appear here.</div>
          </div>
        </div>
  
        <script>
          const vscode = acquireVsCodeApi();
          const contextElement = document.getElementById('context');
          const responseElement = document.getElementById('response');
          const promptElement = document.getElementById('prompt');
          const askBtn = document.getElementById('askBtn');
          const responseContainer = document.getElementById('response-container');
  
          promptElement.addEventListener('mousedown', () => {
            vscode.postMessage({ command: 'getContext' });
          });

          window.addEventListener('message', event => {
            const { command, text } = event.data;
            if (command === 'updateContext') {
              contextElement.innerText = text;
            } else if (command === 'chatResponse') {
              responseElement.innerHTML = text;
              responseContainer.scrollTop = responseContainer.scrollHeight;
            }
          });
  
          askBtn.addEventListener('click', () => {
            const text = promptElement.value.trim();
            if (text) {
              askBtn.disabled = true;
              vscode.postMessage({ command: 'chat', text });
            }
          });
  
          window.addEventListener('message', event => {
            if (event.data.command === 'chatResponse') {
              askBtn.disabled = false;
            }
          });
        </script>
      </body>
      </html>
    `;
}
