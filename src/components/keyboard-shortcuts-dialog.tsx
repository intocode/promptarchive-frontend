"use client";

import { Keyboard } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface KeyboardShortcutsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SHORTCUTS = [
  {
    key: "K",
    description: "Focus search",
    modifier: true,
  },
  {
    key: "N",
    description: "Create new prompt",
    modifier: true,
  },
  {
    key: "?",
    description: "Show keyboard shortcuts",
    modifier: false,
  },
  {
    key: "Esc",
    description: "Close dialogs and modals",
    modifier: false,
  },
];

function ShortcutKey({
  children,
  modifier,
}: {
  children: React.ReactNode;
  modifier?: boolean;
}): React.ReactElement {
  const isMac =
    typeof navigator !== "undefined" &&
    navigator.platform.toUpperCase().indexOf("MAC") >= 0;

  return (
    <div className="flex items-center gap-1">
      {modifier && (
        <kbd className="inline-flex h-6 min-w-6 items-center justify-center rounded border bg-muted px-1.5 font-mono text-xs">
          {isMac ? "⌘" : "Ctrl"}
        </kbd>
      )}
      {modifier && <span className="text-muted-foreground">+</span>}
      <kbd className="inline-flex h-6 min-w-6 items-center justify-center rounded border bg-muted px-1.5 font-mono text-xs">
        {children}
      </kbd>
    </div>
  );
}

export function KeyboardShortcutsDialog({
  open,
  onOpenChange,
}: KeyboardShortcutsDialogProps): React.ReactElement {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Use these shortcuts to navigate faster
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {SHORTCUTS.map((shortcut) => (
            <div
              key={shortcut.key}
              className="flex items-center justify-between"
            >
              <span className="text-sm">{shortcut.description}</span>
              <ShortcutKey modifier={shortcut.modifier}>{shortcut.key}</ShortcutKey>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
