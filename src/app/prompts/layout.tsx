import { AuthenticatedLayout } from "@/components/layout/authenticated-layout";

interface PromptsLayoutProps {
  children: React.ReactNode;
}

export default function PromptsLayout({
  children,
}: PromptsLayoutProps): React.ReactElement {
  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
}
