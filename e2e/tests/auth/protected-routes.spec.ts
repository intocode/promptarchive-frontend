import { test, expect, mockAuthEndpoints, mockUser, TEST_CREDENTIALS } from "../../fixtures";
import { LoginPage } from "../../pages/login.page";

test.describe("Feature: Protected Routes", () => {
  test.describe("Scenario: AuthGuard redirects unauthenticated users", () => {
    test("should redirect to /login when accessing /prompts without token", async ({
      unauthenticatedPage: page,
    }) => {
      await page.goto("/prompts");
      await expect(page).toHaveURL(/\/login/);
    });

    test("should include redirect parameter pointing to original URL", async ({
      unauthenticatedPage: page,
    }) => {
      await page.goto("/prompts");
      await page.waitForURL(/\/login\?redirect=/);
      expect(page.url()).toContain("redirect=%2Fprompts");
    });
  });

  test.describe("Scenario: GuestGuard redirects authenticated users", () => {
    test("should redirect to /prompts when accessing /login with valid token", async ({
      authenticatedPage: page,
    }) => {
      await mockAuthEndpoints(page, mockUser());
      await page.goto("/login");
      await expect(page).toHaveURL("/prompts");
    });
  });

  test.describe("Scenario: Redirect preservation after login", () => {
    test("should redirect to original URL after successful login", async ({
      unauthenticatedPage: page,
    }) => {
      await mockAuthEndpoints(page, mockUser());

      await page.goto("/prompts");
      await expect(page).toHaveURL(/\/login\?redirect=/);

      const loginPage = new LoginPage(page);
      await loginPage.login(TEST_CREDENTIALS.valid.email, TEST_CREDENTIALS.valid.password);

      await expect(page).toHaveURL("/prompts");
    });
  });
});
