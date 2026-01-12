"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@entities/user";
import { LoadingSpinner } from "@shared/ui";

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
