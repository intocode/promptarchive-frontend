"use client";

import { AuthGuard } from "@features/auth";
import { Header } from "@widgets/header";
import { KeyboardShortcutsDialog } from "@widgets/header";
import {
  useKeyboardShortcuts,
  useShortcutsHelpDialog,
} from "@widgets/header";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

function AuthenticatedLayoutContent({
  children,
}: AuthenticatedLayoutProps): React.ReactElement {
  const shortcutsDialog = useShortcutsHelpDialog();

  useKeyboardShortcuts({
    onHelp: shortcutsDialog.open,
  });

  return (
    <>
      <Header />
      <main>{children}</main>
      <KeyboardShortcutsDialog
        open={shortcutsDialog.isOpen}
        onOpenChange={shortcutsDialog.setIsOpen}
      />
    </>
  );
}

export function AuthenticatedLayout({
  children,
}: AuthenticatedLayoutProps): React.ReactElement {
  return (
    <AuthGuard>
      <AuthenticatedLayoutContent>{children}</AuthenticatedLayoutContent>
    </AuthGuard>
  );
}
