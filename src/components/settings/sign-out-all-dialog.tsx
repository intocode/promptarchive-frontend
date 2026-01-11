"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogOut } from "lucide-react";
import { toast } from "sonner";

import { usePostAuthLogoutAll } from "@/lib/api/generated/endpoints/authentication/authentication";
import { useAuth } from "@/hooks/use-auth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export function SignOutAllDialog(): React.ReactElement {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { logout } = useAuth();

  const { mutate, isPending } = usePostAuthLogoutAll({
    mutation: {
      onSuccess: () => {
        toast.success("Signed out from all devices");
        logout();
        router.push("/login");
      },
      onError: () => {
        toast.error("Failed to sign out from all devices");
      },
    },
  });

  function handleSignOutAll(e: React.MouseEvent) {
    e.preventDefault();
    mutate();
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <LogOut className="mr-2 size-4" />
          Sign Out All Devices
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Sign out from all devices?</AlertDialogTitle>
          <AlertDialogDescription>
            This will end all your active sessions, including this one. You will
            need to log in again.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSignOutAll}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
            Sign Out All
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
