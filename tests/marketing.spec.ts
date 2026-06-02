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

  test("start learning for free link navigates to sign-in", async ({ page }) => {
    await page.getByRole("link", { name: "Start learning for free" }).click();
    await expect(page).toHaveURL("/sign-in");
  });

  test("sign in button navigates to sign-in page", async ({ page }) => {
    await page.getByRole("link", { name: "Sign in" }).click();
    await expect(page).toHaveURL("/sign-in");
  });

  test("unauthenticated user stays on marketing page", async ({ page }) => {
    await expect(page).toHaveURL("/");
  });
});
