"use client";

import { Copy, Check, FileText, FileCode, Braces, AlertTriangle } from "lucide-react";

import type { GithubComIntocodePromptarchiveInternalServiceTagSummary } from "@/types/api";
import { HAS_VARIABLES_PATTERN } from "@shared/config";
import {
  renderTemplate,
  areAllVariablesFilled,
  getUnfilledVariables,
} from "@entities/prompt";
import { useCopyToClipboard } from "@shared/hooks";
import { Button } from "@shared/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@shared/ui";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@shared/ui";

interface CopyPromptDropdownProps {
  content: string;
  title: string;
  description?: string;
  tags?: GithubComIntocodePromptarchiveInternalServiceTagSummary[];
  variableValues?: Record<string, string>;
}

export function CopyPromptDropdown({
  content,
  title,
  description,
  tags,
  variableValues,
}: CopyPromptDropdownProps): React.ReactElement {
  const { copy, copied } = useCopyToClipboard();

  const hasVariables = HAS_VARIABLES_PATTERN.test(content);
  const allVariablesFilled = hasVariables
    ? areAllVariablesFilled(content, variableValues ?? {})
    : true;
  const unfilledVars = hasVariables
    ? getUnfilledVariables(content, variableValues ?? {})
    : [];

  function copyPlainText(): void {
    copy(content);
  }

  function copyAsMarkdown(): void {
    let markdown = `# ${title}\n\n`;

    if (description) {
      markdown += `${description}\n\n`;
    }

    markdown += `${content}`;

    if (tags && tags.length > 0) {
      const tagNames = tags.map((tag) => tag.name).join(", ");
      markdown += `\n\n---\n\nTags: ${tagNames}`;
    }

    copy(markdown);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          aria-label="Copy prompt content"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={copyPlainText}>
          <FileText className="h-4 w-4 mr-2" />
          Copy as Plain Text
        </DropdownMenuItem>
        <DropdownMenuItem onClick={copyAsMarkdown}>
          <FileCode className="h-4 w-4 mr-2" />
          Copy as Markdown
        </DropdownMenuItem>
        {hasVariables && (
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuItem
                disabled={!allVariablesFilled}
                onClick={() =>
                  allVariablesFilled &&
                  copy(renderTemplate(content, variableValues ?? {}))
                }
                className={!allVariablesFilled ? "opacity-50" : ""}
              >
                <Braces className="h-4 w-4 mr-2" />
                Copy with Variables
                {!allVariablesFilled && (
                  <AlertTriangle className="h-3 w-3 ml-auto text-amber-500" />
                )}
              </DropdownMenuItem>
            </TooltipTrigger>
            {!allVariablesFilled && (
              <TooltipContent side="left">
                <p>Fill all variables: {unfilledVars.join(", ")}</p>
              </TooltipContent>
            )}
          </Tooltip>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
