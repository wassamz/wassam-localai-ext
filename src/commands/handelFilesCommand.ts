import * as path from "path";
import * as vscode from "vscode";
import { COMMAND } from "../models/constants";
import { FileInfo } from "../models/interfaces";

export async function handleFilesCommand(
  panel: vscode.WebviewPanel,
  existingFiles: FileInfo[] = []
): Promise<FileInfo[]> {
  let fileList: FileInfo[];

  // Show the open file dialog
  const uris = await vscode.window.showOpenDialog({
    canSelectMany: true, // Allow multiple files
    openLabel: "Select Files",
  });

  // If user cancels dialog, return existing files to preserve state
  if (!uris || uris.length === 0) {
    return existingFiles;
  }

  fileList = uris.map((uri) => ({
    name: path.basename(uri.path) ?? "Unknown",
    path: uri.fsPath,
  }));

  // Send the file list back to the webview
  panel.webview.postMessage({
    command: COMMAND.SELECTED_FILES,
    data: `Selected Files: ${fileList.map((file) => file.name).join(", ")}`,
  });

  return fileList;
}
