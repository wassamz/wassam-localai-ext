# VSCode Local AI Helper

A Visual Studio Code extension that enables you to use freely available Large Language Models (LLMs) locally on your machine. This extension provides improved privacy, reduced latency, and cost savings by running LLMs directly on your device.

---

## Features

- **Local LLM Integration**: Download and use any LLM supported by [Ollama](https://ollama.com/).
- **Privacy-First**: All processing happens locally on your machine, ensuring your data remains private.
- **Low Latency**: Eliminates the need for cloud-based APIs, reducing response times.
- **Cost-Effective**: No subscription fees or API costs—run models locally for free.
- **Customizable**: Easily switch between different LLMs via the extension settings.

> **Tip**: The size of the LLM that works on your machine depends on your system's memory. To estimate the storage size, multiply the number of parameters (P) by the size of the data type. For example, a 7B model using BF16 would require:
> 
> Storage Size (S) = 7 billion * 2 bytes = 14 billion bytes ≈ 14 GB
> 

---

## Requirements

Before using this extension, ensure you have the following:

1. **Install Ollama**:
   - Download and install Ollama from [https://ollama.com](https://ollama.com/).

2. **Download an LLM**:
   - Visit the [Ollama Model Library](https://ollama.com/library) to find the LLM you want to use.
   - Download the model using the terminal. For example:
     ```bash
     ollama pull deepseek-r1:1.5b
     ```

3. **Default Model**:
   - By default, the extension uses the `deepseek-r1:1.5b` model. If you want to use a different model, update the extension settings.

---

## Installation
### Installing the extension manually
```sh
npm install -g @vscode/vsce
vsce package
```
### Using Visual Studio
1. Open Visual Studio Code.
2. Go to the Extensions view by clicking on the Extensions icon in the Activity Bar on the side of the window or pressing `Ctrl+Shift+X`.
3. Search for "Local AI Helper" and install the extension.
4. Reload Visual Studio Code to activate the extension.

---

## Usage

1. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on macOS).
2. Search for and select `Local AI Chat`.
3. A webview panel will open where you can interact with the locally running LLM.

---

## Extension Settings

This extension contributes the following settings:

- **`wassam-localai-ext.localModel`**: Specify the local LLM to use. By default, this is set to `deepseek-r1:1.5b`. Update this setting to use a different model.

To update the settings:
1. Open the VS Code settings (`Ctrl+,` or `Cmd+,` on macOS).
2. Search for `wassam-localai-ext.localModel`.
3. Enter the name of the LLM you want to use (e.g., `llama2` or `mistral`).

---

## Known Issues

- **Text Formatting**: The LLM response may use custom tags that are not converted into HTML and instead left as plain text

---

## Release Notes

### 1.1.0
- **Initial Release**: First version of the Local AI Helper extension with support for locally running LLMs via Ollama.

---

## Feedback and Support

If you encounter any issues or have suggestions for improvement, please [open an issue on GitHub](https://github.com/your-repo-url/issues). Your feedback is greatly appreciated!

---

## License

This extension is licensed under the [MIT License](https://opensource.org/licenses/MIT).

---

Enjoy using Local AI Helper! 🚀