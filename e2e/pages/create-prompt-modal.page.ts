import type { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/test";

export interface CreatePromptData {
  title: string;
  content: string;
  description?: string;
  visibility?: string;
}

export class CreatePromptModal {
  readonly page: Page;

  // Modal elements
  readonly modalContainer: Locator;
  readonly modalTitle: Locator;
  readonly modalDescription: Locator;

  // Form fields
  readonly titleInput: Locator;
  readonly contentTextarea: Locator;
  readonly descriptionInput: Locator;
  readonly visibilitySelect: Locator;

  // Buttons
  readonly createButton: Locator;
  readonly cancelButton: Locator;

  // Toast
  readonly toastMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    // Modal - scope all form elements within the dialog
    this.modalContainer = page.getByRole("dialog");
    this.modalTitle = this.modalContainer.getByRole("heading", { name: "Create New Prompt" });
    this.modalDescription = this.modalContainer.getByText("Add a new prompt to your collection");

    // Form fields - scoped within dialog
    this.titleInput = this.modalContainer.getByLabel("Title");
    this.contentTextarea = this.modalContainer.getByLabel("Content");
    this.descriptionInput = this.modalContainer.getByLabel(/description/i);
    this.visibilitySelect = this.modalContainer.getByRole("combobox");

    // Buttons - scoped within dialog
    this.createButton = this.modalContainer.getByRole("button", { name: /create prompt/i });
    this.cancelButton = this.modalContainer.getByRole("button", { name: /cancel/i });

    // Toast - outside dialog
    this.toastMessage = page.locator("[data-sonner-toast]");
  }

  async fill(data: CreatePromptData): Promise<void> {
    await this.titleInput.fill(data.title);
    await this.contentTextarea.fill(data.content);

    if (data.description) {
      await this.descriptionInput.fill(data.description);
    }

    if (data.visibility) {
      await this.visibilitySelect.click();
      await this.page.getByRole("option", { name: data.visibility }).click();
    }
  }

  async submit(): Promise<void> {
    await this.createButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  async close(): Promise<void> {
    await this.page.keyboard.press("Escape");
  }

  async expectOpen(): Promise<void> {
    await expect(this.modalContainer).toBeVisible();
    await expect(this.modalTitle).toBeVisible();
  }

  async expectClosed(): Promise<void> {
    await expect(this.modalContainer).not.toBeVisible();
  }

  async expectValidationError(message: string): Promise<void> {
    await expect(this.page.getByText(message)).toBeVisible();
  }

  async expectLoadingState(): Promise<void> {
    await expect(this.createButton).toBeDisabled();
    await expect(this.createButton).toContainText("Creating...");
  }

  async expectReadyState(): Promise<void> {
    await expect(this.createButton).toBeEnabled();
    await expect(this.createButton).toContainText("Create Prompt");
  }

  async expectSuccessToast(): Promise<void> {
    await expect(this.toastMessage).toBeVisible();
    await expect(this.toastMessage).toContainText("Prompt created successfully");
  }

  async expectErrorToast(): Promise<void> {
    await expect(this.toastMessage).toBeVisible();
    await expect(this.toastMessage).toContainText("Failed to create prompt");
  }
}
