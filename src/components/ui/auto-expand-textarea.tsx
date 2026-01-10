"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface AutoExpandTextareaProps
  extends React.ComponentProps<typeof Textarea> {
  minRows?: number;
  maxRows?: number;
}

const AutoExpandTextarea = React.forwardRef<
  HTMLTextAreaElement,
  AutoExpandTextareaProps
>(function AutoExpandTextarea(
  { className, minRows = 3, maxRows = 20, onChange, ...props },
  ref
) {
  const internalRef = React.useRef<HTMLTextAreaElement | null>(null);

  function setRefs(node: HTMLTextAreaElement | null) {
    internalRef.current = node;
    if (typeof ref === "function") {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  }

  function adjustHeight() {
    const textarea = internalRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight) || 20;
    const minHeight = lineHeight * minRows;
    const maxHeight = lineHeight * maxRows;
    const newHeight = Math.min(
      Math.max(textarea.scrollHeight, minHeight),
      maxHeight
    );
    textarea.style.height = `${newHeight}px`;
  }

  React.useEffect(() => {
    adjustHeight();
  });

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    onChange?.(e);
    adjustHeight();
  }

  return (
    <Textarea
      ref={setRefs}
      className={cn("resize-none", className)}
      onChange={handleChange}
      {...props}
    />
  );
});

export { AutoExpandTextarea };
