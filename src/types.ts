export const DEFAULT_MODEL = "deepseek-r1:1.5b";
export const EXTENSION_NAME = "wassam-localai-ext";
export const EXTENSION_PARAM_LOCALMODEL = "localModel";

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const COMMAND = {CHAT: 'chat', CONTEXT: 'getContext'};