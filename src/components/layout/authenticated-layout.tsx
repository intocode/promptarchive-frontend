"use client";

import { AuthGuard } from "@/components/auth/auth-guard";
import { Header } from "@/components/layout/header";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export function AuthenticatedLayout({
  children,
}: AuthenticatedLayoutProps): React.ReactElement {
  return (
    <AuthGuard>
      <Header />
      <main>{children}</main>
    </AuthGuard>
  );
}
