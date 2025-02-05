import * as vscode from "vscode";
import { getActiveDocumentFileName } from "../utils/editorUtils";

export function handleContextCommand(
  panel: vscode.WebviewPanel,
  activeEditor: vscode.TextEditor | undefined
) {
  let contextMessage = "";

  if (activeEditor) {
    if (!activeEditor.selection.isEmpty) {
      contextMessage = "Using Selected Text as Context.";
    } else {
      const fileName = getActiveDocumentFileName(activeEditor);
      contextMessage = `Using Active File as Context: ${fileName}`;
    }
  } else {
    contextMessage = "No active editor found.";
  }

  panel.webview.postMessage({
    command: "updateContext",
    text: contextMessage,
  });
}
