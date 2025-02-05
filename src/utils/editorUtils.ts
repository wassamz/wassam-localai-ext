import * as vscode from "vscode";

export function getActiveDocumentFileName(editor: vscode.TextEditor): string {
  const fileName = editor.document.fileName.split("/").pop();
  return fileName ?? "";
}
