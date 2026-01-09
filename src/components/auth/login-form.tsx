"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { usePostAuthLogin } from "@/lib/api/generated/endpoints/authentication/authentication";
import { useAuth } from "@/hooks/use-auth";
import { setAuthCookie } from "@/lib/utils/auth-cookie";
import { handleAuthError } from "@/lib/utils/auth-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

function getButtonText(
  isPending: boolean,
  rateLimitSeconds: number
): string {
  if (isPending) return "Signing in...";
  if (rateLimitSeconds > 0) return `Try again in ${rateLimitSeconds}s`;
  return "Sign in";
}

function getRedirectPath(): string {
  const searchParams = new URLSearchParams(window.location.search);
  const redirectTo = searchParams.get("redirect");
  const isValidRedirect =
    redirectTo && redirectTo.startsWith("/") && !redirectTo.startsWith("//");
  return isValidRedirect ? redirectTo : "/prompts";
}

export function LoginForm(): React.ReactElement {
  const router = useRouter();
  const { login } = useAuth();
  const [rateLimitSeconds, setRateLimitSeconds] = useState(0);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Countdown timer for rate limit
  useEffect(() => {
    if (rateLimitSeconds <= 0) return;

    const timer = setInterval(() => {
      setRateLimitSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [rateLimitSeconds]);

  const { mutate: loginMutation, isPending } = usePostAuthLogin({
    mutation: {
      onSuccess: (response) => {
        const tokens = response.data?.tokens;
        if (tokens?.access_token) {
          localStorage.setItem("access_token", tokens.access_token);
        }
        if (tokens?.refresh_token) {
          localStorage.setItem("refresh_token", tokens.refresh_token);
        }
        setAuthCookie();
        if (response.data?.user) {
          login(response.data.user);
        }
        router.push(getRedirectPath());
      },
      onError: (error) => {
        const { isRateLimited, retryAfter } = handleAuthError<LoginFormData>({
          error,
          defaultMessage: "Invalid email or password",
        });
        if (isRateLimited && retryAfter) {
          setRateLimitSeconds(retryAfter);
        }
      },
    },
  });

  function onSubmit(data: LoginFormData) {
    loginMutation({ data });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={isPending || rateLimitSeconds > 0}
        >
          {getButtonText(isPending, rateLimitSeconds)}
        </Button>
      </form>
    </Form>
  );
}
