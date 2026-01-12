"use client";

import { useState, type ReactElement } from "react";
import { Loader2, LogOut, Shield } from "lucide-react";

import { useLogoutAll } from "@features/auth";
import { TagsManagement } from "@features/tag-management";
import { Button } from "@shared/ui";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@shared/ui";

function SecuritySection(): ReactElement {
  const [showConfirm, setShowConfirm] = useState(false);
  const { logoutAll, isPending } = useLogoutAll();

  const handleLogoutAll = () => {
    logoutAll();
    setShowConfirm(false);
  };

  return (
    <>
      <div className="rounded-lg border bg-card">
        <div className="border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-muted-foreground" />
            <h2 className="font-semibold">Security</h2>
          </div>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Sign out all devices</p>
              <p className="text-sm text-muted-foreground">
                This will sign you out from all devices, including this one.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowConfirm(true)}
              disabled={isPending}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign out all
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign out from all devices?</AlertDialogTitle>
            <AlertDialogDescription>
              This will invalidate all your active sessions across all devices.
              You will need to sign in again on each device.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogoutAll} disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Signing out...
                </>
              ) : (
                "Sign out all devices"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default function SettingsPage(): ReactElement {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account settings
        </p>
      </div>

      <div className="max-w-2xl space-y-6">
        <TagsManagement />
        <SecuritySection />
      </div>
    </div>
  );
}
