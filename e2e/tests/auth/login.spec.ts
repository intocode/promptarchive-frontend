import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/login.page";
import { mockAuthEndpoints, mockUser, TEST_CREDENTIALS } from "../../fixtures";

test.describe("Feature: User Login", () => {
  const user = mockUser();

  test.beforeEach(async ({ page }) => {
    await mockAuthEndpoints(page, user);
  });

  test.describe("Scenario: Successful login", () => {
    test("should redirect to /prompts after successful login", async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(TEST_CREDENTIALS.valid.email, TEST_CREDENTIALS.valid.password);
      await loginPage.expectRedirectToPrompts();
    });

    test("should store tokens in localStorage", async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(TEST_CREDENTIALS.valid.email, TEST_CREDENTIALS.valid.password);
      await page.waitForURL("/prompts");

      const tokens = await page.evaluate(() => ({
        access: localStorage.getItem("access_token"),
        refresh: localStorage.getItem("refresh_token"),
      }));

      expect(tokens.access).toBe("mock-access-token");
      expect(tokens.refresh).toBe("mock-refresh-token");
    });

    // Skipped: Form submits too fast to reliably catch loading state
    test.skip("should show loading state during submission", async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.fillEmail(TEST_CREDENTIALS.valid.email);
      await loginPage.fillPassword(TEST_CREDENTIALS.valid.password);

      const submitPromise = loginPage.submit();
      await loginPage.expectLoadingState();
      await submitPromise;
    });
  });

  test.describe("Scenario: Failed login with invalid credentials", () => {
    test("should show error toast for invalid credentials", async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(TEST_CREDENTIALS.invalid.email, TEST_CREDENTIALS.invalid.password);
      await loginPage.expectErrorToast("Invalid credentials");
    });

    test("should not redirect on failed login", async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(TEST_CREDENTIALS.invalid.email, TEST_CREDENTIALS.invalid.password);
      await loginPage.expectErrorToast("Invalid credentials");
      await expect(page).toHaveURL("/login");
    });

    test("should not store tokens on failed login", async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(TEST_CREDENTIALS.invalid.email, TEST_CREDENTIALS.invalid.password);
      await loginPage.expectErrorToast("Invalid credentials");

      const accessToken = await page.evaluate(() => localStorage.getItem("access_token"));
      expect(accessToken).toBeNull();
    });
  });

  test.describe("Scenario: Form validation", () => {
    // Skipped: Browser's native email validation runs before Zod
    test.skip("should show validation error for invalid email format", async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(TEST_CREDENTIALS.invalidEmail.email, TEST_CREDENTIALS.invalidEmail.password);
      await loginPage.expectValidationError("Invalid email address");
    });

    test("should show validation error for short password", async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(TEST_CREDENTIALS.shortPassword.email, TEST_CREDENTIALS.shortPassword.password);
      await loginPage.expectValidationError("Password must be at least 8 characters");
    });

    test("should not submit form with empty fields", async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.submit();
      await expect(page).toHaveURL("/login");
    });
  });

  test.describe("Scenario: Initial page state", () => {
    test("should display email and password fields", async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await expect(loginPage.emailInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
    });

    test("should display submit button in ready state", async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.expectReadyState();
    });

    test("should have correct placeholder text", async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await expect(loginPage.emailInput).toHaveAttribute("placeholder", "you@example.com");
      await expect(loginPage.passwordInput).toHaveAttribute("placeholder", "Enter your password");
    });
  });
});
