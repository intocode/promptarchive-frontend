"use client";

import { useCallback, useSyncExternalStore } from "react";

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

function getSnapshot(): ViewMode {
  return getStoredViewMode();
}

function getServerSnapshot(): ViewMode {
  return DEFAULT_MODE;
}

interface UseViewModeResult {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  toggleViewMode: () => void;
}

export function useViewMode(): UseViewModeResult {
  const viewMode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setViewMode = useCallback((mode: ViewMode) => {
    localStorage.setItem(STORAGE_KEY, mode);
    window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY }));
  }, []);

  const toggleViewMode = useCallback(() => {
    const current = getStoredViewMode();
    const next = current === "compact" ? "expanded" : "compact";
    localStorage.setItem(STORAGE_KEY, next);
    window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY }));
  }, []);

  return { viewMode, setViewMode, toggleViewMode };
}
