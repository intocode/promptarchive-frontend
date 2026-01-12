"use client";

import { useSyncExternalStore } from "react";

export type ViewMode = "compact" | "expanded";

const STORAGE_KEY = "promptarchive-view-mode";
const DEFAULT_MODE: ViewMode = "compact";

function getStoredViewMode(): ViewMode {
  if (typeof window === "undefined") {
    return DEFAULT_MODE;
  }
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "compact" || stored === "expanded") {
    return stored;
  }
  return DEFAULT_MODE;
}

function subscribe(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function persistViewMode(mode: ViewMode): void {
  localStorage.setItem(STORAGE_KEY, mode);
  window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY }));
}

interface UseViewModeResult {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  toggleViewMode: () => void;
}

export function useViewMode(): UseViewModeResult {
  const viewMode = useSyncExternalStore(subscribe, getStoredViewMode, () => DEFAULT_MODE);

  function setViewMode(mode: ViewMode): void {
    persistViewMode(mode);
  }

  function toggleViewMode(): void {
    const next = getStoredViewMode() === "compact" ? "expanded" : "compact";
    persistViewMode(next);
  }

  return { viewMode, setViewMode, toggleViewMode };
}
