import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = 3600;
const SECONDS_PER_DAY = 86400;
const SECONDS_PER_WEEK = 604800;

function pluralize(count: number, singular: string): string {
  return `${count} ${count === 1 ? singular : `${singular}s`} ago`;
}

export function formatRelativeDate(dateString: string | undefined): string {
  if (!dateString) return "Unknown";

  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < SECONDS_PER_MINUTE) return "just now";
  if (diffInSeconds < SECONDS_PER_HOUR) {
    return pluralize(Math.floor(diffInSeconds / SECONDS_PER_MINUTE), "minute");
  }
  if (diffInSeconds < SECONDS_PER_DAY) {
    return pluralize(Math.floor(diffInSeconds / SECONDS_PER_HOUR), "hour");
  }
  if (diffInSeconds < SECONDS_PER_WEEK) {
    return pluralize(Math.floor(diffInSeconds / SECONDS_PER_DAY), "day");
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}
