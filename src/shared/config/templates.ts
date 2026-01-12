/**
 * Regex pattern for matching template variables with optional default values
 * Matches: {{variable}} and {{variable:default_value}}
 * Capture groups: [1] = name, [2] = default value (if present)
 */
export const VARIABLE_PATTERN = /\{\{([^}:]+)(?::([^}]*))?\}\}/g;

/**
 * Simple pattern for testing if content has any variables (non-capturing)
 */
export const HAS_VARIABLES_PATTERN = /\{\{[^}]+\}\}/;
