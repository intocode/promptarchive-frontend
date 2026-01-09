"use client";

import { useCallback } from "react";
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

  const performLogout = useCallback(
    (showError = false) => {
      clearAuthState();
      router.push("/login");
      if (showError) {
        toast.error("Logged out locally. Session may still be active on server.");
      }
    },
    [clearAuthState, router]
  );

  const { mutate: logoutMutation, isPending } = usePostAuthLogout({
    mutation: {
      onSuccess: () => performLogout(),
      onError: () => performLogout(true),
    },
  });

  const logout = useCallback(() => {
    const refreshToken = localStorage.getItem("refresh_token");

    if (!refreshToken) {
      performLogout();
      return;
    }

    logoutMutation({ data: { refresh_token: refreshToken } });
  }, [logoutMutation, performLogout]);

  return { logout, isPending };
}
