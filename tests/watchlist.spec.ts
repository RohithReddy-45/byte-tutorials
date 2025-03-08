import { test, expect } from "@playwright/test";

test.describe("Unauthenticated user cannot access watchlist page", () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  test("redirects to sign in page", async ({ page }) => {
    await page.goto("/courses");
    await expect(page).toHaveURL("/sign-in");
  });
});

test.describe("Authenticated watchlist page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/courses/watch-list");
  });

  test("has title", async ({ page }) => {
    await expect(page).toHaveTitle("Watchlist | Byte tutorials");
  });

  test("user can see courses", async ({ page }) => {
    await expect(page).toHaveURL("/courses/watch-list");
  });

  test("should navigate to courses page", async ({ page }) => {
    await page.getByTestId("user-avatar").click();
    await page.getByRole("link", { name: "Courses" }).click();
    await expect(page).toHaveURL("/courses");
  });
});
