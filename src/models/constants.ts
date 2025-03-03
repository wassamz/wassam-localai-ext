export const DEFAULT_MODEL = "deepseek-r1:1.5b";
export const EXTENSION_NAME = "wassam-localai-ext";
export const EXTENSION_PARAM_LOCALMODEL = "localModel";

export const COMMAND = {
  CHAT: "chat",
  CHAT_RESPONSE: "chatResponse",
  CLEARFILES: "clearFiles",
  CONTEXT: "getContext",
  ERROR: "error",
  SELECTFILES: "selectFiles",
  SELECTED_FILES: "selectedFiles",
  UPDATE_CONTEXT: "updateContext",
} as const;
