"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Archive, Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { UserMenu } from "@/components/layout/user-menu";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface NavItem {
  href: string;
  label: string;
  requiresAuth?: boolean;
}

const navItems: NavItem[] = [
  { href: "/prompts", label: "My Prompts", requiresAuth: true },
  { href: "/gallery", label: "Gallery" },
  { href: "/settings", label: "Settings", requiresAuth: true },
];

export function Header(): React.ReactElement {
  const pathname = usePathname();
  const { user } = useAuth();

  const logoHref = user ? "/prompts" : "/login";

  const visibleNavItems = navItems.filter(
    (item) => !item.requiresAuth || user
  );

  function isActive(href: string): boolean {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function getNavLinkClassName(href: string): string {
    return cn(
      "text-sm font-medium transition-colors hover:text-primary",
      isActive(href) ? "text-primary" : "text-muted-foreground"
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            href={logoHref}
            className="flex items-center gap-2 font-semibold"
          >
            <Archive className="h-5 w-5 text-primary" />
            <span>PromptArchive</span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {visibleNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={getNavLinkClassName(item.href)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Archive className="h-5 w-5 text-primary" />
                  <span>PromptArchive</span>
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-4">
                {visibleNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={getNavLinkClassName(item.href)}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
