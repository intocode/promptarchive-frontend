export const VISIBILITY_OPTIONS = [
  { value: "private", label: "Private" },
  { value: "public", label: "Public" },
  { value: "unlisted", label: "Unlisted" },
] as const;

export type VisibilityValue = (typeof VISIBILITY_OPTIONS)[number]["value"];
