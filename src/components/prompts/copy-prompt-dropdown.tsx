"use client";

import { Copy, Check, FileText, FileCode, Braces } from "lucide-react";

import type { GithubComIntocodePromptarchiveInternalServiceTagSummary } from "@/types/api";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CopyPromptDropdownProps {
  content: string;
  title: string;
  description?: string;
  tags?: GithubComIntocodePromptarchiveInternalServiceTagSummary[];
}

const VARIABLE_PATTERN = /\{\{[^}]+\}\}/g;

export function CopyPromptDropdown({
  content,
  title,
  description,
  tags,
}: CopyPromptDropdownProps): React.ReactElement {
  const { copy, copied } = useCopyToClipboard();

  const hasVariables = VARIABLE_PATTERN.test(content);

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

  function copyWithVariables(): void {
    copy(content);
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
          <DropdownMenuItem onClick={copyWithVariables}>
            <Braces className="h-4 w-4 mr-2" />
            Copy with Variables
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
