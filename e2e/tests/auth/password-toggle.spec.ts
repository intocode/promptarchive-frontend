import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/login.page";
import { RegisterPage } from "../../pages/register.page";

test.describe("Feature: Password Visibility Toggle", () => {
  test.describe("Login Page", () => {
    test("password field should start with type password", async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();

      await expect(loginPage.passwordInput).toHaveAttribute("type", "password");
    });

    test("clicking toggle should change type to text", async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();

      await loginPage.passwordToggle.click();

      await expect(loginPage.passwordInput).toHaveAttribute("type", "text");
    });

    test("clicking toggle twice should change type back to password", async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();

      await loginPage.passwordToggle.click();
      await loginPage.passwordToggle.click();

      await expect(loginPage.passwordInput).toHaveAttribute("type", "password");
    });

    test("toggle button should have accessible label", async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();

      await expect(loginPage.passwordToggle).toHaveAccessibleName("Show password");

      await loginPage.passwordToggle.click();

      await expect(loginPage.passwordToggle).toHaveAccessibleName("Hide password");
    });
  });

  test.describe("Register Page", () => {
    test("both password fields should start with type password", async ({ page }) => {
      const registerPage = new RegisterPage(page);
      await registerPage.goto();

      await expect(registerPage.passwordInput).toHaveAttribute("type", "password");
      await expect(registerPage.confirmPasswordInput).toHaveAttribute("type", "password");
    });

    test("password toggle should only affect password field", async ({ page }) => {
      const registerPage = new RegisterPage(page);
      await registerPage.goto();

      await registerPage.passwordToggle.click();

      await expect(registerPage.passwordInput).toHaveAttribute("type", "text");
      await expect(registerPage.confirmPasswordInput).toHaveAttribute("type", "password");
    });

    test("confirm password toggle should only affect confirm password field", async ({ page }) => {
      const registerPage = new RegisterPage(page);
      await registerPage.goto();

      await registerPage.confirmPasswordToggle.click();

      await expect(registerPage.passwordInput).toHaveAttribute("type", "password");
      await expect(registerPage.confirmPasswordInput).toHaveAttribute("type", "text");
    });

    test("toggles should work independently", async ({ page }) => {
      const registerPage = new RegisterPage(page);
      await registerPage.goto();

      await registerPage.passwordToggle.click();
      await registerPage.confirmPasswordToggle.click();

      await expect(registerPage.passwordInput).toHaveAttribute("type", "text");
      await expect(registerPage.confirmPasswordInput).toHaveAttribute("type", "text");

      await registerPage.passwordToggle.click();

      await expect(registerPage.passwordInput).toHaveAttribute("type", "password");
      await expect(registerPage.confirmPasswordInput).toHaveAttribute("type", "text");
    });
  });
});
