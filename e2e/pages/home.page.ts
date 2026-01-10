import type { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/test";

export class HomePage {
  readonly page: Page;

  readonly loadingSpinner: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loadingSpinner = page.locator('[class*="loading-spinner"]');
  }

  async goto(): Promise<void> {
    await this.page.goto("/");
  }

  async expectRedirectToPrompts(): Promise<void> {
    await expect(this.page).toHaveURL("/prompts");
  }

  async expectRedirectToGallery(): Promise<void> {
    await expect(this.page).toHaveURL("/gallery");
  }
}
