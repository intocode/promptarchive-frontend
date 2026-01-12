"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { usePostAuthLogout } from "@/lib/api/generated/endpoints/authentication/authentication";
import { useAuth } from "@/hooks/use-auth";

interface UseLogoutResult {
  logout: () => void;
  isPending: boolean;
}

export function useLogout(): UseLogoutResult {
  const router = useRouter();
  const { logout: clearAuthState } = useAuth();

  function performLogout(showError = false): void {
    clearAuthState();
    router.push("/login");
    if (showError) {
      toast.error("Logged out locally. Session may still be active on server.");
    }
  }

  const { mutate: logoutMutation, isPending } = usePostAuthLogout({
    mutation: {
      onSuccess: () => performLogout(),
      onError: () => performLogout(true),
    },
  });

  function logout(): void {
    const refreshToken = localStorage.getItem("refresh_token");

    if (!refreshToken) {
      performLogout();
      return;
    }

    logoutMutation({ data: { refresh_token: refreshToken } });
  }

  return { logout, isPending };
}
