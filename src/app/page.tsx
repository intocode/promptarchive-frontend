"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function HomePage(): React.ReactElement {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace("/prompts");
      } else {
        router.replace("/gallery");
      }
    }
  }, [isAuthenticated, isLoading, router]);

  return <LoadingSpinner fullScreen />;
}
