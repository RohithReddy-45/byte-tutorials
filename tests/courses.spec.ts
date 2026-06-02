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

  test("has correct title", async ({ page }) => {
    await expect(page).toHaveTitle("Browse Courses | Byte tutorials");
  });

  test("renders courses browse page", async ({ page }) => {
    await expect(page).toHaveURL("/courses");
  });

  test("should navigate to Watchlist page via nav tab", async ({ page }) => {
    await page.getByRole("link", { name: "Watchlist" }).click();
    await expect(page).toHaveURL("/courses/watch-list");
  });

  test("should navigate to Learning Paths page via nav tab", async ({ page }) => {
    await page.getByRole("link", { name: "Learning Paths" }).click();
    await expect(page).toHaveURL("/courses/paths");
  });

  test("should navigate to Analytics page via nav tab", async ({ page }) => {
    await page.getByRole("link", { name: "Analytics" }).click();
    await expect(page).toHaveURL("/courses/analytics");
  });

  test("should filter courses by search query", async ({ page }) => {
    await page.getByPlaceholder("Search...").fill("react");
    await expect(
      page.getByRole("heading", { name: 'Search results for "react"' }),
    ).toBeVisible();
  });

  test("should filter courses by tag", async ({ page }) => {
    await page.getByPlaceholder("Search technologies...").click();
    await page.getByPlaceholder("Search technologies...").fill("react");
    await page.getByRole("option", { name: "React", exact: true }).click();
    await expect(page.getByTestId("tag-react")).toBeVisible();
  });

  test("logout via avatar dropdown navigates to sign-in", async ({ page }) => {
    await page.getByTestId("user-avatar").click();
    await page.getByRole("button", { name: "Logout" }).click();
    await expect(page).toHaveURL("/sign-in");
  });
});
