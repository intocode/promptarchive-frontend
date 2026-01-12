"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@entities/user";
import { LoadingSpinner } from "@shared/ui";

interface RouteGuardProps {
  children: React.ReactNode;
  mode: "auth" | "guest";
}

/**
 * Unified route guard for protected and guest-only routes.
 * - mode="auth": Requires authentication, redirects to login if not authenticated
 * - mode="guest": Requires no authentication, redirects to /prompts if authenticated
 */
export function RouteGuard({ children, mode }: RouteGuardProps): React.ReactElement {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const shouldRedirect = mode === "auth" ? !isAuthenticated : isAuthenticated;

  useEffect(() => {
    if (isLoading) return;

    if (mode === "auth" && !isAuthenticated) {
      const currentPath = window.location.pathname;
      router.replace(`/login?redirect=${encodeURIComponent(currentPath)}`);
    } else if (mode === "guest" && isAuthenticated) {
      router.replace("/prompts");
    }
  }, [isLoading, isAuthenticated, mode, router]);

  if (isLoading || shouldRedirect) {
    return <LoadingSpinner fullScreen />;
  }

  return <>{children}</>;
}

// Convenience exports for backward compatibility
export function AuthGuard({ children }: { children: React.ReactNode }): React.ReactElement {
  return <RouteGuard mode="auth">{children}</RouteGuard>;
}

export function GuestGuard({ children }: { children: React.ReactNode }): React.ReactElement {
  return <RouteGuard mode="guest">{children}</RouteGuard>;
}
