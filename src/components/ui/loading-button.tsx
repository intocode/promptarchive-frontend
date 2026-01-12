import * as React from "react";
import { Loader2 } from "lucide-react";
import { type VariantProps } from "class-variance-authority";

import { Button, buttonVariants } from "./button";

interface LoadingButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  loadingText?: string;
  asChild?: boolean;
}

function LoadingButton({
  isLoading = false,
  loadingText,
  children,
  disabled,
  ...props
}: LoadingButtonProps): React.ReactElement {
  return (
    <Button disabled={disabled || isLoading} {...props}>
      {isLoading ? (
        <>
          <Loader2 className="animate-spin" />
          {loadingText ?? children}
        </>
      ) : (
        children
      )}
    </Button>
  );
}

export { LoadingButton };
