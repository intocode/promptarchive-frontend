"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Variable {
  name: string;
  defaultValue?: string;
}

interface VariableInputFormProps {
  promptId: string;
  variables: Variable[];
  onValuesChange?: (values: Record<string, string>) => void;
}

function getStorageKey(promptId: string): string {
  return `prompt-variables-${promptId}`;
}

function getRememberKey(promptId: string): string {
  return `prompt-variables-remember-${promptId}`;
}

function loadSavedValues(promptId: string): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const saved = localStorage.getItem(getStorageKey(promptId));
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

function loadRememberPreference(promptId: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(getRememberKey(promptId)) === "true";
  } catch {
    return false;
  }
}

function computeInitialValues(
  promptId: string,
  variables: Variable[]
): Record<string, string> {
  const shouldRemember = loadRememberPreference(promptId);
  const savedValues = shouldRemember ? loadSavedValues(promptId) : {};

  const initialValues: Record<string, string> = {};
  for (const variable of variables) {
    initialValues[variable.name] =
      savedValues[variable.name] ?? variable.defaultValue ?? "";
  }
  return initialValues;
}

// Internal form component that resets when key changes
function VariableInputFormInternal({
  promptId,
  variables,
  onValuesChange,
}: VariableInputFormProps): React.ReactElement {
  // Use lazy initialization - component remounts when promptId/variables change via key
  const [values, setValues] = useState<Record<string, string>>(() =>
    computeInitialValues(promptId, variables)
  );
  const [rememberValues, setRememberValues] = useState(() =>
    loadRememberPreference(promptId)
  );

  // Save values to localStorage when they change (if remember is enabled)
  useEffect(() => {
    if (rememberValues) {
      localStorage.setItem(getStorageKey(promptId), JSON.stringify(values));
    }
    onValuesChange?.(values);
  }, [values, rememberValues, promptId, onValuesChange]);

  // Save remember preference
  useEffect(() => {
    localStorage.setItem(getRememberKey(promptId), String(rememberValues));
    if (!rememberValues) {
      localStorage.removeItem(getStorageKey(promptId));
    }
  }, [rememberValues, promptId]);

  const handleValueChange = useCallback((name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleClearAll = useCallback(() => {
    const clearedValues: Record<string, string> = {};
    for (const variable of variables) {
      clearedValues[variable.name] = variable.defaultValue ?? "";
    }
    setValues(clearedValues);
  }, [variables]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">
            Fill in Variables
          </CardTitle>
          <div className="flex items-center gap-2">
            <Checkbox
              id={`remember-${promptId}`}
              checked={rememberValues}
              onCheckedChange={(checked) => setRememberValues(checked === true)}
            />
            <Label
              htmlFor={`remember-${promptId}`}
              className="text-sm font-normal text-muted-foreground cursor-pointer"
            >
              Remember values
            </Label>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {variables.map((variable) => (
          <div key={variable.name} className="space-y-1.5">
            <Label htmlFor={`var-${promptId}-${variable.name}`}>
              {variable.name}
              <span className="text-destructive ml-0.5">*</span>
            </Label>
            <Input
              id={`var-${promptId}-${variable.name}`}
              value={values[variable.name] ?? ""}
              onChange={(e) => handleValueChange(variable.name, e.target.value)}
              placeholder={
                variable.defaultValue
                  ? `Default: ${variable.defaultValue}`
                  : `Enter ${variable.name}`
              }
            />
          </div>
        ))}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleClearAll}
          className="text-muted-foreground"
        >
          <X className="h-4 w-4 mr-1.5" />
          Clear all
        </Button>
      </CardContent>
    </Card>
  );
}

// Wrapper component that handles key-based remounting when promptId/variables change
export function VariableInputForm({
  promptId,
  variables,
  onValuesChange,
}: VariableInputFormProps): React.ReactElement | null {
  // Create a stable key from promptId and variable names
  const formKey = useMemo(() => {
    const varNames = variables.map((v) => v.name).join(",");
    return `${promptId}-${varNames}`;
  }, [promptId, variables]);

  if (variables.length === 0) {
    return null;
  }

  return (
    <VariableInputFormInternal
      key={formKey}
      promptId={promptId}
      variables={variables}
      onValuesChange={onValuesChange}
    />
  );
}
