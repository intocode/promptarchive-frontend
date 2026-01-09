import { AuthGuard } from "@/components/auth/auth-guard";
import { Header } from "@/components/layout/header";

interface PromptsLayoutProps {
  children: React.ReactNode;
}

export default function PromptsLayout({
  children,
}: PromptsLayoutProps): React.ReactElement {
  return (
    <AuthGuard>
      <Header />
      <main>{children}</main>
    </AuthGuard>
  );
}
