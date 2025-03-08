import { expect, test } from "@playwright/test";
import { saveStorageState } from "./setup/storage-state-helper";
import loginToGoogle from "./global-setup";

test("should login to google", async ({ page }) => {
  test.skip(!!process.env.CI, "Skip in CI environment");
  await page.goto("/sign-in");
  await expect(page).toHaveURL(/sign-in/);
  await loginToGoogle(page);
  await saveStorageState(page);
});
