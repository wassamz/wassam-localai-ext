import * as vscode from "vscode";
import { handleChatCommand } from "./commands/chatCommand";
import { handleContextCommand } from "./commands/contextCommand";
import { handleFilesCommand } from "./commands/handelFilesCommand";
import {
  COMMAND,
  EXTENSION_NAME,
  EXTENSION_PARAM_LOCALMODEL,
} from "./models/constants";
import { FileInfo } from "./models/interfaces";
import { getWebviewContent } from "./webview/webviewContent";

let lastActiveEditor: vscode.TextEditor | undefined =
  vscode.window.activeTextEditor;

// Store the list of files selected by the user.
let fileList: FileInfo[] = [];

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
        switch (message.command) {
          case COMMAND.CHAT:
            await handleChatCommand(
              message.text,
              fileList,
              panel,
              message.useActiveEditor,
              activeEditor
            );
            break;
          case COMMAND.CONTEXT:
            handleContextCommand(panel, activeEditor);
            break;
          case COMMAND.SELECTFILES:
            fileList = await handleFilesCommand(panel, fileList);
            break;
          case COMMAND.CLEARFILES:
            fileList = [];
            break;
        }
      });
    }
  );

  // Listen for configuration changes, and alert user of model used.
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
