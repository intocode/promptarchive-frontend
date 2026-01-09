import { test as base, Page } from "@playwright/test";
import { mockTokens } from "./test-data";

interface AuthFixtures {
  authenticatedPage: Page;
  unauthenticatedPage: Page;
  setAuthTokens: (tokens?: { access_token: string; refresh_token: string }) => Promise<void>;
  clearAuthTokens: () => Promise<void>;
  getAuthTokens: () => Promise<{ access_token: string | null; refresh_token: string | null }>;
}

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    const tokens = mockTokens();
    await page.addInitScript((tokens) => {
      localStorage.setItem("access_token", tokens.access_token);
      localStorage.setItem("refresh_token", tokens.refresh_token);
    }, tokens);
    await use(page);
  },

  unauthenticatedPage: async ({ page }, use) => {
    await page.addInitScript(() => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    });
    await use(page);
  },

  setAuthTokens: async ({ page }, use) => {
    await use(async (tokens) => {
      const t = tokens || mockTokens();
      await page.evaluate((tokens) => {
        localStorage.setItem("access_token", tokens.access_token);
        localStorage.setItem("refresh_token", tokens.refresh_token);
      }, t);
    });
  },

  clearAuthTokens: async ({ page }, use) => {
    await use(async () => {
      await page.evaluate(() => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      });
    });
  },

  getAuthTokens: async ({ page }, use) => {
    await use(async () => {
      return page.evaluate(() => ({
        access_token: localStorage.getItem("access_token"),
        refresh_token: localStorage.getItem("refresh_token"),
      }));
    });
  },
});

export { expect } from "@playwright/test";
