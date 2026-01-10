import { z } from "zod";

export const promptVisibilitySchema = z.enum(["private", "public", "unlisted"]);

export const createPromptSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be at most 200 characters"),
  content: z
    .string()
    .min(1, "Content is required")
    .max(50000, "Content must be at most 50KB"),
  description: z
    .string()
    .max(1000, "Description must be at most 1000 characters")
    .optional(),
  visibility: promptVisibilitySchema,
});

export type CreatePromptFormData = z.infer<typeof createPromptSchema>;
