import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Generated files (Orval API client)
    "src/shared/api/generated/**",
    "src/types/api/**",
    // E2E tests (Playwright uses `use` function which conflicts with React hooks rules)
    "e2e/**",
  ]),
  // FSD Layer Boundary Rules
  // Hierarchy: app -> widgets -> features -> entities -> shared
  // Imports can only go DOWN the hierarchy
  {
    files: ["src/shared/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            { group: ["@entities/*", "**/entities/**"], message: "shared layer cannot import from entities" },
            { group: ["@features/*", "**/features/**"], message: "shared layer cannot import from features" },
            { group: ["@widgets/*", "**/widgets/**"], message: "shared layer cannot import from widgets" },
          ],
        },
      ],
    },
  },
  {
    files: ["src/entities/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            { group: ["@features/*", "**/features/**"], message: "entities layer cannot import from features" },
            { group: ["@widgets/*", "**/widgets/**"], message: "entities layer cannot import from widgets" },
          ],
        },
      ],
    },
  },
  {
    files: ["src/features/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            { group: ["@widgets/*", "**/widgets/**"], message: "features layer cannot import from widgets" },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
