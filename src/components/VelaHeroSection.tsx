import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
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
    word: 'Transform',
    icon: 'https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/83de7c35-dd91-4e56-bfb8-0ffafc83d0e0.webp',
    tint: '#0c7075',
    layerClass: 'vela-layer-message',
  },
  {
    word: 'Modernize',
    icon: 'https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/4d952211-0474-48cc-af48-58f68b3b7525.webp',
    tint: '#0891b2',
    layerClass: 'vela-layer-browse',
  },
  {
    word: 'Automate',
    icon: 'https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/e2e91fca-5b3f-4e0e-a437-8a581592e407.webp',
    tint: '#10b981',
    layerClass: 'vela-layer-transact',
  },
  {
    word: 'Accelerate',
    icon: 'https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/6b32bb47-4ad6-4938-a637-c997b373c68b.webp',
    tint: '#6366f1',
    layerClass: 'vela-layer-buildweb',
  },
];

const DEFAULT_STATS: VelaStatItem[] = [
  { number: '99.9%', label: 'Application & cloud continuity' },
  { number: '100+', label: 'Enterprise modernizations delivered' },
  { number: '4', label: 'Global delivery hubs (Canada, USA, UAE, India)' },
];

export const VelaHeroSection: React.FC<VelaHeroProps> = ({
  pageEyebrow,
  line2 = 'your digital future',
  caption = (
    <>
      Axia Kairos combines strategic management consulting with next-generation<br />
      enterprise technology to transform operations and drive measurable ROI.
    </>
  ),
  stripHeading = 'Engineering Value\nAt Critical Moments',
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

          {/* Action Row: Enterprise CTAs + Caption */}
          <div className="vela-row">
            <div className="vela-buttons-group">
              <button
                type="button"
                onClick={handleScrollClick}
                className="vela-cta-btn vela-cta-primary"
              >
                <span>Explore Capabilities</span>
                <ArrowDown className="w-4 h-4 ml-1.5" />
              </button>

              <Link
                to="/contact"
                className="vela-cta-btn vela-cta-secondary"
              >
                <span>Talk to Our Experts</span>
                <ArrowUpRight className="w-4 h-4 ml-1.5" />
              </Link>
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
