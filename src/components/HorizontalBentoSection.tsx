"use client";

import React, { useId, useState } from "react";
import {
  CtaLink,
  blockToneProps,
  type BlockTone,
} from "@/components/ui/marketing-feature-bento-utils/marketing-kit";
import {
  MARKETING_BENTO_SAMPLE,
  FeatureCard,
  type BentoFeature,
} from "@/components/ui/marketing-feature-bento";
import { cn } from "@/lib/utils";
import { Activity, ArrowRight, Layers } from "lucide-react";
import {
  SwarmCardAgent,
  SWARM_AGENTS,
  SwarmHUD,
} from "@/components/ui/swarm-rebuild-cursors";

interface HorizontalBentoSectionProps {
  features?: BentoFeature[];
  eyebrow?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  cta?: { label: string; href: string };
  tone?: BlockTone;
  isDark?: boolean;
  activePanel?: number;
  onNavigate?: (panelIndex: number) => void;
  className?: string;
}

export function HorizontalBentoSection({
  features = MARKETING_BENTO_SAMPLE.features,
  eyebrow = MARKETING_BENTO_SAMPLE.eyebrow,
  title = MARKETING_BENTO_SAMPLE.title,
  description = MARKETING_BENTO_SAMPLE.description,
  cta = MARKETING_BENTO_SAMPLE.cta,
  tone,
  isDark: isDarkProp,
  activePanel = 0,
  onNavigate,
  className,
}: HorizontalBentoSectionProps) {
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

  // Swarm simulation state
  const [isSwarmPlaying, setIsSwarmPlaying] = useState<boolean>(true);
  const [swarmMutations, setSwarmMutations] = useState<number>(168);
  const handleSwarmSurge = () => {
    setSwarmMutations((prev) => prev + 24);
  };

  React.useEffect(() => {
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

  const titleId = useId();
  const effectiveTone: BlockTone = tone || (isDark ? "dark" : "light");
  const toneProps = blockToneProps(effectiveTone);

  // Split features into balanced horizontal columns
  const tracesCard = features.find((f) => f.id === "traces") || features[0];
  const replayCard = features.find((f) => f.id === "replay") || features[1];
  const alertsCard = features.find((f) => f.id === "alerts") || features[2];
  const costCard = features.find((f) => f.id === "cost") || features[3];

  return (
    <section
      aria-labelledby={titleId}
      {...toneProps}
      className={cn(
        "relative flex h-full w-full items-center justify-start overflow-hidden py-6 sm:py-8 font-bjork-alpha text-[color:var(--bjork-text)] select-none transition-colors duration-300",
        isDark ? "bg-[#141414] dark" : "bg-[#faf8f5] light",
        toneProps.className,
        className
      )}
    >
      {/* Background Subtle Gradient Mesh (Black & Emerald Green in dark, Warm Cream & Pine in light) */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40 transition-opacity duration-300"
        style={{
          background: isDark
            ? "radial-gradient(ellipse 60% 50% at 20% 40%, rgba(16, 185, 129, 0.09), transparent 70%), radial-gradient(ellipse 50% 60% at 80% 60%, rgba(45, 212, 191, 0.07), transparent 70%)"
            : "radial-gradient(ellipse 60% 50% at 20% 40%, rgba(12, 112, 117, 0.08), transparent 70%), radial-gradient(ellipse 50% 60% at 80% 60%, rgba(16, 185, 129, 0.06), transparent 70%)",
        }}
      />

      {/* Luminous Section 2 -> Section 3 Transition Seam */}
      <div
        className={cn(
          "pointer-events-none absolute left-0 top-0 bottom-0 w-24 z-20 transition-all duration-300",
          isDark
            ? "bg-gradient-to-r from-[#141414] via-emerald-500/10 to-transparent"
            : "bg-gradient-to-r from-[#faf8f5] via-emerald-700/10 to-transparent"
        )}
        aria-hidden="true"
      />

      {/* Horizontal Panorama Sequence Container */}
      <div className="relative z-10 flex h-full items-center px-6 sm:px-12 lg:px-16 gap-8 lg:gap-12 w-max">
        {/* Column 0: Hero / Section Intro Heading */}
        <div
          data-swarm-card="intro"
          className="relative flex h-[82vh] max-h-[640px] w-[340px] sm:w-[400px] shrink-0 flex-col justify-between rounded-[26px] border border-[color:var(--bjork-border)] bg-[var(--bjork-surface)] p-8 shadow-[var(--bjork-shadow-panel)] backdrop-blur-md transition-all duration-300"
        >
          {/* Swarm Agent Atlas locked inside Intro card */}
          <SwarmCardAgent
            agent={SWARM_AGENTS.atlas}
            cardTag="INTRO"
            isDark={isDark}
            isPaused={!isSwarmPlaying}
          />

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-[var(--bjork-accent-soft)] text-[color:var(--bjork-accent)] border border-[color:var(--bjork-accent-muted)]">
                <Layers className="size-4" />
              </span>
              <span className="rounded-full bg-[var(--bjork-accent-soft)] px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-[color:var(--bjork-accent)] border border-[color:var(--bjork-accent-muted)]">
                {eyebrow}
              </span>
            </div>

            <h2
              id={titleId}
              className="font-bjork-display text-[28px] sm:text-[34px] font-bold tracking-tight text-[color:var(--bjork-text)] leading-[1.12]"
            >
              {title}
            </h2>

            <p className="text-[14px] sm:text-[15px] leading-relaxed text-[color:var(--bjork-text-medium)]">
              {description}
            </p>
          </div>

          <div className="flex flex-col gap-5 pt-4 border-t border-[color:var(--bjork-border)]">
            {cta && (
              <CtaLink
                link={cta}
                variant="primary"
                arrow
                className="w-full justify-center shadow-lg shadow-[rgba(16,185,129,0.25)]"
              />
            )}

            {/* Native Swarm HUD Controller in Intro Card Footer */}
            <div className="flex items-center justify-between pt-1">
              <SwarmHUD
                isDark={isDark}
                isPlaying={isSwarmPlaying}
                onTogglePlay={() => setIsSwarmPlaying(!isSwarmPlaying)}
                onSurge={handleSwarmSurge}
                mutationCount={swarmMutations}
              />
            </div>

            {/* Quick horizontal nav guide */}
            <div className="flex items-center justify-between text-xs text-[color:var(--bjork-text-muted)] font-mono">
              <span className="flex items-center gap-1.5">
                <Activity className="size-3.5 text-emerald-400" />
                Live Telemetry
              </span>
              <span className="flex items-center gap-1 text-[color:var(--bjork-accent)]">
                Scroll horizontally <ArrowRight className="size-3" />
              </span>
            </div>
          </div>
        </div>

        {/* Column 1: Live Traces & Replay */}
        <div className="flex h-[82vh] max-h-[640px] w-[500px] sm:w-[540px] shrink-0 flex-col gap-5 justify-between">
          {tracesCard && (
            <div data-swarm-card="traces" className="relative flex-1 min-h-0 overflow-visible transition-all duration-300 rounded-[26px]">
              {/* Swarm Agent Nova locked inside Live Traces card */}
              <SwarmCardAgent
                agent={SWARM_AGENTS.nova}
                cardTag="TRACES"
                isDark={isDark}
                isPaused={!isSwarmPlaying}
              />
              <FeatureCard feature={tracesCard} index={0} animate={true} />
            </div>
          )}
          {replayCard && (
            <div data-swarm-card="replay" className="relative h-[210px] shrink-0 overflow-visible transition-all duration-300 rounded-[26px]">
              {/* Swarm Agent Cipher locked inside Replay card */}
              <SwarmCardAgent
                agent={SWARM_AGENTS.cipher}
                cardTag="REPLAY"
                isDark={isDark}
                isPaused={!isSwarmPlaying}
              />
              <FeatureCard feature={replayCard} index={1} animate={true} />
            </div>
          )}
        </div>

        {/* Column 2: Alerts & Cost Histogram */}
        <div className="flex h-[82vh] max-h-[640px] w-[420px] sm:w-[460px] shrink-0 flex-col gap-5 justify-between">
          {alertsCard && (
            <div data-swarm-card="alerts" className="relative flex-1 min-h-0 overflow-hidden transition-all duration-300 rounded-[26px]">
              <FeatureCard feature={alertsCard} index={2} animate={true} />
            </div>
          )}
          {costCard && (
            <div data-swarm-card="cost" className="relative h-[240px] shrink-0 overflow-visible transition-all duration-300 rounded-[26px]">
              {/* Swarm Agent Flux locked inside Cost card */}
              <SwarmCardAgent
                agent={SWARM_AGENTS.flux}
                cardTag="COST"
                isDark={isDark}
                isPaused={!isSwarmPlaying}
              />
              <FeatureCard feature={costCard} index={3} animate={true} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default HorizontalBentoSection;
