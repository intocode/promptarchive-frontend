import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/lib/providers";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "PromptArchive",
  description: "Store, organize, and share AI prompts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>{children}</Providers>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
