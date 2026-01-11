import type { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly passwordToggle: Locator;
  readonly submitButton: Locator;
  readonly toastMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel("Email");
    this.passwordInput = page.locator("input[autocomplete='current-password']");
    this.passwordToggle = page.getByRole("button", { name: /show password|hide password/i });
    this.submitButton = page.getByRole("button", { name: /sign in/i });
    this.toastMessage = page.locator("[data-sonner-toast]");
  }

  async goto(): Promise<void> {
    await this.page.goto("/login");
    await expect(this.page).toHaveURL("/login");
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  async expectValidationError(message: string): Promise<void> {
    await expect(this.page.getByText(message)).toBeVisible();
  }

  async expectErrorToast(message: string): Promise<void> {
    await expect(this.toastMessage).toBeVisible();
    await expect(this.toastMessage).toContainText(message);
  }

  async expectLoadingState(): Promise<void> {
    await expect(this.submitButton).toBeDisabled();
    await expect(this.submitButton).toContainText("Signing in...");
  }

  async expectReadyState(): Promise<void> {
    await expect(this.submitButton).toBeEnabled();
    await expect(this.submitButton).toContainText("Sign in");
  }

  async expectRedirectToPrompts(): Promise<void> {
    await expect(this.page).toHaveURL("/prompts");
  }
}
