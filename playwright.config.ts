import { defineConfig, devices } from "@playwright/test";
import path from "path";

const authFile = path.join(__dirname, "playwright/.auth/user.json");

export default defineConfig({
  testDir: "./e2e/tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["html", { open: "never" }],
    ["json", { outputFile: "playwright-report/results.json" }],
    process.env.CI ? ["github"] : ["list"],
  ],

  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "on-first-retry",
  },

  projects: [
    {
      name: "setup",
      testMatch: /.*\.setup\.ts/,
      testDir: "./e2e",
    },
    {
      name: "chromium",
      testIgnore: /\/(auth|gallery|shared)\/.*\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        storageState: authFile,
      },
      dependencies: ["setup"],
    },
    {
      name: "unauthenticated",
      testMatch: /\/(auth|gallery|shared)\/.*\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        storageState: { cookies: [], origins: [] },
      },
    },
  ],

  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
