"use client";

import { use } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { useGetPromptsId } from "@shared/api/generated/endpoints/prompts/prompts";
import { PromptDetailSkeleton, PromptDetailContent } from "@widgets/prompt-detail";
import { PromptDetailError } from "@widgets/error";

interface PromptDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function PromptDetailPage({
  params,
}: PromptDetailPageProps): React.ReactElement {
  const { id } = use(params);
  const { data, isLoading, isError, refetch } = useGetPromptsId(id);

  if (isLoading) {
    return <PromptDetailSkeleton />;
  }

  if (isError || !data?.data) {
    return <PromptDetailError onRetry={refetch} />;
  }

  const prompt = data.data;

  return (
    <div className="container max-w-4xl py-6">
      <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
        <Link href="/prompts" className="hover:text-foreground transition-colors">
          My Prompts
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground truncate max-w-[300px]">
          {prompt.title}
        </span>
      </nav>

      <PromptDetailContent prompt={prompt} />
    </div>
  );
}
