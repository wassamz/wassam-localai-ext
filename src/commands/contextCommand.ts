import * as path from "path";
import * as vscode from "vscode";
import { COMMAND } from "../models/constants";

export function handleContextCommand(
  panel: vscode.WebviewPanel,
  activeEditor: vscode.TextEditor | undefined
) {
  let contextMessage = "";

  if (activeEditor) {
    if (!activeEditor.selection.isEmpty) {
      contextMessage = "Using Selected Text as Context.";
    } else {
      const fileName = path.basename(activeEditor.document.fileName);
      contextMessage = `Using Active File as Context: ${fileName}`;
    }
  } else {
    contextMessage = "No active editor found.";
  }

  panel.webview.postMessage({
    command: COMMAND.UPDATE_CONTEXT,
    text: contextMessage,
  });
}
