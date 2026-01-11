import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/login.page";
import {
  mockLoginRateLimit,
  mockLoginServerError,
  mockLoginNetworkError,
  TEST_CREDENTIALS,
} from "../../fixtures";

test.describe("Feature: Auth Error Handling", () => {
  test.describe("Scenario: Rate limit (429) error", () => {
    test("should show rate limit toast with retry time", async ({ page }) => {
      await mockLoginRateLimit(page, 60);

      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(
        TEST_CREDENTIALS.valid.email,
        TEST_CREDENTIALS.valid.password
      );

      await loginPage.expectErrorToast("Too many attempts. Please try again in 60 seconds");
    });

    test("should disable submit button during rate limit", async ({ page }) => {
      await mockLoginRateLimit(page, 30);

      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(
        TEST_CREDENTIALS.valid.email,
        TEST_CREDENTIALS.valid.password
      );

      // Wait for toast to appear first
      await loginPage.expectErrorToast("Too many attempts");

      // Then check the button state (button text changes so use different locator)
      const submitButton = page.getByRole("button", { name: /try again in/i });
      await expect(submitButton).toBeDisabled();
    });
  });

  test.describe("Scenario: Network error", () => {
    test("should show connection error toast", async ({ page }) => {
      await mockLoginNetworkError(page);

      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(
        TEST_CREDENTIALS.valid.email,
        TEST_CREDENTIALS.valid.password
      );

      await loginPage.expectErrorToast("Unable to connect");
    });

    test("should remain on login page", async ({ page }) => {
      await mockLoginNetworkError(page);

      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(
        TEST_CREDENTIALS.valid.email,
        TEST_CREDENTIALS.valid.password
      );

      await expect(page).toHaveURL("/login");
    });
  });

  test.describe("Scenario: Server error (500)", () => {
    test("should show server error toast", async ({ page }) => {
      await mockLoginServerError(page);

      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(
        TEST_CREDENTIALS.valid.email,
        TEST_CREDENTIALS.valid.password
      );

      await loginPage.expectErrorToast("Something went wrong");
    });

    test("should not store tokens on server error", async ({ page }) => {
      await mockLoginServerError(page);

      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(
        TEST_CREDENTIALS.valid.email,
        TEST_CREDENTIALS.valid.password
      );

      await loginPage.expectErrorToast("Something went wrong");

      const accessToken = await page.evaluate(() =>
        localStorage.getItem("access_token")
      );
      expect(accessToken).toBeNull();
    });
  });
});
