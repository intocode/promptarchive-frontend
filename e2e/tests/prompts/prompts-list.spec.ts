import { test, expect } from "../../fixtures";
import { PromptsListPage } from "../../pages";
import {
  mockPromptsEndpoints,
  mockPromptsListError,
  mockAuthEndpoints,
  mockUser,
  mockPromptsList,
} from "../../fixtures";

test.describe("Feature: Prompts List Page", () => {
  const user = mockUser();

  test.beforeEach(async ({ authenticatedPage }) => {
    await mockAuthEndpoints(authenticatedPage, user);
  });

  test.describe("Scenario: Initial page load with prompts", () => {
    test("should display page header with title and New Prompt button", async ({
      authenticatedPage,
    }) => {
      const prompts = mockPromptsList(5);
      await mockPromptsEndpoints(authenticatedPage, prompts);

      const promptsPage = new PromptsListPage(authenticatedPage);
      await promptsPage.goto();

      await expect(promptsPage.pageTitle).toBeVisible();
      await expect(promptsPage.pageDescription).toBeVisible();
      await expect(promptsPage.newPromptButton).toBeVisible();
    });

    test("should display list of user prompts", async ({ authenticatedPage }) => {
      const prompts = mockPromptsList(5);
      await mockPromptsEndpoints(authenticatedPage, prompts);

      const promptsPage = new PromptsListPage(authenticatedPage);
      await promptsPage.goto();

      await promptsPage.expectPromptsLoaded(5);
    });

    test("should display prompt title in each row", async ({ authenticatedPage }) => {
      const prompts = mockPromptsList(3);
      await mockPromptsEndpoints(authenticatedPage, prompts);

      const promptsPage = new PromptsListPage(authenticatedPage);
      await promptsPage.goto();

      await promptsPage.expectPromptVisible("Test Prompt 1");
      await promptsPage.expectPromptVisible("Test Prompt 2");
      await promptsPage.expectPromptVisible("Test Prompt 3");
    });
  });

  test.describe("Scenario: Empty prompts list", () => {
    test("should display empty state when no prompts exist", async ({
      authenticatedPage,
    }) => {
      await mockPromptsEndpoints(authenticatedPage, []);

      const promptsPage = new PromptsListPage(authenticatedPage);
      await promptsPage.goto();

      await promptsPage.expectEmptyState();
    });

    test("should show 'No prompts yet' message", async ({ authenticatedPage }) => {
      await mockPromptsEndpoints(authenticatedPage, []);

      const promptsPage = new PromptsListPage(authenticatedPage);
      await promptsPage.goto();

      await expect(promptsPage.emptyState).toContainText("No prompts yet");
    });
  });

  test.describe("Scenario: Error loading prompts", () => {
    test("should display error state when API fails", async ({ authenticatedPage }) => {
      await mockPromptsListError(authenticatedPage);

      const promptsPage = new PromptsListPage(authenticatedPage);
      await promptsPage.goto();

      await promptsPage.expectErrorState();
    });

    test("should show retry button on error", async ({ authenticatedPage }) => {
      await mockPromptsListError(authenticatedPage);

      const promptsPage = new PromptsListPage(authenticatedPage);
      await promptsPage.goto();

      await promptsPage.expectErrorState();
      await expect(promptsPage.retryButton).toBeVisible();
    });

    test("should reload prompts when retry is clicked", async ({ authenticatedPage }) => {
      // First, mock error response
      await mockPromptsListError(authenticatedPage);

      const promptsPage = new PromptsListPage(authenticatedPage);
      await promptsPage.goto();
      await promptsPage.expectErrorState();

      // Now clear routes and mock success
      await authenticatedPage.unroute("**/v1/prompts*");
      const prompts = mockPromptsList(3);
      await mockPromptsEndpoints(authenticatedPage, prompts);

      // Click retry
      await promptsPage.retryButton.click();

      // Should now show prompts
      await promptsPage.expectPromptsLoaded(3);
    });
  });

  test.describe("Scenario: Navigate to prompt detail", () => {
    test("should navigate to prompt detail page when clicking prompt row", async ({
      authenticatedPage,
    }) => {
      const prompts = mockPromptsList(3);
      await mockPromptsEndpoints(authenticatedPage, prompts);

      const promptsPage = new PromptsListPage(authenticatedPage);
      await promptsPage.goto();

      await promptsPage.clickPromptRow("Test Prompt 1");

      await expect(authenticatedPage).toHaveURL("/prompts/prompt-1");
    });
  });

  test.describe("Scenario: Copy prompt content", () => {
    test("should show check icon after copy button click", async ({
      authenticatedPage,
    }) => {
      const prompts = mockPromptsList(3);
      await mockPromptsEndpoints(authenticatedPage, prompts);

      const promptsPage = new PromptsListPage(authenticatedPage);
      await promptsPage.goto();

      await promptsPage.copyPromptContent("Test Prompt 1");
      await promptsPage.expectCopySuccess();
    });
  });

  test.describe("Scenario: Open create prompt modal", () => {
    test("should open create prompt modal when clicking New Prompt button", async ({
      authenticatedPage,
    }) => {
      const prompts = mockPromptsList(3);
      await mockPromptsEndpoints(authenticatedPage, prompts);

      const promptsPage = new PromptsListPage(authenticatedPage);
      await promptsPage.goto();

      await promptsPage.openCreatePromptModal();

      await expect(
        authenticatedPage.getByRole("heading", { name: "Create New Prompt" })
      ).toBeVisible();
    });
  });
});
