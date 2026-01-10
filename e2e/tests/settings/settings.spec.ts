import { test, expect } from "../../fixtures";
import { SettingsPage } from "../../pages";
import { mockAuthEndpoints, mockUser, mockPromptsEndpoints } from "../../fixtures";

test.describe("Feature: Settings Page", () => {
  const user = mockUser();

  test.describe("Scenario: Access settings page", () => {
    test("should display page title 'Settings'", async ({ authenticatedPage }) => {
      await mockAuthEndpoints(authenticatedPage, user);
      await mockPromptsEndpoints(authenticatedPage, []);

      const settingsPage = new SettingsPage(authenticatedPage);
      await settingsPage.goto();

      await expect(settingsPage.pageTitle).toBeVisible();
    });

    test("should display page description", async ({ authenticatedPage }) => {
      await mockAuthEndpoints(authenticatedPage, user);
      await mockPromptsEndpoints(authenticatedPage, []);

      const settingsPage = new SettingsPage(authenticatedPage);
      await settingsPage.goto();

      await expect(settingsPage.pageDescription).toBeVisible();
    });

    test("should be accessible for authenticated users", async ({
      authenticatedPage,
    }) => {
      await mockAuthEndpoints(authenticatedPage, user);
      await mockPromptsEndpoints(authenticatedPage, []);

      const settingsPage = new SettingsPage(authenticatedPage);
      await settingsPage.goto();

      await settingsPage.expectPageLoaded();
    });
  });

  test.describe("Scenario: Protected route", () => {
    test("should redirect to login when accessed by unauthenticated user", async ({
      unauthenticatedPage,
    }) => {
      await unauthenticatedPage.goto("/settings");
      await expect(unauthenticatedPage).toHaveURL(/\/login/);
    });
  });
});
