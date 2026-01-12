"use client";

import { Braces } from "lucide-react";

import { useGetPromptsIdVariables } from "@shared/api/generated/endpoints/templates/templates";
import { Badge } from "@shared/ui";
import { Skeleton } from "@shared/ui";
import type { ExtractedVariable } from "../lib";

interface VariablesListProps {
  promptId: string;
  /** Optional: client-side extracted variables for immediate display */
  clientVariables?: ExtractedVariable[];
}

export function VariablesList({
  promptId,
  clientVariables,
}: VariablesListProps): React.ReactElement | null {
  const { data: response, isLoading } = useGetPromptsIdVariables(promptId, {
    query: {
      staleTime: 60000,
    },
  });

  const variables = response?.data?.variables ?? [];
  const hasVariables =
    response?.data?.has_variables ??
    (clientVariables && clientVariables.length > 0);

  // Use client variables for immediate feedback while loading
  const displayVariables =
    isLoading && clientVariables
      ? clientVariables.map((v, i) => ({
          name: v.name,
          default_value: v.defaultValue,
          position: i,
        }))
      : variables;

  if (!hasVariables && !isLoading) {
    return null;
  }

  if (isLoading && !clientVariables) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Braces className="h-4 w-4" />
          <span>Template Variables</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-24" />
        </div>
      </div>
    );
  }

  if (displayVariables.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Braces className="h-4 w-4" />
        <span>Template Variables ({displayVariables.length})</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {displayVariables.map((variable, index) => (
          <VariableBadge
            key={variable.name ?? index}
            name={variable.name ?? ""}
            defaultValue={variable.default_value}
          />
        ))}
      </div>
    </div>
  );
}

interface VariableBadgeProps {
  name: string;
  defaultValue?: string;
}

function VariableBadge({
  name,
  defaultValue,
}: VariableBadgeProps): React.ReactElement {
  return (
    <Badge
      variant="outline"
      className="gap-1.5 border-primary/30 bg-primary/5 text-foreground"
    >
      <span className="font-medium">{name}</span>
      {defaultValue && (
        <span className="text-muted-foreground">= {defaultValue}</span>
      )}
    </Badge>
  );
}
