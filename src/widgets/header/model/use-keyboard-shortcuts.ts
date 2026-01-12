"use client";

import { useEffect, useCallback, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface UseKeyboardShortcutsOptions {
  onSearch?: () => void;
  onNewPrompt?: () => void;
  onHelp?: () => void;
}

export function useKeyboardShortcuts(options?: UseKeyboardShortcutsOptions) {
  const router = useRouter();
  const pathname = usePathname();

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      const target = event.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      // Allow ? shortcut even in inputs (we'll check for shift)
      if (isInput && event.key !== "?") {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const modifier = isMac ? event.metaKey : event.ctrlKey;

      // Cmd/Ctrl + K - Search
      if (modifier && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (options?.onSearch) {
          options.onSearch();
        } else if (pathname !== "/prompts") {
          router.push("/prompts");
        } else {
          // Focus search input on prompts page
          const searchInput = document.querySelector(
            '[data-search-input="true"]'
          ) as HTMLInputElement;
          searchInput?.focus();
        }
      }

      // Cmd/Ctrl + N - New prompt
      if (modifier && event.key.toLowerCase() === "n") {
        event.preventDefault();
        if (options?.onNewPrompt) {
          options.onNewPrompt();
        } else if (pathname !== "/prompts") {
          router.push("/prompts?new=true");
        } else {
          // Trigger new prompt modal on prompts page
          const event = new CustomEvent("create-prompt");
          window.dispatchEvent(event);
        }
      }

      // ? - Show shortcuts help (only when not in input)
      if (event.key === "?" && !isInput) {
        event.preventDefault();
        if (options?.onHelp) {
          options.onHelp();
        } else {
          const event = new CustomEvent("show-shortcuts-help");
          window.dispatchEvent(event);
        }
      }
    },
    [pathname, router, options]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}

export function useShortcutsHelpDialog() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleShowHelp = () => setIsOpen(true);
    window.addEventListener("show-shortcuts-help", handleShowHelp);
    return () =>
      window.removeEventListener("show-shortcuts-help", handleShowHelp);
  }, []);

  return {
    isOpen,
    setIsOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  };
}
