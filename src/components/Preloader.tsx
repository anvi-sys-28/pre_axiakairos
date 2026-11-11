import React, { useEffect } from 'react';

/**
 * Executive Preloader
 * Loading screen delay disabled for instantaneous, zero-latency navigation.
 */
export const PRELOADER_CONFIG = {
  brandPart1: "AXIA",
  brandPart2: "KAIROS",
  trademark: "®",
  tagline: "Enterprise AI Foundations & Digital Strategy.",
  minDisplayTimeMs: 0,
  maxTimeoutMs: 0,
};

export const Preloader: React.FC = () => {
  useEffect(() => {
    // Dispatch completion events immediately so any dependent components activate with zero delay
    if (typeof window !== "undefined") {
      (window as any).__PRELOADER_DONE__ = true;
      window.dispatchEvent(new Event("axia:preloader_done"));
    }
    // Ensure document and body are never locked
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
  }, []);

  // Return null immediately for instant, flicker-free rendering
  return null;
};
