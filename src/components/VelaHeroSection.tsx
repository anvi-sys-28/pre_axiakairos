import React, { useEffect, useState, useRef } from 'react';
import '@/styles/vela-hero.css';

export interface VelaStatItem {
  number: string;
  label: string;
}

export interface VelaHeroProps {
  pageEyebrow?: string;
  line2?: string;
  caption?: React.ReactNode;
  stripHeading?: string;
  stats?: VelaStatItem[];
  scrollTargetId?: string;
}

interface VelaWordSlot {
  word: string;
  icon: string;
  tint: string;
  layerClass: string;
}

const VELA_SLOTS: VelaWordSlot[] = [
  {
    word: 'Message',
    icon: 'https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/83de7c35-dd91-4e56-bfb8-0ffafc83d0e0.webp',
    tint: '#E9C22E',
    layerClass: 'vela-layer-message',
  },
  {
    word: 'Browse',
    icon: 'https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/4d952211-0474-48cc-af48-58f68b3b7525.webp',
    tint: '#F2772F',
    layerClass: 'vela-layer-browse',
  },
  {
    word: 'Transact',
    icon: 'https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/e2e91fca-5b3f-4e0e-a437-8a581592e407.webp',
    tint: '#3FB874',
    layerClass: 'vela-layer-transact',
  },
  {
    word: 'Build web',
    icon: 'https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/6b32bb47-4ad6-4938-a637-c997b373c68b.webp',
    tint: '#C564C4',
    layerClass: 'vela-layer-buildweb',
  },
];

const DEFAULT_STATS: VelaStatItem[] = [
  { number: '11.5M+', label: 'Active accounts' },
  { number: '$0.0002', label: 'Average cost per transaction' },
  { number: '80+', label: 'Dapps integrations' },
];

export const VelaHeroSection: React.FC<VelaHeroProps> = ({
  pageEyebrow,
  line2 = 'in your terms',
  caption = (
    <>
      Vela is a secure messaging app, crypto wallet, and<br />
      Web3 browser built with state of the art technology.
    </>
  ),
  stripHeading = 'Nothing great is\nmade alone',
  stats = DEFAULT_STATS,
  scrollTargetId,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLeaving, setIsLeaving] = useState(false);
  const timerRef = useRef<number | null>(null);
  const leaveTimerRef = useRef<number | null>(null);

  // Cycle clock: 1.75s per slot (1750ms). Leave triggers 420ms before transition.
  useEffect(() => {
    // Check reduced motion preference
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setActiveIndex(1); // Browse state
      return;
    }

    let isPaused = false;
    const handleVisibility = () => {
      isPaused = document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const runSlotCycle = () => {
      if (isPaused) return;

      // Start leave transition 420ms before next slot
      leaveTimerRef.current = window.setTimeout(() => {
        if (!isPaused) {
          setIsLeaving(true);
        }
      }, 1330);

      // Switch to next slot at 1750ms
      timerRef.current = window.setTimeout(() => {
        if (!isPaused) {
          setIsLeaving(false);
          setActiveIndex((prev) => (prev + 1) % VELA_SLOTS.length);
        }
        runSlotCycle();
      }, 1750);
    };

    runSlotCycle();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      if (timerRef.current) clearTimeout(timerRef.current);
      if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    };
  }, []);

  const activeSlot = VELA_SLOTS[activeIndex];
  const isAppStoreFlash = activeSlot.word === 'Build web';

  const handleScrollClick = () => {
    if (scrollTargetId) {
      const el = document.getElementById(scrollTargetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    // Default fallback: scroll past hero
    const nextEl = document.querySelector('.vela-strip-container');
    if (nextEl) {
      const rect = nextEl.getBoundingClientRect();
      window.scrollBy({ top: rect.bottom, behavior: 'smooth' });
    }
  };

  return (
    <section className="vela-hero-root" aria-label="Hero Section">
      {/* 1. Top 75% Hero Panel */}
      <div className="vela-panel-stage">
        {/* Four Stacked Pastel Gradient Layers */}
        {VELA_SLOTS.map((slot, index) => (
          <div
            key={slot.word}
            className={`vela-layer ${slot.layerClass} ${index === activeIndex ? 'is-active' : ''}`}
            aria-hidden="true"
          />
        ))}

        {/* SVG Noise Grain Overlay */}
        <svg className="vela-grain-overlay" aria-hidden="true">
          <filter id="velaFractalNoise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.75"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#velaFractalNoise)" />
        </svg>

        {/* Content Frame: Headline & Action Row */}
        <div className="vela-content-frame">
          {/* Headline Block */}
          <div className="vela-headline-container">
            {pageEyebrow && (
              <div className="vela-badge">
                <span className="vela-badge-dot" aria-hidden="true" />
                <span>{pageEyebrow}</span>
              </div>
            )}

            <h1 className="vela-headline">
              {/* Line 1: Cycling Slot (Icon + Verb) */}
              <div className="vela-headline-line-1">
                <div
                  key={activeSlot.word}
                  className={`vela-slot-word-wrap ${isLeaving ? 'is-leaving' : 'is-entering'}`}
                >
                  {/* Dynamic Tinted 3D Candy Icon */}
                  <span
                    className="vela-icon-wrapper"
                    style={{ '--tint': activeSlot.tint } as React.CSSProperties}
                  >
                    <img
                      src={activeSlot.icon}
                      alt=""
                      className="vela-icon-base"
                      loading="eager"
                      aria-hidden="true"
                    />
                    <span
                      className="vela-icon-tint"
                      style={{
                        backgroundColor: activeSlot.tint,
                        maskImage: `url(${activeSlot.icon})`,
                        WebkitMaskImage: `url(${activeSlot.icon})`,
                      }}
                      aria-hidden="true"
                    />
                  </span>

                  {/* Word */}
                  <span className="vela-slot-text">{activeSlot.word}</span>
                </div>
              </div>

              {/* Line 2: Static "in your terms" */}
              <span className="vela-headline-line-2">{line2}</span>
            </h1>
          </div>

          {/* Action Row: Two Store Buttons + Caption */}
          <div className="vela-row">
            <div className="vela-buttons-group">
              {/* App Store Button (Neutral Line Apple Glyph) */}
              <button
                type="button"
                className={`vela-store-btn ${isAppStoreFlash ? 'app-store-flash' : ''}`}
                aria-label="Download on the App Store"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.42c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.64 1.35-.57.65-1.07 1.72-.94 2.74 1.01.08 2.03-.49 2.65-1.24z" />
                </svg>
                <span>App Store</span>
              </button>

              {/* Google Play Button (Neutral Line Play Triangle Glyph) */}
              <button
                type="button"
                className="vela-store-btn"
                aria-label="Get it on Google Play"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5.5 3.5l13 8.5-13 8.5v-17z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                </svg>
                <span>Google Play</span>
              </button>
            </div>

            {/* 2-line Caption */}
            <p className="vela-caption">{caption}</p>
          </div>
        </div>
      </div>

      {/* 2. Bottom 25% Stats Strip in Cream with Curved Notch */}
      <div className="vela-strip-container">
        {/* Notch SVG */}
        <svg
          className="vela-notch-svg"
          viewBox="0 0 1440 62"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            className="vela-notch-path"
            d="M0 62 H1062 C1092 62 1098 54 1116 34 C1138 9 1146 1 1178 1 H1440 V62 Z"
          />
        </svg>

        {/* Scroll Hint Button sitting on the raised right part of the notch */}
        <button
          type="button"
          onClick={handleScrollClick}
          className="vela-scroll-hint-btn"
          aria-label="Scroll to learn more"
        >
          <span>↓ Scroll to learn more</span>
        </button>

        {/* Strip Content Grid */}
        <div className="vela-strip-content">
          {/* Left: "Nothing great is / made alone" */}
          <h2 className="vela-strip-heading">
            {stripHeading.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i === 0 && <br />}
              </React.Fragment>
            ))}
          </h2>

          {/* Center: Three Stats */}
          <div className="vela-stats-grid">
            {stats.map((stat) => (
              <div key={stat.label} className="vela-stat-item">
                <span className="vela-stat-number">{stat.number}</span>
                <span className="vela-stat-label">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Right: Thin Line-Art Sprout */}
          <div className="vela-sprout-art" aria-hidden="true">
            <svg
              viewBox="0 0 48 68"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-full h-full"
            >
              {/* Ground line */}
              <line x1="4" y1="64" x2="44" y2="64" />
              {/* Stem */}
              <path d="M24 64 C24 46 22 28 24 16" />
              {/* Left Leaf */}
              <path d="M23 40 C14 38 10 26 12 18 C20 18 24 26 23 40 Z" />
              {/* Right Leaf */}
              <path d="M24 26 C33 24 38 14 36 6 C28 6 24 14 24 26 Z" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VelaHeroSection;
