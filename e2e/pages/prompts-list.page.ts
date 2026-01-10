import type { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/test";

export class PromptsListPage {
  readonly page: Page;

  // Header elements
  readonly pageTitle: Locator;
  readonly pageDescription: Locator;
  readonly newPromptButton: Locator;

  // List container
  readonly promptsList: Locator;
  readonly promptRows: Locator;

  // States
  readonly loadingSkeleton: Locator;
  readonly emptyState: Locator;
  readonly errorState: Locator;
  readonly retryButton: Locator;

  // Toast
  readonly toastMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    // Header
    this.pageTitle = page.getByRole("heading", { name: "My Prompts" });
    this.pageDescription = page.getByText("Manage and organize your AI prompts");
    this.newPromptButton = page.getByRole("button", { name: /new prompt/i });

    // List
    this.promptsList = page.locator(".divide-y.divide-border");
    this.promptRows = page.locator('a[href^="/prompts/"]');

    // States
    this.loadingSkeleton = page.locator('[class*="animate-pulse"]').first();
    this.emptyState = page.getByText("No prompts yet");
    this.errorState = page.getByText("Failed to load prompts");
    this.retryButton = page.getByRole("button", { name: /try again/i });

    // Toast
    this.toastMessage = page.locator("[data-sonner-toast]");
  }

  async goto(): Promise<void> {
    await this.page.goto("/prompts");
  }

  async openCreatePromptModal(): Promise<void> {
    await this.newPromptButton.click();
  }

  getPromptRowByTitle(title: string): Locator {
    return this.page.locator(`a[href^="/prompts/"]`).filter({ hasText: title });
  }

  getPromptRowByIndex(index: number): Locator {
    return this.promptRows.nth(index);
  }

  async clickPromptRow(title: string): Promise<void> {
    await this.getPromptRowByTitle(title).click();
  }

  getCopyButtonForPrompt(title: string): Locator {
    return this.getPromptRowByTitle(title).getByRole("button", {
      name: /copy prompt content/i,
    });
  }

  async copyPromptContent(title: string): Promise<void> {
    await this.getCopyButtonForPrompt(title).click();
  }

  async getPromptCount(): Promise<number> {
    return await this.promptRows.count();
  }

  async expectLoadingState(): Promise<void> {
    await expect(this.loadingSkeleton).toBeVisible();
  }

  async expectErrorState(): Promise<void> {
    // Longer timeout due to TanStack Query retry behavior (3 retries with exponential backoff)
    await expect(this.errorState).toBeVisible({ timeout: 15000 });
  }

  async expectEmptyState(): Promise<void> {
    await expect(this.emptyState).toBeVisible();
  }

  async expectPromptsLoaded(count: number): Promise<void> {
    await expect(this.promptRows).toHaveCount(count);
  }

  async expectPromptVisible(title: string): Promise<void> {
    await expect(this.getPromptRowByTitle(title)).toBeVisible();
  }

  async expectSuccessToast(message: string): Promise<void> {
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
