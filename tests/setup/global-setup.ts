import { Buffer } from "node:buffer";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

export default async function globalSetup() {
  const storageStatePath = path.resolve("storageState.json");
  const base64Path = path.resolve("storageState.base64");

  if (!existsSync(storageStatePath) && existsSync(base64Path)) {
    const base64 = readFileSync(base64Path, "utf-8").trim();
    const json = Buffer.from(base64, "base64").toString("utf-8");
    writeFileSync(storageStatePath, json, "utf-8");
  }
}
