export interface MockUser {
  id: string;
  email: string;
  name: string;
}

export interface MockPrompt {
  id: string;
  title: string;
  content: string;
  description?: string;
  visibility: "private" | "public";
  tags: string[];
  folder_id?: string;
  created_at: string;
  updated_at: string;
}

export interface MockTokens {
  access_token: string;
  refresh_token: string;
}

export function mockUser(overrides?: Partial<MockUser>): MockUser {
  return {
    id: "user-1",
    email: "test@example.com",
    name: "Test User",
    ...overrides,
  };
}

export function mockPrompt(overrides?: Partial<MockPrompt>): MockPrompt {
  const now = new Date().toISOString();
  return {
    id: `prompt-${Date.now()}`,
    title: "Test Prompt",
    content: "This is test content with {{variable}}",
    visibility: "private",
    tags: ["test", "example"],
    created_at: now,
    updated_at: now,
    ...overrides,
  };
}

export function mockTokens(overrides?: Partial<MockTokens>): MockTokens {
  return {
    access_token: "mock-access-token",
    refresh_token: "mock-refresh-token",
    ...overrides,
  };
}

export function mockPromptsList(count: number): MockPrompt[] {
  return Array.from({ length: count }, (_, i) =>
    mockPrompt({
      id: `prompt-${i + 1}`,
      title: `Test Prompt ${i + 1}`,
      content: `Content for prompt ${i + 1}`,
    })
  );
}

export const TEST_CREDENTIALS = {
  valid: {
    email: "test@example.com",
    password: "password123",
  },
  invalid: {
    email: "test@example.com",
    password: "wrongpassword",
  },
  invalidEmail: {
    email: "invalid-email",
    password: "password123",
  },
  shortPassword: {
    email: "test@example.com",
    password: "short",
  },
} as const;
