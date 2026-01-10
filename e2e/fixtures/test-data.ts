export interface MockUser {
  id: string;
  email: string;
  name: string;
}

export interface MockTag {
  id: string;
  name: string;
}

export interface MockFolder {
  id: string;
  name: string;
}

export interface MockPrompt {
  id: string;
  title: string;
  content: string;
  description?: string;
  visibility: "private" | "public" | "unlisted";
  tags?: MockTag[];
  folder_id?: string;
  folder?: MockFolder;
  created_at: string;
  updated_at: string;
  use_count?: number;
  view_count?: number;
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
    tags: [
      { id: "tag-1", name: "test" },
      { id: "tag-2", name: "example" },
    ],
    created_at: now,
    updated_at: now,
    use_count: 0,
    view_count: 0,
    ...overrides,
  };
}

export function mockPromptWithDetails(overrides?: Partial<MockPrompt>): MockPrompt {
  const now = new Date().toISOString();
  return {
    id: `prompt-${Date.now()}`,
    title: "Detailed Test Prompt",
    content: "This is detailed test content with {{variable}} and more text.",
    description: "A description for this prompt",
    visibility: "private",
    tags: [
      { id: "tag-1", name: "ai" },
      { id: "tag-2", name: "coding" },
      { id: "tag-3", name: "productivity" },
    ],
    folder_id: "folder-1",
    folder: { id: "folder-1", name: "Work Prompts" },
    created_at: now,
    updated_at: now,
    use_count: 5,
    view_count: 10,
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
      use_count: i * 2,
      view_count: i * 5,
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

export const REGISTER_CREDENTIALS = {
  valid: {
    name: "Test User",
    email: "newuser@example.com",
    password: "password123",
    confirmPassword: "password123",
  },
  duplicateEmail: {
    name: "Test User",
    email: "existing@example.com",
    password: "password123",
    confirmPassword: "password123",
  },
  shortName: {
    name: "A",
    email: "newuser@example.com",
    password: "password123",
    confirmPassword: "password123",
  },
  invalidEmail: {
    name: "Test User",
    email: "invalid-email",
    password: "password123",
    confirmPassword: "password123",
  },
  shortPassword: {
    name: "Test User",
    email: "newuser@example.com",
    password: "short",
    confirmPassword: "short",
  },
  mismatchPassword: {
    name: "Test User",
    email: "newuser@example.com",
    password: "password123",
    confirmPassword: "differentpassword",
  },
} as const;

export const PROMPT_FORM_DATA = {
  valid: {
    title: "New Test Prompt",
    content: "Test content for the prompt",
    description: "Optional description",
    visibility: "Private",
  },
  validMinimal: {
    title: "Minimal Prompt",
    content: "Just content",
  },
  emptyTitle: {
    title: "",
    content: "Content without title",
  },
  emptyContent: {
    title: "Title without content",
    content: "",
  },
} as const;
