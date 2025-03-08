import type { Page } from "playwright";

const GOOGLE_EMAIL = process.env.GOOGLE_EMAIL || "";
const GOOGLE_PASSWORD = process.env.GOOGLE_PASSWORD || "";
const isCI = !!process.env.CI;

export default async function globalSetup(page: Page): Promise<void> {
  const signInButton = page.locator("text=Sign in with Google");
  await signInButton.click();

  if (!isCI) {
    await page.waitForSelector('input[type="email"]');
    await page.fill('input[type="email"]', GOOGLE_EMAIL);
    await page.click("text=Next");
    await page.waitForSelector('input[type="password"]');
    await page.fill('input[type="password"]', GOOGLE_PASSWORD);
    await page.click("text=Next");
  } else {
    await page.waitForTimeout(2500);
    await page.waitForSelector(`[data-identifier="${GOOGLE_EMAIL}"]`);
    await page.click(`[data-identifier="${GOOGLE_EMAIL}"]`);
    await page.waitForTimeout(2500);
  }

  const continueSelector = "text=Continue";
  await page.waitForSelector(continueSelector);
  const continueButton = page.locator(continueSelector);
  await continueButton.click();

  await page.waitForTimeout(8000);
  await page.waitForURL("/courses");
}
