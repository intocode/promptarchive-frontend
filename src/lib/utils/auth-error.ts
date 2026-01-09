import { AxiosError } from "axios";
import { toast } from "sonner";
import type { UseFormSetError, FieldValues, Path } from "react-hook-form";
import type { InternalHandlerResponse } from "@/types/api";

interface AuthErrorOptions<T extends FieldValues> {
  error: unknown;
  setError?: UseFormSetError<T>;
  defaultMessage?: string;
}

interface AuthErrorResult {
  isRateLimited: boolean;
  retryAfter?: number;
}

export function handleAuthError<T extends FieldValues>({
  error,
  setError,
  defaultMessage = "An error occurred",
}: AuthErrorOptions<T>): AuthErrorResult {
  if (!(error instanceof AxiosError)) {
    toast.error(defaultMessage);
    return { isRateLimited: false };
  }

  if (!error.response) {
    toast.error("Unable to connect. Please check your internet connection.");
    return { isRateLimited: false };
  }

  const { status, headers, data } = error.response as {
    status: number;
    headers: Record<string, string>;
    data?: InternalHandlerResponse;
  };
  const errorCode = data?.error?.code;
  const errorMessage = data?.error?.message;

  if (status === 429) {
    const retryAfter = parseInt(headers["retry-after"] || "60", 10);
    toast.error(
      `Too many attempts. Please try again in ${retryAfter} seconds.`
    );
    return { isRateLimited: true, retryAfter };
  }

  if (status >= 500) {
    toast.error("Something went wrong. Please try again later.");
    return { isRateLimited: false };
  }

  if (errorCode === "email_already_exists" && setError) {
    setError("email" as Path<T>, {
      message: "This email is already registered",
    });
    return { isRateLimited: false };
  }

  toast.error(errorMessage ?? defaultMessage);
  return { isRateLimited: false };
}
