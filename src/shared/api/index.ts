export { apiClient } from "./axios";
export { default as axiosInstance } from "./axios";

// Re-export all generated API endpoints
export * from "./generated/endpoints/authentication/authentication";
export * from "./generated/endpoints/prompts/prompts";
export * from "./generated/endpoints/folders/folders";
export * from "./generated/endpoints/tags/tags";
export * from "./generated/endpoints/ai/ai";
export * from "./generated/endpoints/versions/versions";
export * from "./generated/endpoints/sharing/sharing";
export * from "./generated/endpoints/public-gallery/public-gallery";
export * from "./generated/endpoints/templates/templates";
