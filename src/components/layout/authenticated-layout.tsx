"use client";

import { AuthGuard } from "@/components/auth/auth-guard";
import { Header } from "@/components/layout/header";
import { KeyboardShortcutsDialog } from "@/components/keyboard-shortcuts-dialog";
import {
  useKeyboardShortcuts,
  useShortcutsHelpDialog,
} from "@/hooks/use-keyboard-shortcuts";

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
