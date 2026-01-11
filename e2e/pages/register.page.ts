import type { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/test";

export class RegisterPage {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly passwordToggle: Locator;
  readonly confirmPasswordInput: Locator;
  readonly confirmPasswordToggle: Locator;
  readonly submitButton: Locator;
  readonly toastMessage: Locator;
  readonly loginLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.getByLabel("Name");
    this.emailInput = page.getByLabel("Email");
    this.passwordInput = page.locator("input[autocomplete='new-password']").first();
    this.passwordToggle = page.getByRole("button", { name: /show password|hide password/i }).first();
    this.confirmPasswordInput = page.locator("input[autocomplete='new-password']").last();
    this.confirmPasswordToggle = page.getByRole("button", { name: /show password|hide password/i }).last();
    this.submitButton = page.getByRole("button", { name: /create account/i });
    this.toastMessage = page.locator("[data-sonner-toast]");
    this.loginLink = page.getByRole("link", { name: /sign in/i });
  }

  async goto(): Promise<void> {
    await this.page.goto("/register");
    await expect(this.page).toHaveURL("/register");
  }

  async register(
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<void> {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(confirmPassword);
    await this.submitButton.click();
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  async expectValidationError(message: string): Promise<void> {
    await expect(this.page.getByText(message)).toBeVisible();
  }

  async expectSuccessToast(): Promise<void> {
    await expect(this.toastMessage).toBeVisible();
    await expect(this.toastMessage).toContainText("Registration successful");
  }

  async expectErrorToast(message: string): Promise<void> {
    await expect(this.toastMessage).toBeVisible();
    await expect(this.toastMessage).toContainText(message);
  }

  async expectLoadingState(): Promise<void> {
    await expect(this.submitButton).toBeDisabled();
    await expect(this.submitButton).toContainText("Creating account...");
  }

  async expectReadyState(): Promise<void> {
    await expect(this.submitButton).toBeEnabled();
    await expect(this.submitButton).toContainText("Create account");
  }

  async expectRedirectToLogin(): Promise<void> {
    await expect(this.page).toHaveURL("/login");
  }
}
