import type { Page, Route } from "@playwright/test";
import { mockTokens, mockPromptsList, mockUser } from "./test-data";
import type { MockUser, MockPrompt } from "./test-data";

const DUPLICATE_EMAIL = "existing@example.com";

const API_PATTERN = "**/v1";

export async function mockAuthEndpoints(
  page: Page,
  user: MockUser,
  validPassword = "password123"
): Promise<void> {
  const tokens = mockTokens();

  await page.route(`${API_PATTERN}/auth/login`, async (route: Route) => {
    if (route.request().method() !== "POST") {
      await route.continue();
      return;
    }

    const body = JSON.parse(route.request().postData() || "{}");

    if (body.email === user.email && body.password === validPassword) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: { user, tokens } }),
      });
    } else {
      await route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ error: { message: "Invalid credentials" } }),
      });
    }
  });

  await page.route(`${API_PATTERN}/auth/register`, async (route: Route) => {
    if (route.request().method() !== "POST") {
      await route.continue();
      return;
    }

    const body = JSON.parse(route.request().postData() || "{}");

    if (body.email === DUPLICATE_EMAIL) {
      await route.fulfill({
        status: 409,
        contentType: "application/json",
        body: JSON.stringify({
          error: { code: "email_already_exists", message: "Email already registered" },
        }),
      });
      return;
    }

    const newUser = mockUser({
      id: `user-${Date.now()}`,
      email: body.email,
      name: body.name,
    });

    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({ data: { user: newUser, tokens } }),
    });
  });

  await page.route(`${API_PATTERN}/auth/me`, async (route: Route) => {
    const authHeader = route.request().headers()["authorization"];
    if (authHeader?.includes(tokens.access_token)) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: user }),
      });
    } else {
      await route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ error: { message: "Unauthorized" } }),
      });
    }
  });

  await page.route(`${API_PATTERN}/auth/refresh`, async (route: Route) => {
    if (route.request().method() !== "POST") {
      await route.continue();
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        data: { access_token: "new-mock-access-token", refresh_token: "new-mock-refresh-token" },
      }),
    });
  });

  await page.route(`${API_PATTERN}/auth/logout`, async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ data: { message: "Logged out successfully" } }),
    });
  });
}

export async function mockPromptsEndpoints(
  page: Page,
  prompts: MockPrompt[] = mockPromptsList(10)
): Promise<void> {
  // Single consolidated route handler for all prompts endpoints
  await page.route("**/v1/prompts**", async (route: Route) => {
    const method = route.request().method();
    const url = new URL(route.request().url());
    const pathname = url.pathname;

    // Check if this is a detail request (has ID in path)
    const detailMatch = pathname.match(/\/prompts\/([^/?]+)$/);

    if (detailMatch) {
      const promptId = detailMatch[1];

      if (method === "GET") {
        const prompt = prompts.find((p) => p.id === promptId);
        if (prompt) {
          await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({ data: prompt }),
          });
        } else {
          await route.fulfill({
            status: 404,
            contentType: "application/json",
            body: JSON.stringify({ error: { message: "Prompt not found" } }),
          });
        }
        return;
      }

      if (method === "PATCH") {
        const body = JSON.parse(route.request().postData() || "{}");
        const existingPrompt = prompts.find((p) => p.id === promptId);

        if (!existingPrompt) {
          await route.fulfill({
            status: 404,
            contentType: "application/json",
            body: JSON.stringify({ error: { message: "Prompt not found" } }),
          });
          return;
        }

        const updatedPrompt: MockPrompt = {
          ...existingPrompt,
          ...body,
          updated_at: new Date().toISOString(),
        };

        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ data: updatedPrompt }),
        });
        return;
      }

      if (method === "DELETE") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ data: { message: "Deleted successfully" } }),
        });
        return;
      }

      await route.continue();
      return;
    }

    // Handle list and create endpoints (/prompts or /prompts?...)
    if (method === "GET") {
      const search = url.searchParams.get("search");
      const pageNum = parseInt(url.searchParams.get("page") || "1");
      const limit = parseInt(url.searchParams.get("limit") || "20");
      const folderId = url.searchParams.get("folder_id");
      const visibility = url.searchParams.get("visibility");

      let filtered = [...prompts];

      if (search) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.title.toLowerCase().includes(searchLower) ||
            p.content.toLowerCase().includes(searchLower)
        );
      }

      if (folderId) {
        filtered = filtered.filter((p) => p.folder_id === folderId);
      }

      if (visibility) {
        filtered = filtered.filter((p) => p.visibility === visibility);
      }

      const start = (pageNum - 1) * limit;
      const paginated = filtered.slice(start, start + limit);

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: paginated,
          meta: {
            total: filtered.length,
            page: pageNum,
            limit,
            total_pages: Math.ceil(filtered.length / limit),
          },
        }),
      });
      return;
    }

    if (method === "POST") {
      const body = JSON.parse(route.request().postData() || "{}");
      const now = new Date().toISOString();

      const newPrompt: MockPrompt = {
        id: `prompt-${Date.now()}`,
        title: body.title || "Untitled",
        content: body.content || "",
        description: body.description,
        visibility: body.visibility || "private",
        tags: body.tags || [],
        folder_id: body.folder_id,
        created_at: now,
        updated_at: now,
      };

      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({ data: newPrompt }),
      });
      return;
    }

    await route.continue();
  });
}

export async function setupApiMocks(
  page: Page,
  user: MockUser,
  prompts?: MockPrompt[]
): Promise<void> {
  await mockAuthEndpoints(page, user);
  await mockPromptsEndpoints(page, prompts);
}

export async function mockPromptDetailEndpoint(
  page: Page,
  prompt: MockPrompt
): Promise<void> {
  await page.route(`${API_PATTERN}/prompts/${prompt.id}`, async (route: Route) => {
    if (route.request().method() !== "GET") {
      await route.continue();
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ data: prompt }),
    });
  });
}

export async function mockPromptNotFound(
  page: Page,
  promptId: string
): Promise<void> {
  await page.route(`${API_PATTERN}/prompts/${promptId}`, async (route: Route) => {
    if (route.request().method() !== "GET") {
      await route.continue();
      return;
    }

    await route.fulfill({
      status: 404,
      contentType: "application/json",
      body: JSON.stringify({ error: { message: "Prompt not found" } }),
    });
  });
}

export async function mockPromptsListError(page: Page): Promise<void> {
  await page.route("**/v1/prompts**", async (route: Route) => {
    if (route.request().method() !== "GET") {
      await route.fallback();
      return;
    }

    await route.fulfill({
      status: 500,
      contentType: "application/json",
      body: JSON.stringify({ error: { message: "Internal server error" } }),
    });
  });
}

export async function mockCreatePromptError(page: Page): Promise<void> {
  await page.route("**/v1/prompts", async (route: Route) => {
    if (route.request().method() !== "POST") {
      await route.fallback();
      return;
    }

    await route.fulfill({
      status: 500,
      contentType: "application/json",
      body: JSON.stringify({ error: { message: "Failed to create prompt" } }),
    });
  });
}

export async function mockUpdatePromptError(
  page: Page,
  promptId: string
): Promise<void> {
  await page.route(`**/v1/prompts/${promptId}`, async (route: Route) => {
    if (route.request().method() !== "PATCH") {
      // Use fallback to pass to next route handler instead of network
      await route.fallback();
      return;
    }

    await route.fulfill({
      status: 500,
      contentType: "application/json",
      body: JSON.stringify({ error: { message: "Failed to update prompt" } }),
    });
  });
}
