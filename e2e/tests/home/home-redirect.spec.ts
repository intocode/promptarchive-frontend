import { test, expect } from "../../fixtures";
import { HomePage } from "../../pages";
import { mockAuthEndpoints, mockUser, mockPromptsEndpoints } from "../../fixtures";

test.describe("Feature: Home Page Routing", () => {
  const user = mockUser();

  test.describe("Scenario: Authenticated user", () => {
    test("should redirect authenticated user to /prompts", async ({
      authenticatedPage,
    }) => {
      await mockAuthEndpoints(authenticatedPage, user);
      await mockPromptsEndpoints(authenticatedPage, []);

      const homePage = new HomePage(authenticatedPage);
      await homePage.goto();

      await homePage.expectRedirectToPrompts();
    });
  });

  test.describe("Scenario: Unauthenticated user", () => {
    test("should redirect unauthenticated user to /gallery", async ({
      unauthenticatedPage,
    }) => {
      const homePage = new HomePage(unauthenticatedPage);
      await homePage.goto();

      await homePage.expectRedirectToGallery();
    });
  });
});
