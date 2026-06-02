import { test, expect } from "@playwright/test";

test.describe("Unauthenticated user cannot access watchlist page", () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  test("redirects to sign in page", async ({ page }) => {
    await page.goto("/courses/watch-list");
    await expect(page).toHaveURL("/sign-in");
  });
});

test.describe("Authenticated watchlist page", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeEach(async ({ page }) => {
    await page.goto("/courses/watch-list");
  });

  test("has correct title", async ({ page }) => {
    await expect(page).toHaveTitle("Watchlist | Byte tutorials");
  });

  test("renders watchlist page", async ({ page }) => {
    await expect(page).toHaveURL("/courses/watch-list");
  });

  test("should navigate to courses browse page via nav tab", async ({ page }) => {
    await page.getByRole("link", { name: "Browse" }).click();
    await expect(page).toHaveURL("/courses");
  });

  test("should navigate to Learning Paths via nav tab", async ({ page }) => {
    await page.getByRole("link", { name: "Learning Paths" }).click();
    await expect(page).toHaveURL("/courses/paths");
  });
});
