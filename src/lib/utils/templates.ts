import { VARIABLE_PATTERN, HAS_VARIABLES_PATTERN } from "@/lib/constants/templates";

export interface ExtractedVariable {
  name: string;
  defaultValue?: string;
  position: number;
}

/**
 * Extract variables from prompt content for immediate UI feedback
 * Note: Use API for authoritative data, this is for optimistic UI
 */
export function extractVariables(content: string): ExtractedVariable[] {
  const variables: ExtractedVariable[] = [];
  const seen = new Set<string>();

  const regex = new RegExp(VARIABLE_PATTERN.source, "g");
  let match;

  while ((match = regex.exec(content)) !== null) {
    const name = match[1];
    const defaultValue = match[2];

    // Deduplicate by name (keep first occurrence)
    if (!seen.has(name)) {
      seen.add(name);
      variables.push({
        name,
        defaultValue,
        position: match.index,
      });
    }
  }

  return variables;
}

/**
 * Check if content contains any template variables
 */
export function hasVariables(content: string): boolean {
  return HAS_VARIABLES_PATTERN.test(content);
}

/**
 * Render template by replacing variables with provided values
 * Falls back to default value if no value provided, or keeps original {{var}} syntax
 */
export function renderTemplate(
  content: string,
  values: Record<string, string>
): string {
  const regex = new RegExp(VARIABLE_PATTERN.source, "g");
  return content.replace(regex, (match, name, defaultValue) => {
    const value = values[name];
    if (value !== undefined && value !== "") return value;
    if (defaultValue !== undefined) return defaultValue;
    return match;
  });
}
