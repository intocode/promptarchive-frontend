"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  registerSchema,
  type RegisterFormData,
} from "@/lib/validations/auth";
import { usePostAuthRegister } from "@/lib/api/generated/endpoints/authentication/authentication";
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
  if (isPending) return "Creating account...";
  if (rateLimitSeconds > 0) return `Try again in ${rateLimitSeconds}s`;
  return "Create account";
}

export function RegisterForm(): React.ReactElement {
  const router = useRouter();
  const [rateLimitSeconds, setRateLimitSeconds] = useState(0);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
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

  const { mutate: register, isPending } = usePostAuthRegister({
    mutation: {
      onSuccess: () => {
        toast.success("Registration successful! Please sign in.");
        router.push("/login");
      },
      onError: (error) => {
        const { isRateLimited, retryAfter } = handleAuthError<RegisterFormData>({
          error,
          setError: form.setError,
          defaultMessage: "Registration failed",
        });
        if (isRateLimited && retryAfter) {
          setRateLimitSeconds(retryAfter);
        }
      },
    },
  });

  function onSubmit(data: RegisterFormData) {
    register({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Your name"
                  autoComplete="name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                  placeholder="Create a password"
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Confirm your password"
                  autoComplete="new-password"
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
