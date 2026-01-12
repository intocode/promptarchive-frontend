"use client";

import { use } from "react";

import { useGetSharedShareToken } from "@shared/api/generated/endpoints/sharing/sharing";
import { SharedPromptDetailSkeleton } from "@widgets/gallery";
import { SharedPromptDetailError } from "@widgets/error";
import { SharedPromptDetailContent } from "@widgets/gallery";

interface SharedPromptPageProps {
  params: Promise<{ token: string }>;
}

export default function SharedPromptPage({
  params,
}: SharedPromptPageProps): React.ReactElement {
  const { token } = use(params);
  const { data, isLoading, isError, refetch } = useGetSharedShareToken(token);

  if (isLoading) {
    return <SharedPromptDetailSkeleton />;
  }

  if (isError || !data?.data) {
    return <SharedPromptDetailError onRetry={refetch} />;
  }

  const prompt = data.data;

  return (
    <div className="container max-w-4xl py-6">
      <SharedPromptDetailContent prompt={prompt} />
    </div>
  );
}
