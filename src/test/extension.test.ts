import * as assert from "assert";
import * as vscode from "vscode";

suite("Extension Test Suite", () => {
  test("Extension should be present", () => {
    assert.ok(vscode.extensions.getExtension("wassam.wassam-localai-ext"));
  });

  test("Should activate extension", async () => {
    const ext = vscode.extensions.getExtension("wassam.wassam-localai-ext");
    await ext?.activate();
    assert.strictEqual(ext?.isActive, true);
  });

  test("Should register chat command", async () => {
    const commands = await vscode.commands.getCommands();
    assert.ok(commands.includes("wassamLocalAI.chat"));
  });
});
