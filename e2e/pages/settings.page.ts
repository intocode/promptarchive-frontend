import type { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/test";

export class SettingsPage {
  readonly page: Page;

  readonly pageTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.getByRole("heading", { name: "Settings" });
  }

  async goto(): Promise<void> {
    // Warm up auth context first
    await this.page.goto("/prompts");
    await this.page.waitForLoadState("networkidle");
    // Then navigate to settings
    await this.page.goto("/settings");
    await this.page.waitForLoadState("networkidle");
  }

  async expectPageLoaded(): Promise<void> {
    await expect(this.pageTitle).toBeVisible();
  }
}
