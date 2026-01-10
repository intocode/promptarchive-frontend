import { AuthenticatedLayout } from "@/components/layout/authenticated-layout";

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({
  children,
}: SettingsLayoutProps): React.ReactElement {
  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
}
