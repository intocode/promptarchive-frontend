import { test, expect } from "@playwright/test";
import { mockAuthEndpoints, mockUser, mockTokens } from "../../fixtures";

test.describe("Feature: Auth Context", () => {
  test.describe("Scenario: AuthProvider initializes with null user", () => {
    test("should not call auth/me when no token exists", async ({ page }) => {
      const authMeRequests: string[] = [];

      page.on("request", (req) => {
        if (req.url().includes("/auth/me")) {
          authMeRequests.push(req.url());
        }
      });

      await page.addInitScript(() => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      });

      await page.goto("/login");
      await page.waitForLoadState("networkidle");

      expect(authMeRequests).toHaveLength(0);
    });
  });

  test.describe("Scenario: Valid token restores user session", () => {
    test("should call auth/me when valid token exists", async ({ page }) => {
      const user = mockUser();
      const tokens = mockTokens();

      await mockAuthEndpoints(page, user);

      await page.addInitScript(
        (t) => {
          localStorage.setItem("access_token", t.access_token);
          localStorage.setItem("refresh_token", t.refresh_token);
        },
        tokens
      );

      const authMeResponse = page.waitForResponse(
        (res) => res.url().includes("/auth/me") && res.status() === 200
      );

      await page.goto("/login");
      await authMeResponse;

      const tokensAfter = await page.evaluate(() => ({
        access: localStorage.getItem("access_token"),
        refresh: localStorage.getItem("refresh_token"),
      }));

      expect(tokensAfter.access).toBe(tokens.access_token);
      expect(tokensAfter.refresh).toBe(tokens.refresh_token);
    });
  });

  test.describe("Scenario: Invalid token clears localStorage", () => {
    test("should clear tokens when auth/me returns 401", async ({ page }) => {
      await page.addInitScript(() => {
        localStorage.setItem("access_token", "invalid-token");
        localStorage.setItem("refresh_token", "invalid-refresh-token");
      });

      await page.route("**/v1/auth/me", async (route) => {
        await route.fulfill({
          status: 401,
          contentType: "application/json",
          body: JSON.stringify({ error: { message: "Unauthorized" } }),
        });
      });

      await page.route("**/v1/auth/refresh", async (route) => {
        await route.fulfill({
          status: 401,
          contentType: "application/json",
          body: JSON.stringify({ error: { message: "Invalid refresh token" } }),
        });
      });

      await page.goto("/login");
      await page.waitForLoadState("networkidle");

      const tokens = await page.evaluate(() => ({
        access: localStorage.getItem("access_token"),
        refresh: localStorage.getItem("refresh_token"),
      }));

      expect(tokens.access).toBeNull();
      expect(tokens.refresh).toBeNull();
    });
  });
});
