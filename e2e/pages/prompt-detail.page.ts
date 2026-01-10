import type { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/test";
import type { MockPrompt } from "../fixtures/test-data";

export class PromptDetailPage {
  readonly page: Page;

  // Breadcrumb navigation
  readonly breadcrumbLink: Locator;

  // Content display (view mode)
  readonly promptTitle: Locator;
  readonly promptContent: Locator;
  readonly promptDescription: Locator;
  readonly editButton: Locator;
  readonly copyButton: Locator;
  readonly visibilityLabel: Locator;
  readonly folderBadge: Locator;
  readonly tagBadges: Locator;

  // Edit mode elements
  readonly titleInput: Locator;
  readonly contentTextarea: Locator;
  readonly descriptionInput: Locator;
  readonly visibilitySelect: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;

  // States
  readonly loadingSkeleton: Locator;
  readonly errorState: Locator;
  readonly errorTitle: Locator;
  readonly backToPromptsLink: Locator;
  readonly retryButton: Locator;

  // Toast
  readonly toastMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    // Breadcrumb
    this.breadcrumbLink = page.getByRole("link", { name: "My Prompts" });

    // View mode
    this.promptTitle = page.locator("h1");
    this.promptContent = page.locator("pre");
    this.promptDescription = page.locator("p.text-muted-foreground").first();
    this.editButton = page.getByRole("button", { name: /edit/i });
    this.copyButton = page.getByRole("button", { name: /copy prompt content/i });
    this.visibilityLabel = page.locator(".flex.items-center.gap-1\\.5 span");
    this.folderBadge = page.locator('[class*="badge"]').filter({ hasText: /.+/ }).first();
    this.tagBadges = page.locator('[class*="badge"][class*="secondary"]');

    // Edit mode
    this.titleInput = page.getByLabel("Title");
    this.contentTextarea = page.getByLabel("Content");
    this.descriptionInput = page.getByLabel(/description/i);
    this.visibilitySelect = page.getByRole("combobox");
    this.saveButton = page.getByRole("button", { name: /save changes/i });
    this.cancelButton = page.getByRole("button", { name: /cancel/i });

    // States
    this.loadingSkeleton = page.locator('[class*="animate-pulse"]').first();
    this.errorState = page.getByText("Prompt not found");
    this.errorTitle = page.getByRole("heading", { name: /prompt not found/i });
    this.backToPromptsLink = page.getByRole("link", { name: /back to prompts/i });
    this.retryButton = page.getByRole("button", { name: /try again/i });

    // Toast
    this.toastMessage = page.locator("[data-sonner-toast]");
  }

  async goto(promptId: string): Promise<void> {
    // Use client-side navigation via list page due to auth redirect flow
    // Direct URL navigation loses the prompt ID in redirect path
    await this.page.goto("/prompts");
    await this.page.waitForLoadState("networkidle");
    // Click on the specific prompt link
    await this.page.locator(`a[href="/prompts/${promptId}"]`).click();
    await this.page.waitForLoadState("networkidle");
  }

  async gotoForErrorState(promptId: string): Promise<void> {
    // First warm up auth context by visiting list page
    await this.page.goto("/prompts");
    await this.page.waitForLoadState("networkidle");
    // Now navigate directly to the non-existent prompt
    await this.page.goto(`/prompts/${promptId}`);
    await this.page.waitForLoadState("networkidle");
  }

  async navigateBackToPrompts(): Promise<void> {
    await this.backToPromptsLink.click();
  }

  async navigateViaBreadcrumb(): Promise<void> {
    await this.breadcrumbLink.click();
  }

  async copyContent(): Promise<void> {
    await this.copyButton.click();
  }

  async enterEditMode(): Promise<void> {
    await this.editButton.click();
  }

  async fillTitle(title: string): Promise<void> {
    await this.titleInput.fill(title);
  }

  async fillContent(content: string): Promise<void> {
    await this.contentTextarea.fill(content);
  }

  async fillDescription(description: string): Promise<void> {
    await this.descriptionInput.fill(description);
  }

  async selectVisibility(visibility: string): Promise<void> {
    await this.visibilitySelect.click();
    await this.page.getByRole("option", { name: visibility }).click();
  }

  async saveChanges(): Promise<void> {
    await this.saveButton.click();
  }

  async cancelEdit(): Promise<void> {
    await this.cancelButton.click();
  }

  async pressEscapeToCancel(): Promise<void> {
    await this.page.keyboard.press("Escape");
  }

  async expectLoadingState(): Promise<void> {
    await expect(this.loadingSkeleton).toBeVisible();
  }

  async expectErrorState(): Promise<void> {
    // Longer timeout due to TanStack Query retry behavior (3 retries with exponential backoff)
    await expect(this.errorTitle).toBeVisible({ timeout: 15000 });
  }

  async expectViewMode(): Promise<void> {
    await expect(this.editButton).toBeVisible();
    await expect(this.saveButton).not.toBeVisible();
  }

  async expectEditMode(): Promise<void> {
    await expect(this.saveButton).toBeVisible();
    await expect(this.cancelButton).toBeVisible();
  }

  async expectPromptDetails(prompt: MockPrompt): Promise<void> {
    await expect(this.promptTitle).toContainText(prompt.title);
    await expect(this.promptContent).toContainText(prompt.content);
  }

  async expectSuccessToast(message: string): Promise<void> {
    await expect(this.toastMessage).toBeVisible();
    await expect(this.toastMessage).toContainText(message);
  }

  async expectErrorToast(message: string): Promise<void> {
    await expect(this.toastMessage).toBeVisible();
    await expect(this.toastMessage).toContainText(message);
  }

  async expectCopySuccess(): Promise<void> {
    // Wait for either the green check icon or the success toast
    await expect(
      this.page
        .locator(".text-green-600")
        .or(this.page.locator("[data-sonner-toast]").filter({ hasText: /copied/i }))
        .first()
    ).toBeVisible();
  }
}
