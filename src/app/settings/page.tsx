"use client";

import type { ReactElement } from "react";

import { TagsManagement } from "@/components/tags/tags-management";

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
      </div>
    </div>
  );
}
