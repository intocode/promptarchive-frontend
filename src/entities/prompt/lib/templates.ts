import { VARIABLE_PATTERN } from "@shared/config";

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

/**
 * Check if all variables have been filled (either with a value or default)
 */
export function areAllVariablesFilled(
  content: string,
  values: Record<string, string>
): boolean {
  const variables = extractVariables(content);
  return variables.every((v) => {
    const value = values[v.name];
    return (value !== undefined && value !== "") || v.defaultValue !== undefined;
  });
}

/**
 * Get list of unfilled variable names (no value and no default)
 */
export function getUnfilledVariables(
  content: string,
  values: Record<string, string>
): string[] {
  return extractVariables(content)
    .filter((v) => {
      const value = values[v.name];
      return (value === undefined || value === "") && v.defaultValue === undefined;
    })
    .map((v) => v.name);
}
