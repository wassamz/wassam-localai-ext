import ollama from "ollama";
import * as vscode from "vscode";
import {
  DEFAULT_MODEL,
  EXTENSION_NAME,
  EXTENSION_PARAM_LOCALMODEL,
} from "../types";
import { getActiveDocumentFileName } from "../utils/editorUtils";

export async function handleChatCommand(
  userPrompt: string,
  panel: vscode.WebviewPanel,
  activeEditor: vscode.TextEditor | undefined
) {
  let responseText = "";

  if (activeEditor) {
    const document = activeEditor.document;
    let content = "";
    let contextMessage = "";

    if (!activeEditor.selection.isEmpty) {
      content = document.getText(activeEditor.selection);
      contextMessage = "Using Selected Text as Context.";
    } else {
      const fileName = getActiveDocumentFileName(activeEditor);
      content = document.getText();
      contextMessage = `Using Active File as Context: ${fileName}`;
    }

    panel.webview.postMessage({
      command: "updateContext",
      text: contextMessage,
    });

    userPrompt += "\n" + content;
  }

  try {
    const config = vscode.workspace.getConfiguration(EXTENSION_NAME);
    const localModel =
      config.get<string>(EXTENSION_PARAM_LOCALMODEL) ?? DEFAULT_MODEL;
    const streamResponse = await ollama.chat({
      model: localModel,
      messages: [{ role: "user", content: userPrompt }],
      stream: true,
    });

    for await (const part of streamResponse) {
      responseText += part.message.content;

      panel.webview.postMessage({
        command: "chatResponse",
        text: responseText,
      });
    }
  } catch (error) {
    responseText = "Sorry, I am not able to respond to that.";
    panel.webview.postMessage({
      command: "chatResponse",
      text: `${responseText} Error: ${String(error)}`,
    });
  }
}
