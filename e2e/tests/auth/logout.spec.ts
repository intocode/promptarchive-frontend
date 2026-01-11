import { test, expect } from "../../fixtures";
import {
  mockAuthEndpoints,
  mockPromptsEndpoints,
  mockLogoutError,
  mockUser,
} from "../../fixtures";

test.describe("Feature: Logout Functionality", () => {
  const user = mockUser();

  test.beforeEach(async ({ authenticatedPage }) => {
    await mockAuthEndpoints(authenticatedPage, user);
    await mockPromptsEndpoints(authenticatedPage);
  });

  test.describe("Scenario: Successful logout", () => {
    test("should clear tokens from localStorage", async ({ authenticatedPage }) => {
      await authenticatedPage.goto("/prompts");
      await authenticatedPage.waitForURL("/prompts");

      // Open user menu and click logout
      await authenticatedPage.locator("button.rounded-full").first().click();
      await authenticatedPage.getByRole("menuitem", { name: /log out/i }).click();

      // Wait for redirect to login
      await expect(authenticatedPage).toHaveURL(/\/login/);

      // Verify tokens are cleared
      const tokens = await authenticatedPage.evaluate(() => ({
        access_token: localStorage.getItem("access_token"),
        refresh_token: localStorage.getItem("refresh_token"),
      }));

      expect(tokens.access_token).toBeNull();
      expect(tokens.refresh_token).toBeNull();
    });

    test("should redirect to login page", async ({ authenticatedPage }) => {
      await authenticatedPage.goto("/prompts");
      await authenticatedPage.waitForURL("/prompts");

      // Open user menu and click logout
      await authenticatedPage.locator("button.rounded-full").first().click();
      await authenticatedPage.getByRole("menuitem", { name: /log out/i }).click();

      await expect(authenticatedPage).toHaveURL(/\/login/);
    });

    test("should prevent access to protected routes after logout", async ({ authenticatedPage }) => {
      await authenticatedPage.goto("/prompts");
      await authenticatedPage.waitForURL("/prompts");

      // Open user menu and click logout
      await authenticatedPage.locator("button.rounded-full").first().click();
      await authenticatedPage.getByRole("menuitem", { name: /log out/i }).click();

      await expect(authenticatedPage).toHaveURL(/\/login/);

      // Try to access protected route
      await authenticatedPage.goto("/prompts");

      // Should redirect back to login
      await expect(authenticatedPage).toHaveURL(/\/login/);
    });
  });

  test.describe("Scenario: Logout with server error", () => {
    test("should still clear local tokens on server error", async ({ authenticatedPage }) => {
      await mockLogoutError(authenticatedPage);
      await authenticatedPage.goto("/prompts");
      await authenticatedPage.waitForURL("/prompts");

      // Open user menu and click logout
      await authenticatedPage.locator("button.rounded-full").first().click();
      await authenticatedPage.getByRole("menuitem", { name: /log out/i }).click();

      // Wait for redirect
      await expect(authenticatedPage).toHaveURL(/\/login/);

      // Verify tokens are still cleared despite server error
      const tokens = await authenticatedPage.evaluate(() => ({
        access_token: localStorage.getItem("access_token"),
        refresh_token: localStorage.getItem("refresh_token"),
      }));

      expect(tokens.access_token).toBeNull();
      expect(tokens.refresh_token).toBeNull();
    });

    test("should show error toast on server error", async ({ authenticatedPage }) => {
      await mockLogoutError(authenticatedPage);
      await authenticatedPage.goto("/prompts");
      await authenticatedPage.waitForURL("/prompts");

      // Open user menu and click logout
      await authenticatedPage.locator("button.rounded-full").first().click();
      await authenticatedPage.getByRole("menuitem", { name: /log out/i }).click();

      // Verify error toast appears
      const toast = authenticatedPage.locator("[data-sonner-toast]");
      await expect(toast).toBeVisible();
      await expect(toast).toContainText("Session may still be active");
    });

    test("should still redirect to login on server error", async ({ authenticatedPage }) => {
      await mockLogoutError(authenticatedPage);
      await authenticatedPage.goto("/prompts");
      await authenticatedPage.waitForURL("/prompts");

      // Open user menu and click logout
      await authenticatedPage.locator("button.rounded-full").first().click();
      await authenticatedPage.getByRole("menuitem", { name: /log out/i }).click();

      await expect(authenticatedPage).toHaveURL(/\/login/);
    });
  });
});
