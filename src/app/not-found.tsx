import Link from "next/link";
import { FileQuestion } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound(): React.ReactElement {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
      <FileQuestion className="size-16 text-muted-foreground" />
      <h1 className="text-2xl font-semibold">Page Not Found</h1>
      <p className="text-center text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex gap-2">
        <Button asChild variant="outline">
          <Link href="/gallery">Browse Gallery</Link>
        </Button>
        <Button asChild>
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </div>
  );
}
