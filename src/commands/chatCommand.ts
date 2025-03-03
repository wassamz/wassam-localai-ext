import hljs from "highlight.js";
import { markedHighlight } from "marked-highlight";
import ollama from "ollama";
import * as path from "path";
import * as vscode from "vscode";
const { Marked } = require("marked");

const marked = new Marked(
  markedHighlight({
    emptyLangClass: "hljs",
    langPrefix: "hljs language-",
    highlight(code, lang, info) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext";
      return hljs.highlight(code, { language }).value;
    },
  })
);

import {
  COMMAND,
  DEFAULT_MODEL,
  EXTENSION_NAME,
  EXTENSION_PARAM_LOCALMODEL,
} from "../models/constants";
import { FileInfo } from "../models/interfaces";

export async function handleChatCommand(
  userPrompt: string,
  fileList: FileInfo[],
  panel: vscode.WebviewPanel,
  useActiveEditor: boolean = true,
  activeEditor?: vscode.TextEditor
) {
  let responseText = "";
  userPrompt += "\nContext for this prompt: \n";

  let contextMessage = "";

  if (activeEditor) {
    if (!activeEditor.selection.isEmpty) {
      userPrompt += activeEditor.document.getText(activeEditor.selection);
      contextMessage = "Using Selected Text as Context.\n";
    }
    if (useActiveEditor) {
      const fullPathFileName = activeEditor.document.fileName;
      const fileName = path.basename(activeEditor.document.fileName);
      userPrompt += `Content of file ${fullPathFileName}: ${activeEditor.document.getText()}`;
      contextMessage = `Using Active File as Context: ${fileName}\n`;
    }
  }
  if (fileList) {
    for (const file of fileList) {
      const fileUri = vscode.Uri.file(file.path);
      const fileData = await vscode.workspace.fs.readFile(fileUri);
      const content = Buffer.from(fileData).toString("utf8");
      userPrompt += `Content of file ${file.path}:\n ${content}\n`;
    }
    if (fileList.length > 0) {
      contextMessage += `Using Selected Files as Context: ${fileList
        .map((file) => file.name)
        .join(", ")}`;
    }
  }
  //update extension panel to reveal context being used
  panel.webview.postMessage({
    command: COMMAND.UPDATE_CONTEXT,
    data: contextMessage,
  });

  try {
    // Get the local model from the extension configuration.
    const config = vscode.workspace.getConfiguration(EXTENSION_NAME);
    const localModel =
      config.get<string>(EXTENSION_PARAM_LOCALMODEL) ?? DEFAULT_MODEL;
    // Call the chat method from the Ollama API and stream the response to the webview panel.
    const streamResponse = await ollama.chat({
      model: localModel,
      messages: [{ role: "user", content: userPrompt }],
      stream: true,
    });

    for await (const part of streamResponse) {
      responseText += part.message.content;

      panel.webview.postMessage({
        command: COMMAND.CHAT_RESPONSE,
        data: marked.parse(responseText),
      });
    }
  } catch (error) {
    responseText = "Sorry, I am not able to respond to that.";
    panel.webview.postMessage({
      command: COMMAND.ERROR,
      data: `${responseText} Error: ${String(error)}`,
    });
  }
}
