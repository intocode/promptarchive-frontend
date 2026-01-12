"use client";

import { use } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { useGetPublicPromptsId } from "@shared/api/generated/endpoints/public-gallery/public-gallery";
import { PublicPromptDetailSkeleton } from "@widgets/gallery";
import { PublicPromptDetailError } from "@widgets/error";
import { PublicPromptDetailContent } from "@widgets/gallery";

interface PublicPromptDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function PublicPromptDetailPage({
  params,
}: PublicPromptDetailPageProps): React.ReactElement {
  const { id } = use(params);
  const { data, isLoading, isError, refetch } = useGetPublicPromptsId(id);

  if (isLoading) {
    return <PublicPromptDetailSkeleton />;
  }

  if (isError || !data?.data) {
    return <PublicPromptDetailError onRetry={refetch} />;
  }

  const prompt = data.data;

  return (
    <div className="container max-w-4xl py-6">
      <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
        <Link href="/gallery" className="hover:text-foreground transition-colors">
          Gallery
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground truncate max-w-[300px]">
          {prompt.title}
        </span>
      </nav>

      <PublicPromptDetailContent prompt={prompt} />
    </div>
  );
}
