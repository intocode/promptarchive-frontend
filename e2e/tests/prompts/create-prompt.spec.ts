import { test, expect } from "../../fixtures";
import { PromptsListPage, CreatePromptModal } from "../../pages";
import {
  mockPromptsEndpoints,
  mockCreatePromptError,
  mockAuthEndpoints,
  mockUser,
  mockPromptsList,
  PROMPT_FORM_DATA,
} from "../../fixtures";

test.describe("Feature: Create Prompt", () => {
  const user = mockUser();

  test.beforeEach(async ({ authenticatedPage }) => {
    await mockAuthEndpoints(authenticatedPage, user);
  });

  test.describe("Scenario: Successful prompt creation", () => {
    test("should create prompt with required fields (title, content)", async ({
      authenticatedPage,
    }) => {
      const prompts = mockPromptsList(2);
      await mockPromptsEndpoints(authenticatedPage, prompts);

      const promptsPage = new PromptsListPage(authenticatedPage);
      const createModal = new CreatePromptModal(authenticatedPage);

      await promptsPage.goto();
      await promptsPage.openCreatePromptModal();
      await createModal.expectOpen();

      await createModal.fill({
        title: PROMPT_FORM_DATA.validMinimal.title,
        content: PROMPT_FORM_DATA.validMinimal.content,
      });

      await createModal.submit();
      await createModal.expectSuccessToast();
    });

    test("should create prompt with all fields including description and visibility", async ({
      authenticatedPage,
    }) => {
      const prompts = mockPromptsList(2);
      await mockPromptsEndpoints(authenticatedPage, prompts);

      const promptsPage = new PromptsListPage(authenticatedPage);
      const createModal = new CreatePromptModal(authenticatedPage);

      await promptsPage.goto();
      await promptsPage.openCreatePromptModal();

      await createModal.fill({
        title: PROMPT_FORM_DATA.valid.title,
        content: PROMPT_FORM_DATA.valid.content,
        description: PROMPT_FORM_DATA.valid.description,
        visibility: PROMPT_FORM_DATA.valid.visibility,
      });

      await createModal.submit();
      await createModal.expectSuccessToast();
    });

    test("should close modal after successful creation", async ({
      authenticatedPage,
    }) => {
      const prompts = mockPromptsList(2);
      await mockPromptsEndpoints(authenticatedPage, prompts);

      const promptsPage = new PromptsListPage(authenticatedPage);
      const createModal = new CreatePromptModal(authenticatedPage);

      await promptsPage.goto();
      await promptsPage.openCreatePromptModal();
      await createModal.expectOpen();

      await createModal.fill({
        title: PROMPT_FORM_DATA.validMinimal.title,
        content: PROMPT_FORM_DATA.validMinimal.content,
      });

      await createModal.submit();
      await createModal.expectClosed();
    });
  });

  test.describe("Scenario: Form validation", () => {
    test("should show validation error for empty title", async ({
      authenticatedPage,
    }) => {
      const prompts = mockPromptsList(2);
      await mockPromptsEndpoints(authenticatedPage, prompts);

      const promptsPage = new PromptsListPage(authenticatedPage);
      const createModal = new CreatePromptModal(authenticatedPage);

      await promptsPage.goto();
      await promptsPage.openCreatePromptModal();

      await createModal.fill({
        title: "",
        content: PROMPT_FORM_DATA.emptyTitle.content,
      });

      await createModal.submit();
      await createModal.expectValidationError("Title is required");
    });

    test("should show validation error for empty content", async ({
      authenticatedPage,
    }) => {
      const prompts = mockPromptsList(2);
      await mockPromptsEndpoints(authenticatedPage, prompts);

      const promptsPage = new PromptsListPage(authenticatedPage);
      const createModal = new CreatePromptModal(authenticatedPage);

      await promptsPage.goto();
      await promptsPage.openCreatePromptModal();

      await createModal.fill({
        title: PROMPT_FORM_DATA.emptyContent.title,
        content: "",
      });

      await createModal.submit();
      await createModal.expectValidationError("Content is required");
    });

    test("should not submit form with empty required fields", async ({
      authenticatedPage,
    }) => {
      const prompts = mockPromptsList(2);
      await mockPromptsEndpoints(authenticatedPage, prompts);

      const promptsPage = new PromptsListPage(authenticatedPage);
      const createModal = new CreatePromptModal(authenticatedPage);

      await promptsPage.goto();
      await promptsPage.openCreatePromptModal();

      await createModal.submit();

      // Modal should still be open
      await createModal.expectOpen();
    });
  });

  test.describe("Scenario: Cancel creation", () => {
    test("should close modal when clicking Cancel button", async ({
      authenticatedPage,
    }) => {
      const prompts = mockPromptsList(2);
      await mockPromptsEndpoints(authenticatedPage, prompts);

      const promptsPage = new PromptsListPage(authenticatedPage);
      const createModal = new CreatePromptModal(authenticatedPage);

      await promptsPage.goto();
      await promptsPage.openCreatePromptModal();
      await createModal.expectOpen();

      await createModal.cancel();
      await createModal.expectClosed();
    });

    test("should close modal when pressing Escape", async ({ authenticatedPage }) => {
      const prompts = mockPromptsList(2);
      await mockPromptsEndpoints(authenticatedPage, prompts);

      const promptsPage = new PromptsListPage(authenticatedPage);
      const createModal = new CreatePromptModal(authenticatedPage);

      await promptsPage.goto();
      await promptsPage.openCreatePromptModal();
      await createModal.expectOpen();

      await createModal.close();
      await createModal.expectClosed();
    });
  });

  test.describe("Scenario: API error handling", () => {
    test("should show error toast when creation fails", async ({
      authenticatedPage,
    }) => {
      const prompts = mockPromptsList(2);
      await mockPromptsEndpoints(authenticatedPage, prompts);
      await mockCreatePromptError(authenticatedPage);

      const promptsPage = new PromptsListPage(authenticatedPage);
      const createModal = new CreatePromptModal(authenticatedPage);

      await promptsPage.goto();
      await promptsPage.openCreatePromptModal();

      await createModal.fill({
        title: PROMPT_FORM_DATA.validMinimal.title,
        content: PROMPT_FORM_DATA.validMinimal.content,
      });

      await createModal.submit();
      await createModal.expectErrorToast();
    });

    test("should keep modal open on error", async ({ authenticatedPage }) => {
      const prompts = mockPromptsList(2);
      await mockPromptsEndpoints(authenticatedPage, prompts);
      await mockCreatePromptError(authenticatedPage);

      const promptsPage = new PromptsListPage(authenticatedPage);
      const createModal = new CreatePromptModal(authenticatedPage);

      await promptsPage.goto();
      await promptsPage.openCreatePromptModal();

      await createModal.fill({
        title: PROMPT_FORM_DATA.validMinimal.title,
        content: PROMPT_FORM_DATA.validMinimal.content,
      });

      await createModal.submit();
      await createModal.expectErrorToast();
      await createModal.expectOpen();
    });
  });

  test.describe("Scenario: Initial modal state", () => {
    test("should display modal with correct title and description", async ({
      authenticatedPage,
    }) => {
      const prompts = mockPromptsList(2);
      await mockPromptsEndpoints(authenticatedPage, prompts);

      const promptsPage = new PromptsListPage(authenticatedPage);
      const createModal = new CreatePromptModal(authenticatedPage);

      await promptsPage.goto();
      await promptsPage.openCreatePromptModal();

      await expect(createModal.modalTitle).toBeVisible();
      await expect(createModal.modalDescription).toBeVisible();
    });

    test("should display form fields", async ({ authenticatedPage }) => {
      const prompts = mockPromptsList(2);
      await mockPromptsEndpoints(authenticatedPage, prompts);

      const promptsPage = new PromptsListPage(authenticatedPage);
      const createModal = new CreatePromptModal(authenticatedPage);

      await promptsPage.goto();
      await promptsPage.openCreatePromptModal();

      await expect(createModal.titleInput).toBeVisible();
      await expect(createModal.contentTextarea).toBeVisible();
      await expect(createModal.descriptionInput).toBeVisible();
      await expect(createModal.visibilitySelect).toBeVisible();
    });

    test("should display Create Prompt button in ready state", async ({
      authenticatedPage,
    }) => {
      const prompts = mockPromptsList(2);
      await mockPromptsEndpoints(authenticatedPage, prompts);

      const promptsPage = new PromptsListPage(authenticatedPage);
      const createModal = new CreatePromptModal(authenticatedPage);

      await promptsPage.goto();
      await promptsPage.openCreatePromptModal();

      await createModal.expectReadyState();
    });
  });
});
