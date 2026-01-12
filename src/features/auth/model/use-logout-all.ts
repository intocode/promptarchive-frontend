"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { usePostAuthLogoutAll } from "@shared/api/generated/endpoints/authentication/authentication";
import { useAuth } from "@entities/user";

interface UseLogoutAllResult {
  logoutAll: () => void;
  isPending: boolean;
}

export function useLogoutAll(): UseLogoutAllResult {
  const router = useRouter();
  const { logout: clearAuthState } = useAuth();

  const { mutate, isPending } = usePostAuthLogoutAll({
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

  function logoutAll(): void {
    mutate();
  }

  return { logoutAll, isPending };
}
