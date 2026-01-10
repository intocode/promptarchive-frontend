"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { GithubComIntocodePromptarchiveInternalServicePromptResponse } from "@/types/api";
import {
  updatePromptSchema,
  type UpdatePromptFormData,
} from "@/lib/validations/prompt";
import { VISIBILITY_OPTIONS } from "@/lib/constants";
import { useUpdatePrompt } from "@/hooks/use-update-prompt";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AutoExpandTextarea } from "@/components/ui/auto-expand-textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface EditPromptFormProps {
  prompt: GithubComIntocodePromptarchiveInternalServicePromptResponse;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function EditPromptForm({
  prompt,
  onSuccess,
  onCancel,
}: EditPromptFormProps): React.ReactElement {
  const form = useForm<UpdatePromptFormData>({
    resolver: zodResolver(updatePromptSchema),
    defaultValues: {
      title: prompt.title ?? "",
      content: prompt.content ?? "",
      description: prompt.description ?? "",
      visibility: (prompt.visibility as "private" | "public" | "unlisted") ?? "private",
    },
    mode: "onSubmit",
  });

  const { updatePrompt, isPending } = useUpdatePrompt(prompt.id!, { onSuccess });

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        onCancel?.();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  function onSubmit(data: UpdatePromptFormData): void {
    const changes: Record<string, unknown> = {};

    if (data.title !== prompt.title) changes.title = data.title;
    if (data.content !== prompt.content) changes.content = data.content;
    if (data.description !== (prompt.description ?? "")) {
      changes.description = data.description || undefined;
    }
    if (data.visibility !== prompt.visibility) changes.visibility = data.visibility;

    if (Object.keys(changes).length === 0) {
      onCancel?.();
      return;
    }

    updatePrompt(changes);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter prompt title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <AutoExpandTextarea
                  placeholder="Enter your prompt content..."
                  minRows={5}
                  maxRows={15}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Description{" "}
                <span className="text-muted-foreground">(optional)</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Brief description of your prompt"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="visibility"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Visibility</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {VISIBILITY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
