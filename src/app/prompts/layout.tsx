import { AuthGuard } from "@/components/auth/auth-guard";

export default function PromptsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}
