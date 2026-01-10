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

    test("should display prompt content", async ({ authenticatedPage }) => {
      await mockPromptsEndpoints(authenticatedPage, [testPrompt]);

      const detailPage = new PromptDetailPage(authenticatedPage);
      await detailPage.goto(testPrompt.id);

      await expect(detailPage.promptContent).toContainText(testPrompt.content);
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

  test.describe("Scenario: Enter edit mode", () => {
    test("should switch to edit mode when clicking Edit button", async ({
      authenticatedPage,
    }) => {
      await mockPromptsEndpoints(authenticatedPage, [testPrompt]);

      const detailPage = new PromptDetailPage(authenticatedPage);
      await detailPage.goto(testPrompt.id);

      await detailPage.enterEditMode();
      await detailPage.expectEditMode();
    });

    test("should display edit form with current values", async ({
      authenticatedPage,
    }) => {
      await mockPromptsEndpoints(authenticatedPage, [testPrompt]);

      const detailPage = new PromptDetailPage(authenticatedPage);
      await detailPage.goto(testPrompt.id);

      await detailPage.enterEditMode();

      await expect(detailPage.titleInput).toHaveValue(testPrompt.title);
      await expect(detailPage.contentTextarea).toHaveValue(testPrompt.content);
    });

    test("should show Save Changes and Cancel buttons", async ({
      authenticatedPage,
    }) => {
      await mockPromptsEndpoints(authenticatedPage, [testPrompt]);

      const detailPage = new PromptDetailPage(authenticatedPage);
      await detailPage.goto(testPrompt.id);

      await detailPage.enterEditMode();

      await expect(detailPage.saveButton).toBeVisible();
      await expect(detailPage.cancelButton).toBeVisible();
    });
  });

  test.describe("Scenario: Edit prompt - successful update", () => {
    test("should update prompt title", async ({ authenticatedPage }) => {
      await mockPromptsEndpoints(authenticatedPage, [testPrompt]);

      const detailPage = new PromptDetailPage(authenticatedPage);
      await detailPage.goto(testPrompt.id);

      await detailPage.enterEditMode();
      await detailPage.fillTitle("Updated Title");
      await detailPage.saveChanges();

      await detailPage.expectSuccessToast("updated");
    });

    test("should return to view mode after successful update", async ({
      authenticatedPage,
    }) => {
      await mockPromptsEndpoints(authenticatedPage, [testPrompt]);

      const detailPage = new PromptDetailPage(authenticatedPage);
      await detailPage.goto(testPrompt.id);

      await detailPage.enterEditMode();
      await detailPage.fillTitle("Updated Title");
      await detailPage.saveChanges();

      await detailPage.expectViewMode();
    });
  });

  test.describe("Scenario: Edit prompt - cancel", () => {
    test("should return to view mode when clicking Cancel", async ({
      authenticatedPage,
    }) => {
      await mockPromptsEndpoints(authenticatedPage, [testPrompt]);

      const detailPage = new PromptDetailPage(authenticatedPage);
      await detailPage.goto(testPrompt.id);

      await detailPage.enterEditMode();
      await detailPage.fillTitle("Unsaved Changes");
      await detailPage.cancelEdit();

      await detailPage.expectViewMode();
    });

    test("should return to view mode when pressing Escape", async ({
      authenticatedPage,
    }) => {
      await mockPromptsEndpoints(authenticatedPage, [testPrompt]);

      const detailPage = new PromptDetailPage(authenticatedPage);
      await detailPage.goto(testPrompt.id);

      await detailPage.enterEditMode();
      await detailPage.fillTitle("Unsaved Changes");
      await detailPage.pressEscapeToCancel();

      await detailPage.expectViewMode();
    });
  });

  test.describe("Scenario: Edit prompt - API error", () => {
    test("should show error toast when update fails", async ({ authenticatedPage }) => {
      await mockPromptsEndpoints(authenticatedPage, [testPrompt]);
      await mockUpdatePromptError(authenticatedPage, testPrompt.id);

      const detailPage = new PromptDetailPage(authenticatedPage);
      await detailPage.goto(testPrompt.id);

      await detailPage.enterEditMode();
      await detailPage.fillTitle("Updated Title");
      await detailPage.saveChanges();

      await detailPage.expectErrorToast("Failed");
    });

    test("should remain in edit mode on error", async ({ authenticatedPage }) => {
      await mockPromptsEndpoints(authenticatedPage, [testPrompt]);
      await mockUpdatePromptError(authenticatedPage, testPrompt.id);

      const detailPage = new PromptDetailPage(authenticatedPage);
      await detailPage.goto(testPrompt.id);

      await detailPage.enterEditMode();
      await detailPage.fillTitle("Updated Title");
      await detailPage.saveChanges();

      await detailPage.expectEditMode();
    });
  });
});
