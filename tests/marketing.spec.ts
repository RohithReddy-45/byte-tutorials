import { test, expect } from "@playwright/test";

test.describe("Marketing Page", () => {
  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.goto("/");
  });

  test("has title", async ({ page }) => {
    await expect(page).toHaveTitle(
      /Byte tutorials - Curated Tech Learning Platform/,
    );
  });

  test("start learning now link", async ({ page }) => {
    await page.getByRole("link", { name: "Start learning now" }).click();
    await expect(page).toHaveURL("/sign-in");
  });

  test("sign in link", async ({ page }) => {
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL("/sign-in");
  });
});
