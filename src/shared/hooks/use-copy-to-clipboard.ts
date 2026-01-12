"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";

const COPIED_STATE_DURATION_MS = 2000;

interface UseCopyToClipboardResult {
  copy: (text: string) => Promise<void>;
  copied: boolean;
}

export function useCopyToClipboard(): UseCopyToClipboardResult {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async function copyToClipboard(
    text: string
  ): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), COPIED_STATE_DURATION_MS);
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  }, []);

  return { copy, copied };
}
