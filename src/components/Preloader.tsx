import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Executive Preloader Configuration
 * Dynamically styled with the Hero section's ethereal azure / sky-blue and deep navy palette.
 */
export const PRELOADER_CONFIG = {
  brandPart1: "AXIA",
  brandPart2: "KAIROS",
  trademark: "®",
  tagline: "Enterprise AI Foundations & Digital Strategy.",
  minDisplayTimeMs: 1900, // 1.9s duration to ensure smooth brand animation
  maxTimeoutMs: 3200, // Maximum failsafe timeout fallback
};

export const Preloader: React.FC = () => {
  const [shouldRender, setShouldRender] = useState(() => {
    if (typeof window === "undefined") return false;
    if (window.location.pathname.startsWith("/admin")) return false;
    return true; // Always display when opening / reloading page
  });

  const [isExiting, setIsExiting] = useState(false);

  // Dynamic theme detection synchronized with the Hero section
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof document !== 'undefined') {
      return (
        document.documentElement.classList.contains('dark') ||
        localStorage.getItem('theme') === 'dark'
      );
    }
    return false;
  });

  useEffect(() => {
    const updateTheme = () => {
      setIsDark(
        document.documentElement.classList.contains('dark') ||
        localStorage.getItem('theme') === 'dark'
      );
    };
    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    const handleThemeEvent = (e: any) => {
      if (e.detail?.theme) {
        setIsDark(e.detail.theme === 'dark');
      }
    };
    window.addEventListener('themechange', handleThemeEvent);

    return () => {
      observer.disconnect();
      window.removeEventListener('themechange', handleThemeEvent);
    };
  }, []);

  useEffect(() => {
    if (!shouldRender) {
      if (typeof window !== "undefined") {
        (window as any).__PRELOADER_DONE__ = true;
        window.dispatchEvent(new Event("axia:preloader_done"));
      }
      return;
    }

    // Check prefers-reduced-motion
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mql.matches) {
      setIsExiting(true);
      return;
    }

    // Lock page scroll while preloader is active
    const originalOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    let hasExited = false;
    const exitPreloader = () => {
      if (hasExited) return;
      hasExited = true;
      setIsExiting(true);
    };

    // Failsafe timer
    const failsafeTimer = setTimeout(exitPreloader, PRELOADER_CONFIG.maxTimeoutMs);

    // Timed display duration
    const displayTimer = setTimeout(exitPreloader, PRELOADER_CONFIG.minDisplayTimeMs);

    return () => {
      clearTimeout(failsafeTimer);
      clearTimeout(displayTimer);
      document.body.style.overflow = originalOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, [shouldRender]);

  const handleAnimationComplete = () => {
    if (isExiting) {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      setShouldRender(false);
      if (typeof window !== "undefined") {
        (window as any).__PRELOADER_DONE__ = true;
        window.dispatchEvent(new Event("axia:preloader_done"));
      }
    }
  };

  if (!shouldRender) return null;

  // Harmonized palette matching the Hero Section's oceanic teal and radiant cyan glow
  const bgColor = isDark ? '#041214' : '#ffffff';
  const brandPart1Color = isDark ? '#ffffff' : '#073b3a';
  const accentColor = isDark ? '#2dd4bf' : '#0c7075';
  const trademarkColor = isDark ? '#5eead4' : '#0c7075';
  const taglineColor = isDark ? '#94a3b8' : '#134e4a';
  const glowGradient = isDark
    ? 'radial-gradient(circle at 50% 48%, rgba(45, 212, 191, 0.25) 0%, rgba(13, 148, 136, 0.15) 45%, rgba(4, 18, 20, 0.85) 75%)'
    : 'radial-gradient(circle at 50% 48%, rgba(204, 251, 241, 0.7) 0%, rgba(153, 246, 228, 0.35) 45%, rgba(255, 255, 255, 0) 75%)';
  const lineGradient = `linear-gradient(90deg, transparent 0%, ${accentColor} 50%, transparent 100%)`;
  const beaconShadow = isDark
    ? '0 0 12px #2dd4bf, 0 0 24px rgba(45, 212, 191, 0.55)'
    : '0 0 10px #0c7075, 0 0 20px rgba(12, 112, 117, 0.35)';

  return (
    <AnimatePresence onExitComplete={handleAnimationComplete}>
      {!isExiting && (
        <motion.div
          key="axia-preloader"
          initial={{ opacity: 1, y: 0 }}
          exit={{
            y: "-100%",
            transition: {
              duration: 0.75,
              ease: [0.77, 0, 0.175, 1], // Smooth dramatic vertical curtain lift
            },
          }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center select-none overflow-hidden"
          style={{ backgroundColor: bgColor }}
          aria-live="polite"
          aria-busy="true"
        >
          {/* Subtle ambient ethereal atmospheric backdrop glow aligned with Hero */}
          <div
            className="absolute inset-0 pointer-events-none opacity-60"
            style={{
              background: glowGradient,
            }}
            aria-hidden="true"
          />

          {/* Central Logo Container */}
          <div className="relative z-10 flex flex-col items-center justify-center px-4">
            <div className="overflow-hidden py-1 mb-1">
              <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.65,
                  delay: 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex items-center tracking-tight"
              >
                <span
                  className="font-extrabold text-[clamp(32px,5.5vw,56px)] tracking-[-0.03em] leading-none"
                  style={{ color: brandPart1Color }}
                >
                  {PRELOADER_CONFIG.brandPart1}
                </span>
                {PRELOADER_CONFIG.trademark ? (
                  <span
                    className="font-light text-[clamp(14px,2.2vw,22px)] self-start ml-0.5 -mt-1 font-mono"
                    style={{ color: trademarkColor }}
                  >
                    {PRELOADER_CONFIG.trademark}
                  </span>
                ) : null}
                <span
                  className="font-medium text-[clamp(28px,5vw,50px)] tracking-[0.14em] ml-3 leading-none"
                  style={{ color: accentColor }}
                >
                  {PRELOADER_CONFIG.brandPart2}
                </span>
              </motion.div>
            </div>

            {/* Drawing Accent Line - Sky Blue & Azure Glow */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{
                duration: 0.65,
                delay: 0.25,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="h-[1.5px] w-48 sm:w-64 max-w-[80vw] origin-center my-3"
              style={{
                background: lineGradient,
                boxShadow: isDark ? '0 0 10px rgba(56, 189, 248, 0.4)' : '0 0 8px rgba(2, 132, 199, 0.3)',
              }}
            />

            {/* Tagline */}
            <div className="overflow-hidden py-0.5">
              <motion.p
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.55,
                  delay: 0.4,
                  ease: "easeOut",
                }}
                className="font-mono text-[11px] sm:text-[12px] tracking-[0.25em] uppercase text-center"
                style={{ color: taglineColor }}
              >
                {PRELOADER_CONFIG.tagline}
              </motion.p>
            </div>
          </div>

          {/* Minimal Corporate Progress indicator dot */}
          <div className="absolute bottom-10 inset-x-0 flex justify-center items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0.35, 1, 0.35], scale: [0.95, 1.15, 0.95] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              className="w-1.5 h-1.5 rounded-full"
              style={{
                backgroundColor: accentColor,
                boxShadow: beaconShadow,
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
