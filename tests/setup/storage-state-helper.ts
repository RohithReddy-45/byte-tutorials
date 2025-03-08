import { Buffer } from "node:buffer";
import { readFileSync, writeFileSync } from "node:fs";
import type { Page } from "playwright";

export const saveStorageState = async (page: Page): Promise<void> => {
  try {
    await page.context().storageState({ path: "state.json" });
  } catch {
    console.error("Error saving storage state");
  }

  const stateJson = readFileSync("state.json", "utf-8");
  const stateBase64 = Buffer.from(stateJson).toString("base64");

  writeFileSync("storageState.base64", stateBase64);
};
