"use client";

import { useMemo } from "react";
import { cn } from "@shared/lib";
import { computeWordDiff, type DiffPart } from "@shared/lib";

interface DiffViewProps {
  original: string;
  improved: string;
  className?: string;
}

export function DiffView({
  original,
  improved,
  className,
}: DiffViewProps): React.ReactElement {
  const diffParts = useMemo(
    () => computeWordDiff(original, improved),
    [original, improved]
  );

  return (
    <div
      className={cn(
        "rounded-lg border bg-muted/30 p-4 overflow-auto max-h-[400px]",
        className
      )}
    >
      <pre className="font-content whitespace-pre-wrap text-sm leading-relaxed">
        {diffParts.map((part: DiffPart, index: number) => {
          if (part.removed) {
            return (
              <span
                key={index}
                className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 line-through"
              >
                {part.value}
              </span>
            );
          }
          if (part.added) {
            return (
              <span
                key={index}
                className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
              >
                {part.value}
              </span>
            );
          }
          return <span key={index}>{part.value}</span>;
        })}
      </pre>
    </div>
  );
}
