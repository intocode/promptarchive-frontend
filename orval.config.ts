import { defineConfig } from "orval";

export default defineConfig({
  promptarchive: {
    input: {
      target: "./swagger.yaml",
    },
    output: {
      mode: "tags-split",
      target: "./src/shared/api/generated/endpoints",
      schemas: "./src/types/api",
      client: "react-query",
      httpClient: "axios",
      override: {
        mutator: {
          path: "./src/shared/api/axios.ts",
          name: "apiClient",
        },
        query: {
          useQuery: true,
          useMutation: true,
          signal: true,
        },
      },
    },
  },
});
