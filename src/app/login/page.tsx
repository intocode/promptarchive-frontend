import Link from "next/link";

import { LoginForm } from "@/components/auth/login-form";
import { GuestGuard } from "@/components/auth/guest-guard";

export default function LoginPage(): React.ReactElement {
  return (
    <GuestGuard>
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome back
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">
              Sign in to your PromptArchive account
            </p>
          </div>

          <LoginForm />

          <p className="text-muted-foreground text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-primary underline-offset-4 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </GuestGuard>
  );
}
