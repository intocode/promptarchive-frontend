"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  createPromptSchema,
  type CreatePromptFormData,
} from "@/lib/validations/prompt";
import {
  usePostPrompts,
  getGetPromptsQueryKey,
} from "@/lib/api/generated/endpoints/prompts/prompts";
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

interface CreatePromptFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const VISIBILITY_OPTIONS = [
  { value: "private", label: "Private" },
  { value: "public", label: "Public" },
  { value: "unlisted", label: "Unlisted" },
] as const;

export function CreatePromptForm({
  onSuccess,
  onCancel,
}: CreatePromptFormProps): React.ReactElement {
  const queryClient = useQueryClient();

  const form = useForm<CreatePromptFormData>({
    resolver: zodResolver(createPromptSchema),
    defaultValues: {
      title: "",
      content: "",
      description: "",
      visibility: "private",
    },
    mode: "onSubmit",
  });

  const { mutate: createPrompt, isPending } = usePostPrompts({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetPromptsQueryKey() });
        toast.success("Prompt created successfully");
        onSuccess?.();
      },
      onError: () => {
        toast.error("Failed to create prompt. Please try again.");
      },
    },
  });

  function onSubmit(data: CreatePromptFormData) {
    createPrompt({
      data: {
        ...data,
        description: data.description || undefined,
      },
    });
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating..." : "Create Prompt"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
