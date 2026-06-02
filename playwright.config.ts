import { defineConfig, devices } from "@playwright/test";
import path from "node:path";
import dotenv from "dotenv";
import { addExtra } from "playwright-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import playwright from "playwright";

dotenv.config({ path: path.resolve(__dirname, ".env") });

const extraPlaywright = addExtra(playwright as any);
extraPlaywright.use(StealthPlugin());

const isCi = !!process.env.CI;
export default defineConfig({
  testDir: "./tests",
  timeout: 60 * 1000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  forbidOnly: isCi,
  retries: 0,
  workers: isCi ? 1 : 3,
  reporter: "html",
  globalSetup: path.resolve("./tests/setup/global-setup"),
  globalTeardown: path.resolve("./tests/setup/global-teardown"),
  use: {
    actionTimeout: 0,
    headless: isCi,
    storageState: "storageState.json",
    launchOptions: {
      args: ["--disable-blink-features=AutomationControlled"],
    },
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],

  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
