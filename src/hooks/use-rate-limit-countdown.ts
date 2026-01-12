"use client";

import { useState, useEffect } from "react";

interface UseRateLimitCountdownResult {
  seconds: number;
  isLimited: boolean;
  setSeconds: (seconds: number) => void;
}

export function useRateLimitCountdown(): UseRateLimitCountdownResult {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (seconds <= 0) return;

    const timer = setInterval(() => {
      setSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  return {
    seconds,
    isLimited: seconds > 0,
    setSeconds,
  };
}
