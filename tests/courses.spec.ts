import { test, expect } from "@playwright/test";

test.describe("Unauthenticated user cannot access Courses Page", () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  test("redirects to sign in page", async ({ page }) => {
    await page.goto("/courses");
    await expect(page).toHaveURL("/sign-in");
  });
});

test.describe("Authenticated Courses Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/courses");
  });

  test("has title", async ({ page }) => {
    await expect(page).toHaveTitle("Browse Courses | Byte tutorials");
  });

  test("user should be able to see courses", async ({ page }) => {
    await expect(page).toHaveURL("/courses");
  });

  test("should navigate to Watchlist page", async ({ page }) => {
    await page.getByTestId("user-avatar").click();
    await page.getByRole("link", { name: "Watchlist" }).click();
    await expect(page).toHaveURL("/courses/watch-list");
  });

  test("should navigate to Sign out page", async ({ page }) => {
    await page.getByTestId("user-avatar").click();
    await page.getByRole("button", { name: "Logout" }).click();
    await expect(page).toHaveURL("/sign-in");
  });

  test("should filter courses by tags", async ({ page }) => {
    await page.getByLabel("Select with search").click();
    await page.getByPlaceholder("Search technologies...").click();
    await page.getByPlaceholder("Search technologies...").fill("react");
    await page.getByRole("option", { name: "React", exact: true }).click();
    await expect(page.getByTestId("tag-react")).toBeVisible();
  });

  test("should filter courses by query", async ({ page }) => {
    await page.getByPlaceholder("Search...").click();
    await page.getByPlaceholder("Search...").fill("react");
    await expect(
      page.getByRole("heading", { name: 'Search results for "react"' }),
    ).toBeVisible();
  });
});
