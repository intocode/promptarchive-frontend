import { toast } from "sonner";

/**
 * Handles API errors with rate-limit awareness.
 * Shows appropriate toast messages based on error type.
 */
export function handleApiError(error: unknown, defaultMessage: string): void {
  const status = (error as { response?: { status?: number } })?.response?.status;

  if (status === 429) {
    toast.error("Rate limit reached, please try again later");
    return;
  }

  toast.error(defaultMessage);
}
