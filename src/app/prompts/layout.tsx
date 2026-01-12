import { AuthenticatedLayout } from "@widgets/header";

interface PromptsLayoutProps {
  children: React.ReactNode;
}

export default function PromptsLayout({
  children,
}: PromptsLayoutProps): React.ReactElement {
  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
}
