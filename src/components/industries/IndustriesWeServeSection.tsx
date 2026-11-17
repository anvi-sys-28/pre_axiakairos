"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { INDUSTRIES_LIST, type IndustryItem } from "./IndustryData";
import { IndustryVisualization } from "./IndustryVisualizations";

const AUTO_SHIFT_INTERVAL = 2000; // 2 seconds per industry auto-shift

export function IndustriesWeServeSection({ isDark: isDarkProp }: { isDark?: boolean } = {}) {
  const [internalDark, setInternalDark] = useState<boolean>(() => {
    if (typeof document !== 'undefined') {
      return (
        document.documentElement.classList.contains('dark') ||
        localStorage.getItem('theme') === 'dark'
      );
    }
    return false;
  });

  const isDark = isDarkProp !== undefined ? isDarkProp : internalDark;

  useEffect(() => {
    const updateTheme = () => {
      setInternalDark(
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

    const handleThemeEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ theme: string }>;
      if (customEvent.detail) {
        setInternalDark(customEvent.detail.theme === 'dark');
      }
    };
    window.addEventListener('themechange', handleThemeEvent);

    return () => {
      observer.disconnect();
      window.removeEventListener('themechange', handleThemeEvent);
    };
  }, []);

  const [activeId, setActiveId] = useState<string>("automotive-manufacturing");
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [progressKey, setProgressKey] = useState<number>(0);
  const [hoveredSubsystem, setHoveredSubsystem] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activeIndex = INDUSTRIES_LIST.findIndex((item) => item.id === activeId);
  const activeItem: IndustryItem =
    INDUSTRIES_LIST[activeIndex] || INDUSTRIES_LIST[0];

  // Reset hovered subsystem when active industry shifts
  useEffect(() => {
    setHoveredSubsystem(null);
  }, [activeId]);

  // Automatic shifting loop
  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setActiveId((currId) => {
        const currIdx = INDUSTRIES_LIST.findIndex((i) => i.id === currId);
        const nextIdx = (currIdx + 1) % INDUSTRIES_LIST.length;
        return INDUSTRIES_LIST[nextIdx].id;
      });
      setProgressKey((k) => k + 1);
    }, AUTO_SHIFT_INTERVAL);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, activeId]);

  // Handler for explicit manual user clicks: switches immediately and resets progress
  const handleSelectIndustry = (id: string) => {
    setActiveId(id);
    setProgressKey((k) => k + 1);
  };

  return (
    <section
      id="industriesSection"
      aria-label="Industries We Serve"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`w-full border-t border-b relative z-20 scroll-mt-20 pt-10 sm:pt-12 lg:pt-14 transition-colors duration-300 ${
        isDark
          ? "bg-[#141414] text-[#f4f4f5] border-white/10 selection:bg-[#2ff59b] selection:text-[#08120d]"
          : "bg-[#faf8f5] text-[#18181b] border-[#e5e2d9] selection:bg-[#0c7075] selection:text-white"
      }`}
    >
      <div className="w-full max-w-[1720px] mx-auto">
        {/* Main 3-Column Architectural Editorial Grid */}
        <div className="flex flex-col lg:flex-row min-h-[640px] lg:min-h-[660px]">
          
          {/* ============================================================== */}
          {/* LEFT PANEL: Industry Navigation List (~23% width)              */}
          {/* ============================================================== */}
          <nav
            aria-label="Industry Categories"
            className={`w-full lg:w-[23%] shrink-0 border-b lg:border-b-0 lg:border-r flex flex-col justify-start transition-colors duration-300 ${
              isDark ? "border-white/10 bg-[#111215]" : "border-[#e5e2d9] bg-[#ffffff]"
            }`}
          >
            {/* Header label */}
            <div
              className={`px-6 py-4 lg:py-5 border-b flex items-center justify-between ${
                isDark ? "border-white/10" : "border-[#e5e2d9]"
              }`}
            >
              <span
                className={`font-mono text-[11px] lg:text-[12px] font-semibold tracking-wider uppercase select-none flex items-center gap-2 ${
                  isDark ? "text-emerald-400/90" : "text-emerald-800"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                    isDark ? "bg-[#2ff59b]" : "bg-[#059669]"
                  }`}
                />
                [ INDUSTRIES WE SERVE ]
              </span>
              <span
                className={`font-mono text-[10px] hidden sm:inline-block ${
                  isDark ? "text-zinc-500" : "text-slate-400"
                }`}
              >
                {isPaused ? "PAUSED" : "AUTO"}
              </span>
            </div>

            {/* 12 Industry Navigation Buttons */}
            <ul
              className={`flex flex-col w-full divide-y m-0 p-0 list-none ${
                isDark ? "divide-white/5" : "divide-[#f1efe9]"
              }`}
            >
              {INDUSTRIES_LIST.map((item) => {
                const isActive = item.id === activeId;
                return (
                  <li key={item.id} className="w-full">
                    <button
                      type="button"
                      onClick={() => handleSelectIndustry(item.id)}
                      onKeyDown={(e) => {
                        if (e.key === "ArrowDown") {
                          e.preventDefault();
                          const idx = INDUSTRIES_LIST.findIndex((i) => i.id === item.id);
                          const next = INDUSTRIES_LIST[(idx + 1) % INDUSTRIES_LIST.length];
                          handleSelectIndustry(next.id);
                        } else if (e.key === "ArrowUp") {
                          e.preventDefault();
                          const idx = INDUSTRIES_LIST.findIndex((i) => i.id === item.id);
                          const prev = INDUSTRIES_LIST[(idx - 1 + INDUSTRIES_LIST.length) % INDUSTRIES_LIST.length];
                          handleSelectIndustry(prev.id);
                        }
                      }}
                      className={`group w-full relative text-left flex items-center px-6 py-3 lg:py-3.5 transition-colors duration-150 cursor-pointer overflow-hidden ${
                        isActive
                          ? (isDark ? "bg-[#181a20] text-white" : "bg-[#18181b] text-white")
                          : (isDark
                              ? "bg-transparent text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200"
                              : "bg-transparent text-[#3f3f46] hover:bg-[#f5f2eb] hover:text-[#09090b]")
                      }`}
                      aria-current={isActive ? "true" : undefined}
                    >
                      {/* Active Left Vertical Accent Line: HERO GREEN! */}
                      {isActive && (
                        <motion.div
                          layoutId="activeIndustryIndicator"
                          className={`absolute left-0 top-0 bottom-0 w-[3.5px] ${
                            isDark
                              ? "bg-[#2ff59b] shadow-[0_0_12px_rgba(47,245,155,0.7)]"
                              : "bg-[#10b981] shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                          }`}
                          transition={{ type: "spring", stiffness: 450, damping: 35 }}
                        />
                      )}

                      {/* Micro Progress Bar on Active Tab */}
                      {isActive && !isPaused && (
                        <motion.div
                          key={`progress-${progressKey}-${item.id}`}
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: AUTO_SHIFT_INTERVAL / 1000, ease: "linear" }}
                          className={`absolute bottom-0 left-0 h-[1.5px] pointer-events-none ${
                            isDark ? "bg-[#2ff59b]/25" : "bg-[#10b981]/30"
                          }`}
                        />
                      )}

                      {/* Number and slash */}
                      <span
                        className={`font-mono text-[12px] lg:text-[13px] font-medium tracking-tight ${
                          isActive
                            ? (isDark ? "text-[#2ff59b]" : "text-[#10b981]")
                            : (isDark ? "text-zinc-500 group-hover:text-zinc-300" : "text-[#71717a] group-hover:text-[#18181b]")
                        }`}
                      >
                        {item.number}
                      </span>
                      <span
                        className={`mx-2 text-[12px] lg:text-[13px] select-none ${
                          isActive
                            ? (isDark ? "text-emerald-500/50" : "text-emerald-400/60")
                            : (isDark ? "text-zinc-700" : "text-zinc-300")
                        }`}
                      >
                        /
                      </span>

                      {/* Industry Name */}
                      <span
                        className={`font-sans text-[12.5px] lg:text-[13px] tracking-tight leading-snug truncate ${
                          isActive
                            ? "text-white font-semibold"
                            : (isDark
                                ? "text-zinc-400 font-normal group-hover:text-zinc-100"
                                : "text-[#3f3f46] font-normal group-hover:text-[#09090b]")
                        }`}
                      >
                        {item.name}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* ============================================================== */}
          {/* CENTER PANEL: Anatomy Crafted Isometric Technical Plate (~47%) */}
          {/* ============================================================== */}
          <div
            className={`w-full lg:w-[47%] flex-1 border-b lg:border-b-0 lg:border-r relative flex flex-col justify-between p-4 sm:p-5 lg:p-6 overflow-hidden min-h-[500px] lg:min-h-[660px] transition-colors duration-300 ${
              isDark ? "border-white/10 bg-[#111215]" : "border-[#e5e2d9] bg-[#fbfbfa]"
            }`}
          >
            {/* Grid pattern */}
            <div
              className={`absolute inset-0 pointer-events-none ${isDark ? "opacity-[0.16]" : "opacity-[0.10]"}`}
              style={{
                backgroundImage: isDark
                  ? `radial-gradient(circle at 1px 1px, #2ff59b 1px, transparent 0)`
                  : `radial-gradient(circle at 1px 1px, #0c7075 1.2px, transparent 0)`,
                backgroundSize: "28px 28px",
              }}
              aria-hidden="true"
            />

            {/* Ambient radial glow */}
            <div
              className={`absolute inset-0 pointer-events-none ${
                isDark
                  ? "bg-[radial-gradient(ellipse_at_center,_rgba(47,245,155,0.06)_0%,_transparent_72%)]"
                  : "bg-[radial-gradient(ellipse_at_center,_rgba(16,185,129,0.08)_0%,_transparent_72%)]"
              }`}
              aria-hidden="true"
            />

            {/* Architectural Frame Corner Accents */}
            <span
              className={`absolute top-3 left-3 w-3 h-3 border-t border-l pointer-events-none ${
                isDark ? "border-[#2ff59b]/40" : "border-[#0c7075]/40"
              }`}
            />
            <span
              className={`absolute top-3 right-3 w-3 h-3 border-t border-r pointer-events-none ${
                isDark ? "border-[#2ff59b]/40" : "border-[#0c7075]/40"
              }`}
            />
            <span
              className={`absolute bottom-3 left-3 w-3 h-3 border-b border-l pointer-events-none ${
                isDark ? "border-[#2ff59b]/40" : "border-[#0c7075]/40"
              }`}
            />
            <span
              className={`absolute bottom-3 right-3 w-3 h-3 border-b border-r pointer-events-none ${
                isDark ? "border-[#2ff59b]/40" : "border-[#0c7075]/40"
              }`}
            />

            {/* Anatomy Plate Header: Fig n (left) & Figure Title (right) */}
            <div className="relative z-20 flex items-center justify-between text-[10.5px] sm:text-[11px] font-mono tracking-wider px-1 pt-1 pointer-events-none select-none">
              <div className={`flex items-center gap-2 ${isDark ? "text-zinc-300" : "text-slate-600"}`}>
                <span className={`font-bold ${isDark ? "text-[#2ff59b]" : "text-[#0c7075]"}`}>
                  FIG. {activeItem.number}
                </span>
                <span className={isDark ? "text-zinc-600" : "text-slate-300"}>//</span>
                <span className={`uppercase tracking-widest font-semibold ${isDark ? "text-zinc-400" : "text-slate-600"}`}>
                  ANATOMY TEST-RIG
                </span>
              </div>
              <div
                className={`text-right truncate max-w-[55%] uppercase tracking-wider font-medium hidden sm:block ${
                  isDark ? "text-zinc-400" : "text-slate-600"
                }`}
              >
                {activeItem.figureTitle}
              </div>
            </div>

            {/* Central Isometric Architectural Anatomy Stage */}
            <div className="relative w-full flex-1 flex items-center justify-center z-10 my-2">
              <IndustryVisualization
                industryId={activeItem.id}
                isDark={isDark}
                hoveredSubsystem={hoveredSubsystem}
                onHoverSubsystem={setHoveredSubsystem}
              />
            </div>

            {/* Anatomy Plate Footer: Hint (left) & Live Telemetry Readout (right) */}
            <div className="relative z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] sm:text-[10.5px] font-mono tracking-wider px-1 pb-1 select-none">
              <div className={`flex items-center gap-1.5 uppercase tracking-wider ${isDark ? "text-zinc-500" : "text-slate-500"}`}>
                <span className={`font-bold ${isDark ? "text-[#2ff59b]" : "text-[#0c7075]"}`}>✛</span>
                <span>HOVER PARTS TO INSPECT SUBSYSTEMS</span>
              </div>
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-sm max-w-full overflow-hidden ${
                  isDark
                    ? "text-[#2ff59b] bg-[#141816]/90 backdrop-blur-md border border-[#2ff59b]/30 shadow-[0_0_12px_rgba(47,245,155,0.18)]"
                    : "text-[#0c7075] bg-[#ffffff]/95 backdrop-blur-md border border-[#10b981]/40 shadow-[0_2px_12px_rgba(16,185,129,0.15)]"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full animate-ping shrink-0 ${
                    isDark ? "bg-[#2ff59b]" : "bg-[#10b981]"
                  }`}
                />
                <span
                  className={`tabular-nums truncate font-mono text-[10.5px] sm:text-[11px] ${
                    isDark ? "text-zinc-200" : "text-slate-800"
                  }`}
                >
                  {hoveredSubsystem && activeItem.subsystems?.[hoveredSubsystem] ? (
                    <>
                      <strong className={`font-semibold ${isDark ? "text-[#2ff59b]" : "text-[#0c7075]"}`}>
                        {activeItem.subsystems[hoveredSubsystem].name.toUpperCase()}
                      </strong>{" "}
                      <span className={isDark ? "text-zinc-500" : "text-slate-400"}>//</span>{" "}
                      <span className={isDark ? "text-zinc-300" : "text-slate-600"}>
                        {activeItem.subsystems[hoveredSubsystem].telemetry}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className={`font-semibold ${isDark ? "text-[#2ff59b]" : "text-[#0c7075]"}`}>
                        [ LIVE RUN ]
                      </span>{" "}
                      <span className={isDark ? "text-zinc-400" : "text-slate-600"}>
                        {activeItem.defaultReadout}
                      </span>
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Embedded Anatomy Animation Styles */}
            <style>{`
              @keyframes iso-flow {
                to { stroke-dashoffset: -32; }
              }
              @keyframes iso-pulse {
                0%, 100% { opacity: 0.25; transform: scale(0.96); }
                50% { opacity: 1; transform: scale(1.04); }
              }
              .iso-flow-line {
                animation: iso-flow 1.6s linear infinite;
              }
              .iso-pulse-node {
                animation: iso-pulse 2s ease-in-out infinite;
              }
            `}</style>
          </div>

          {/* ============================================================== */}
          {/* RIGHT PANEL: Details, Headline & Capabilities (~30% width)     */}
          {/* ============================================================== */}
          <div
            className={`w-full lg:w-[30%] shrink-0 p-6 sm:p-8 lg:p-10 flex flex-col justify-between transition-colors duration-300 ${
              isDark ? "bg-[#141414]" : "bg-[#faf8f5]"
            }`}
          >
            {/* Top Row: Sequential Counter & Monospace Header */}
            <div>
              <div className="flex items-baseline justify-between">
                <div className="flex items-baseline font-sans">
                  <span
                    className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight ${
                      isDark ? "text-white" : "text-[#0f172a]"
                    }`}
                  >
                    {activeItem.number}
                  </span>
                  <span
                    className={`font-mono text-sm sm:text-base font-normal ml-2 ${
                      isDark ? "text-zinc-500" : "text-slate-500"
                    }`}
                  >
                    / 12
                  </span>
                </div>
                <span
                  className={`font-mono text-[11px] lg:text-xs font-bold tracking-widest uppercase ${
                    isDark ? "text-emerald-400" : "text-emerald-700"
                  }`}
                >
                  INDUSTRIES
                </span>
              </div>

              {/* Hairline Divider */}
              <div
                className={`w-full h-px my-5 sm:my-6 ${
                  isDark ? "bg-white/10" : "bg-[#e5e2d9]"
                }`}
              />

              {/* Dynamic Content Transitions */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeItem.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28, ease: "easeInOut" }}
                  className="space-y-5"
                >
                  {/* Tag with Emerald Square Indicator: HERO GREEN instead of orange! */}
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-2.5 h-2.5 shrink-0 inline-block ${
                        isDark
                          ? "bg-[#2ff59b] shadow-[0_0_8px_rgba(47,245,155,0.8)]"
                          : "bg-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.6)]"
                      }`}
                      aria-hidden="true"
                    />
                    <span
                      className={`font-mono text-[11px] lg:text-xs font-bold tracking-wider uppercase ${
                        isDark ? "text-emerald-400" : "text-emerald-800"
                      }`}
                    >
                      {activeItem.tag}
                    </span>
                  </div>

                  {/* Large Architectural Headline */}
                  <h3
                    className={`font-sans text-xl sm:text-2xl lg:text-3xl font-black leading-[1.12] tracking-tight uppercase ${
                      isDark ? "text-white" : "text-[#0f172a]"
                    }`}
                  >
                    {activeItem.headline}
                  </h3>

                  {/* Concise Description */}
                  <p
                    className={`font-sans text-[13px] sm:text-[14px] leading-relaxed font-normal ${
                      isDark ? "text-zinc-400" : "text-slate-600"
                    }`}
                  >
                    {activeItem.description}
                  </p>

                  {/* Capabilities Section */}
                  <div className="pt-2">
                    <h4
                      className={`font-mono text-[11px] lg:text-xs font-bold tracking-widest uppercase mb-3.5 ${
                        isDark ? "text-zinc-300" : "text-slate-800"
                      }`}
                    >
                      CAPABILITIES
                    </h4>
                    <ul className="space-y-2.5 list-none m-0 p-0">
                      {activeItem.capabilities.map((cap, idx) => (
                        <li
                          key={idx}
                          className={`flex items-start gap-3 text-[12px] sm:text-[13px] font-medium leading-snug ${
                            isDark ? "text-zinc-200" : "text-slate-800"
                          }`}
                        >
                          {/* HERO GREEN Dash Bullet */}
                          <span
                            className={`w-3.5 h-[2px] shrink-0 mt-[8px] ${
                              isDark
                                ? "bg-[#2ff59b] shadow-[0_0_6px_rgba(47,245,155,0.6)]"
                                : "bg-[#10b981] shadow-[0_0_6px_rgba(16,185,129,0.5)]"
                            }`}
                            aria-hidden="true"
                          />
                          <span>{cap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom Action: Underlined Explore Link with Arrow */}
            <div className="pt-8 lg:pt-10">
              <a
                href={activeItem.href}
                className={`group inline-flex items-center gap-2 font-mono text-xs sm:text-[13px] font-bold tracking-wider uppercase underline underline-offset-4 decoration-1 transition-colors duration-200 ${
                  isDark
                    ? "text-[#2ff59b] decoration-[#2ff59b]/50 hover:text-[#34d399] hover:decoration-[#2ff59b]"
                    : "text-[#0c7075] decoration-[#0c7075]/40 hover:text-[#065f46] hover:decoration-[#0c7075]"
                }`}
              >
                <span>EXPLORE INDUSTRY</span>
                <span
                  className="font-sans text-sm transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"
                >
                  →
                </span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default IndustriesWeServeSection;
