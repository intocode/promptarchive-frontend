"use client";

import Link from "next/link";
import { Archive } from "lucide-react";

import { UserMenu } from "@/components/layout/user-menu";

export function Header(): React.ReactElement {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/prompts" className="flex items-center gap-2 font-semibold">
          <Archive className="h-5 w-5 text-primary" />
          <span>PromptArchive</span>
        </Link>
        <UserMenu />
      </div>
    </header>
  );
}
