import { Globe, Lock, Eye, type LucideIcon } from "lucide-react";

interface VisibilityConfigItem {
  icon: LucideIcon;
  label: string;
}

const VISIBILITY_CONFIG = {
  public: { icon: Globe, label: "Public" },
  private: { icon: Lock, label: "Private" },
  unlisted: { icon: Eye, label: "Unlisted" },
} as const;

export type VisibilityType = keyof typeof VISIBILITY_CONFIG;

// For form select options
export const VISIBILITY_OPTIONS = (
  Object.entries(VISIBILITY_CONFIG) as [VisibilityType, VisibilityConfigItem][]
).map(([value, { label }]) => ({ value, label }));

// For display with icons
export function getVisibilityConfig(
  visibility: string | undefined
): VisibilityConfigItem {
  const key = (visibility ?? "private") as VisibilityType;
  return VISIBILITY_CONFIG[key] ?? VISIBILITY_CONFIG.private;
}
