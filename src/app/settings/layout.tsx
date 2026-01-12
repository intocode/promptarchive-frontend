import { AuthenticatedLayout } from "@widgets/header";

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({
  children,
}: SettingsLayoutProps): React.ReactElement {
  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
}
