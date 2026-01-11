"use client";

import * as React from "react";

import { VARIABLE_PATTERN } from "@/lib/constants/templates";
import { cn } from "@/lib/utils";

interface HighlightedContentProps {
  content: string;
  className?: string;
}

interface ContentSegment {
  type: "text" | "variable";
  value: string;
  defaultValue?: string;
}

export function HighlightedContent({
  content,
  className,
}: HighlightedContentProps): React.ReactElement {
  const segments = React.useMemo(() => {
    const parts: ContentSegment[] = [];
    let lastIndex = 0;

    const regex = new RegExp(VARIABLE_PATTERN.source, "g");
    let match;

    while ((match = regex.exec(content)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push({
          type: "text",
          value: content.slice(lastIndex, match.index),
        });
      }

      // Add the variable
      parts.push({
        type: "variable",
        value: match[0],
        defaultValue: match[2],
      });

      lastIndex = regex.lastIndex;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push({ type: "text", value: content.slice(lastIndex) });
    }

    return parts;
  }, [content]);

  return (
    <pre
      className={cn(
        "font-content whitespace-pre-wrap text-sm leading-relaxed",
        className
      )}
    >
      {segments.map((segment, index) => {
        if (segment.type === "variable") {
          return (
            <span
              key={index}
              className="bg-primary/15 text-primary rounded-sm px-1 py-0.5 font-medium"
              title={
                segment.defaultValue
                  ? `Default: ${segment.defaultValue}`
                  : undefined
              }
            >
              {segment.value}
            </span>
          );
        }
        return <span key={index}>{segment.value}</span>;
      })}
    </pre>
  );
}
