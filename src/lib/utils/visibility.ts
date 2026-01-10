import { Globe, Lock, Eye, type LucideIcon } from "lucide-react";

export type VisibilityType = "public" | "private" | "unlisted";

interface VisibilityConfig {
  icon: LucideIcon;
  label: string;
}

const VISIBILITY_CONFIG: Record<VisibilityType, VisibilityConfig> = {
  public: { icon: Globe, label: "Public" },
  private: { icon: Lock, label: "Private" },
  unlisted: { icon: Eye, label: "Unlisted" },
} as const;

export function getVisibilityConfig(
  visibility: string | undefined
): VisibilityConfig {
  const key = (visibility ?? "private") as VisibilityType;
  return VISIBILITY_CONFIG[key] ?? VISIBILITY_CONFIG.private;
}
