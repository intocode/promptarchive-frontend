import { test, expect } from "../../fixtures";
import { PromptDetailPage } from "../../pages";
import {
  mockPromptsEndpoints,
  mockUpdatePromptError,
  mockAuthEndpoints,
  mockUser,
  mockPromptWithDetails,
} from "../../fixtures";

test.describe("Feature: Prompt Detail Page", () => {
  const user = mockUser();
  const testPrompt = mockPromptWithDetails({ id: "test-prompt-1" });

  test.beforeEach(async ({ authenticatedPage }) => {
    await mockAuthEndpoints(authenticatedPage, user);
  });

  test.describe("Scenario: View prompt details", () => {
    test("should display breadcrumb navigation", async ({ authenticatedPage }) => {
      await mockPromptsEndpoints(authenticatedPage, [testPrompt]);

      const detailPage = new PromptDetailPage(authenticatedPage);
      await detailPage.goto(testPrompt.id);

      await expect(detailPage.breadcrumbLink).toBeVisible();
      await expect(detailPage.breadcrumbLink).toHaveText("My Prompts");
    });

    test("should display prompt title", async ({ authenticatedPage }) => {
      await mockPromptsEndpoints(authenticatedPage, [testPrompt]);

      const detailPage = new PromptDetailPage(authenticatedPage);
      await detailPage.goto(testPrompt.id);

      await expect(detailPage.promptTitle).toContainText(testPrompt.title);
    });

    test("should display Edit and Copy buttons", async ({ authenticatedPage }) => {
      await mockPromptsEndpoints(authenticatedPage, [testPrompt]);

      const detailPage = new PromptDetailPage(authenticatedPage);
      await detailPage.goto(testPrompt.id);

      await expect(detailPage.editButton).toBeVisible();
      await expect(detailPage.copyButton).toBeVisible();
    });

    test("should be in view mode by default", async ({ authenticatedPage }) => {
      await mockPromptsEndpoints(authenticatedPage, [testPrompt]);

      const detailPage = new PromptDetailPage(authenticatedPage);
      await detailPage.goto(testPrompt.id);

      await detailPage.expectViewMode();
    });
  });

  test.describe("Scenario: Error state (prompt not found)", () => {
    test("should display error state for non-existent prompt", async ({
      authenticatedPage,
    }) => {
      // Pass empty array so the prompt won't be found
      await mockPromptsEndpoints(authenticatedPage, []);

      const detailPage = new PromptDetailPage(authenticatedPage);
      await detailPage.gotoForErrorState("non-existent-id");

      await detailPage.expectErrorState();
    });

    test("should show 'Prompt not found' message", async ({ authenticatedPage }) => {
      await mockPromptsEndpoints(authenticatedPage, []);

      const detailPage = new PromptDetailPage(authenticatedPage);
      await detailPage.gotoForErrorState("non-existent-id");

      await detailPage.expectErrorState();
      await expect(detailPage.errorTitle).toBeVisible();
    });

    test("should show Back to Prompts link", async ({ authenticatedPage }) => {
      await mockPromptsEndpoints(authenticatedPage, []);

      const detailPage = new PromptDetailPage(authenticatedPage);
      await detailPage.gotoForErrorState("non-existent-id");

      await detailPage.expectErrorState();
      await expect(detailPage.backToPromptsLink).toBeVisible();
    });

    test("should show Try Again button", async ({ authenticatedPage }) => {
      await mockPromptsEndpoints(authenticatedPage, []);

      const detailPage = new PromptDetailPage(authenticatedPage);
      await detailPage.gotoForErrorState("non-existent-id");

      await detailPage.expectErrorState();
      await expect(detailPage.retryButton).toBeVisible();
    });

    test("should navigate to /prompts when clicking Back to Prompts", async ({
      authenticatedPage,
    }) => {
      await mockPromptsEndpoints(authenticatedPage, []);

      const detailPage = new PromptDetailPage(authenticatedPage);
      await detailPage.gotoForErrorState("non-existent-id");

      await detailPage.navigateBackToPrompts();
      await expect(authenticatedPage).toHaveURL("/prompts");
    });
  });

  test.describe("Scenario: Copy prompt content", () => {
    test("should show check icon after copy button click", async ({
      authenticatedPage,
    }) => {
      await mockPromptsEndpoints(authenticatedPage, [testPrompt]);

      const detailPage = new PromptDetailPage(authenticatedPage);
      await detailPage.goto(testPrompt.id);

      await detailPage.copyContent();
      await detailPage.expectCopySuccess();
    });
  });

  test.describe("Scenario: Navigate back to prompts", () => {
    test("should navigate to /prompts when clicking breadcrumb link", async ({
      authenticatedPage,
    }) => {
      await mockPromptsEndpoints(authenticatedPage, [testPrompt]);

      const detailPage = new PromptDetailPage(authenticatedPage);
      await detailPage.goto(testPrompt.id);

      await detailPage.navigateViaBreadcrumb();
      await expect(authenticatedPage).toHaveURL("/prompts");
    });
  });

});
