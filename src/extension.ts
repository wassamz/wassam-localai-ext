import * as vscode from "vscode";
import { handleChatCommand } from "./commands/chatCommand";
import { handleContextCommand } from "./commands/contextCommand";
import { COMMAND, EXTENSION_NAME, EXTENSION_PARAM_LOCALMODEL } from "./types";
import { getWebviewContent } from "./webview/webviewContent";

let lastActiveEditor: vscode.TextEditor | undefined =
  vscode.window.activeTextEditor;

export function activate(context: vscode.ExtensionContext) {
  // Update the last active editor when it changes.
  vscode.window.onDidChangeActiveTextEditor((editor) => {
    if (editor) {
      lastActiveEditor = editor;
    }
  });

  // Register the command to open/reveal the webview panel.
  const disposable = vscode.commands.registerCommand(
    "wassamLocalAI.chat",
    () => {
      // Create the webview panel and store it in the global variable.
      const panel = vscode.window.createWebviewPanel(
        "wassamLocalAI",
        "Local AI Chat",
        vscode.ViewColumn.Beside,
        {
          enableScripts: true,
          retainContextWhenHidden: true, // Retain the state when the panel is hidden.
        }
      );

      // Set the initial HTML content.
      panel.webview.html = getWebviewContent();

      // Set up the message listener.
      panel.webview.onDidReceiveMessage(async (message: any) => {
        const activeEditor = vscode.window.activeTextEditor || lastActiveEditor;
        if (message.command === COMMAND.CHAT) {
          await handleChatCommand(message.text, panel, activeEditor);
        } else if (message.command === COMMAND.CONTEXT) {
          handleContextCommand(panel, activeEditor);
        }
      });
    }
  );

  // Listen for configuration changes.
  vscode.workspace.onDidChangeConfiguration((event) => {
    if (
      event.affectsConfiguration(
        `${EXTENSION_NAME}.${EXTENSION_PARAM_LOCALMODEL}`
      )
    ) {
      const newValue = vscode.workspace
        .getConfiguration(EXTENSION_NAME)
        .get<string>(EXTENSION_PARAM_LOCALMODEL);
      vscode.window.showInformationMessage(`Local AI Model now: ${newValue}`);
    }
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {
  vscode.window.showInformationMessage(`${EXTENSION_NAME} deactivated.`);
}
