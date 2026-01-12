"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { usePostAuthLogoutAll } from "@/lib/api/generated/endpoints/authentication/authentication";
import { useAuth } from "@/hooks/use-auth";

interface UseLogoutAllResult {
  logoutAll: () => void;
  isPending: boolean;
}

export function useLogoutAll(): UseLogoutAllResult {
  const router = useRouter();
  const { logout: clearAuthState } = useAuth();

  const { mutate: logoutAllMutation, isPending } = usePostAuthLogoutAll({
    mutation: {
      onSuccess: () => {
        clearAuthState();
        toast.success("Signed out from all devices");
        router.push("/login");
      },
      onError: () => {
        toast.error("Failed to sign out from all devices");
      },
    },
  });

  const logoutAll = useCallback(() => {
    logoutAllMutation();
  }, [logoutAllMutation]);

  return { logoutAll, isPending };
}
