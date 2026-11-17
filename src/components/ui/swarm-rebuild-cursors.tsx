"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Bot, Play, Pause, Sparkles, Zap, Code2 } from "lucide-react";

export interface SwarmWaypoint {
  x: number; // percentage 10 to 85 inside card
  y: number; // percentage 10 to 85 inside card
  action: string;
  codeSnippet?: string;
  dwellTime?: number; // ms to spend at waypoint
}

export interface SwarmAgentProfile {
  id: string;
  name: string;
  role: string;
  avatar: string;
  colorDark: string;
  colorLight: string;
  glowDark: string;
  glowLight: string;
  bgDark: string;
  bgLight: string;
  borderDark: string;
  borderLight: string;
  badgeAlign?: "left" | "right"; // "left" flips badge to left of cursor to prevent screen overflow
  waypoints: SwarmWaypoint[];
}

// 4 Distinct Autonomous Agents mapped to their respective cards
export const SWARM_AGENTS: Record<string, SwarmAgentProfile> = {
  // Assigned to Column 0 Intro Card
  atlas: {
    id: "atlas",
    name: "Atlas",
    role: "System Architect",
    avatar: "✦",
    colorDark: "#10b981", // Emerald
    colorLight: "#059669",
    glowDark: "rgba(16, 185, 129, 0.45)",
    glowLight: "rgba(5, 150, 105, 0.35)",
    bgDark: "rgba(6, 78, 59, 0.88)",
    bgLight: "rgba(209, 250, 229, 0.95)",
    borderDark: "rgba(16, 185, 129, 0.7)",
    borderLight: "rgba(5, 150, 105, 0.5)",
    badgeAlign: "right",
    waypoints: [
      {
        x: 32,
        y: 12,
        action: "Inspecting architecture eyebrow badge",
        codeSnippet: "✓ Category: Platform Core",
      },
      {
        x: 45,
        y: 28,
        action: "Calibrating typography leading & grid rhythm",
        codeSnippet: "+ font-display: var(--bjork-heading);",
      },
      {
        x: 40,
        y: 52,
        action: "Validating editorial column balance",
        codeSnippet: "✓ Layout: 60fps locked",
      },
      {
        x: 50,
        y: 86,
        action: "Binding interactive CTA transition hover state",
        codeSnippet: "+ onHover: triggerHorizontalFlow()",
      },
    ],
  },

  // Assigned to Column 1 Live Traces Card
  nova: {
    id: "nova",
    name: "Nova",
    role: "Neural Synthesizer",
    avatar: "⚡",
    colorDark: "#a855f7", // Electric Violet
    colorLight: "#7c3aed",
    glowDark: "rgba(168, 85, 247, 0.45)",
    glowLight: "rgba(124, 58, 237, 0.35)",
    bgDark: "rgba(88, 28, 135, 0.88)",
    bgLight: "rgba(243, 232, 255, 0.95)",
    borderDark: "rgba(168, 85, 247, 0.7)",
    borderLight: "rgba(124, 58, 237, 0.5)",
    badgeAlign: "right",
    waypoints: [
      {
        x: 28,
        y: 18,
        action: "Locking 60 FPS frame budget on render tree",
        codeSnippet: "✓ Frame budget: 14.2ms (< 16ms)",
      },
      {
        x: 68,
        y: 52,
        action: "Synthesizing slow-span heat trace highlight",
        codeSnippet: "+ color: #f43f5e; // slow: issue_refund",
      },
      {
        x: 75,
        y: 20,
        action: "Aligning timeline span markers (0s - 10s)",
        codeSnippet: "+ <WaterfallSpan name='read_request' />",
      },
      {
        x: 35,
        y: 78,
        action: "Constructing OpenTelemetry v2.4 span DAG",
        codeSnippet: "✓ Traces timeline synchronized",
      },
    ],
  },

  // Assigned to Column 1 Replay Card & Column 2 Alerts Card
  cipher: {
    id: "cipher",
    name: "Cipher",
    role: "Enclave Guard",
    avatar: "⚙",
    colorDark: "#06b6d4", // Electric Cyan
    colorLight: "#0284c7",
    glowDark: "rgba(6, 182, 212, 0.45)",
    glowLight: "rgba(2, 132, 199, 0.35)",
    bgDark: "rgba(21, 94, 117, 0.88)",
    bgLight: "rgba(224, 242, 254, 0.95)",
    borderDark: "rgba(6, 182, 212, 0.7)",
    borderLight: "rgba(2, 132, 199, 0.5)",
    badgeAlign: "right",
    waypoints: [
      {
        x: 42,
        y: 52,
        action: "Verifying cryptographic replay delta seek",
        codeSnippet: "✓ Delta seek time: 3.1ms",
      },
      {
        x: 72,
        y: 48,
        action: "Encrypting replay telemetry snapshots",
        codeSnippet: "✓ AES-GCM-256 state sealed",
      },
      {
        x: 28,
        y: 50,
        action: "Auditing step jump keybindings (J, K, R)",
        codeSnippet: "+ bindKey: CMD+K / J / R",
      },
    ],
  },

  // Assigned to Column 2 Cost Histogram Card
  flux: {
    id: "flux",
    name: "Flux",
    role: "Runtime Optimizer",
    avatar: "◈",
    colorDark: "#f59e0b", // Solar Amber
    colorLight: "#d97706",
    glowDark: "rgba(245, 158, 11, 0.45)",
    glowLight: "rgba(217, 119, 6, 0.35)",
    bgDark: "rgba(120, 53, 15, 0.88)",
    bgLight: "rgba(254, 243, 199, 0.95)",
    borderDark: "rgba(245, 158, 11, 0.7)",
    borderLight: "rgba(217, 119, 6, 0.5)",
    badgeAlign: "left", // Flip to left of cursor so it never clips off-screen right
    waypoints: [
      {
        x: 35,
        y: 35,
        action: "Recalibrating token cost curve & median spend",
        codeSnippet: "+ costPerToken: 0.000004c",
      },
      {
        x: 62,
        y: 65,
        action: "Compiling vector assembly bundle: -32% size",
        codeSnippet: "+ gzip chunk: 14.2 kB",
      },
      {
        x: 75,
        y: 45,
        action: "Applying reactive glassmorphism & drop shadow",
        codeSnippet: "+ backdrop-filter: blur(16px);",
      },
      {
        x: 25,
        y: 72,
        action: "Executing instant hot-module replacement (HMR)",
        codeSnippet: "✓ HMR patch accepted in 8ms",
      },
    ],
  },
};

/**
 * Self-contained Swarm Card Frame & Cursor Agent
 * Placed directly inside each relative card container.
 * Guaranteed 100% boundary alignment with ZERO coordinate drift!
 */
export interface SwarmCardAgentProps {
  agent: SwarmAgentProfile;
  cardTag: string; // e.g. "INTRO", "TRACES", "REPLAY", "ALERTS", "COST"
  isDark?: boolean;
  isPaused?: boolean;
  className?: string;
}

export function SwarmCardAgent({
  agent,
  cardTag,
  isDark = true,
  isPaused = false,
  className,
}: SwarmCardAgentProps) {
  const [waypointIdx, setWaypointIdx] = useState<number>(0);
  const [currentPos, setCurrentPos] = useState<{ x: number; y: number }>(() => {
    const wp = agent.waypoints[0] || { x: 30, y: 30 };
    return { x: wp.x, y: wp.y };
  });
  const [isDwelling, setIsDwelling] = useState<boolean>(true);
  const [dwellProgress, setDwellProgress] = useState<number>(20);
  const [rippleId, setRippleId] = useState<number | null>(null);

  const currentWp = agent.waypoints[waypointIdx] || agent.waypoints[0];
  const color = isDark ? agent.colorDark : agent.colorLight;
  const bg = isDark ? agent.bgDark : agent.bgLight;
  const border = isDark ? agent.borderDark : agent.borderLight;
  const glow = isDark ? agent.glowDark : agent.glowLight;

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      if (isDwelling) {
        setDwellProgress((prev) => {
          if (prev >= 100) {
            // Move to next waypoint
            setIsDwelling(false);
            const nextIdx = (waypointIdx + 1) % agent.waypoints.length;
            setWaypointIdx(nextIdx);
            const target = agent.waypoints[nextIdx];
            setCurrentPos({ x: target.x, y: target.y });
            return 0;
          }
          return prev + 18;
        });
      } else {
        // Arrived at new waypoint
        setIsDwelling(true);
        setDwellProgress(10);
        setRippleId(Date.now());
      }
    }, 450);

    return () => clearInterval(interval);
  }, [isPaused, isDwelling, waypointIdx, agent.waypoints]);

  const isLeftAligned = agent.badgeAlign === "left";

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 z-30 select-none overflow-visible rounded-[26px]",
        className
      )}
    >
      {/* 1. Physically Locked Wireframe Box (Absolute Inset-0: 100% aligned with card) */}
      <div
        className="absolute inset-0 rounded-[26px] border border-dashed transition-all duration-300"
        style={{
          borderColor: color,
          opacity: isDwelling ? 0.65 : 0.35,
          boxShadow: isDwelling ? `inset 0 0 24px -6px ${glow}` : "none",
        }}
      />

      {/* 2. Four Technical Corner Brackets */}
      <div
        className="absolute left-2.5 top-2.5 size-3.5 border-l-2 border-t-2 transition-colors duration-200"
        style={{ borderColor: color }}
      />
      <div
        className="absolute right-2.5 top-2.5 size-3.5 border-r-2 border-t-2 transition-colors duration-200"
        style={{ borderColor: color }}
      />
      <div
        className="absolute left-2.5 bottom-2.5 size-3.5 border-l-2 border-b-2 transition-colors duration-200"
        style={{ borderColor: color }}
      />
      <div
        className="absolute right-2.5 bottom-2.5 size-3.5 border-r-2 border-b-2 transition-colors duration-200"
        style={{ borderColor: color }}
      />

      {/* 3. Sweeping Laser Scanline (Constrained to Card Bounds) */}
      <div className="absolute inset-0 overflow-hidden rounded-[26px] pointer-events-none">
        <div
          className="swarm-laser-bar absolute inset-x-0 h-[2px] transition-all"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${color} 50%, transparent 100%)`,
            boxShadow: `0 0 12px ${glow}`,
          }}
        />
      </div>

      {/* 4. Top Technical Inspector Badge */}
      <div
        className="absolute -top-3 left-6 flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider backdrop-blur-md border shadow-sm transition-all"
        style={{
          backgroundColor: isDark ? "rgba(15, 23, 42, 0.92)" : "rgba(255, 255, 255, 0.95)",
          color: color,
          borderColor: color,
          boxShadow: `0 2px 8px -2px ${glow}`,
        }}
      >
        <span>{agent.avatar}</span>
        <span>{cardTag}</span>
        <span className="opacity-60">• {agent.name.toUpperCase()}</span>
      </div>

      {/* 5. Smooth Cursor & Action Badge */}
      <div
        className="absolute will-change-transform transition-all duration-500 ease-out"
        style={{
          left: `${currentPos.x}%`,
          top: `${currentPos.y}%`,
          transform: "translate3d(-4px, -4px, 0)",
        }}
      >
        {/* Click Ripple Wave */}
        {rippleId && (
          <div
            key={rippleId}
            className="swarm-pulse-ring absolute -left-4 -top-4 size-8 rounded-full border-2"
            style={{
              borderColor: color,
              boxShadow: `0 0 16px ${glow}`,
            }}
          />
        )}

        {/* SVG Cursor Pointer */}
        <div
          className="relative transition-transform duration-200"
          style={{
            transform: isDwelling ? "scale(0.95) rotate(-6deg)" : "scale(1) rotate(-14deg)",
          }}
        >
          <svg
            width="22"
            height="26"
            viewBox="0 0 24 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
          >
            <path
              d="M3 2L20 13.5L12 16L9.5 24.5L3 2Z"
              fill={color}
              stroke={isDark ? "#0f172a" : "#ffffff"}
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <circle cx="5" cy="5" r="1.5" fill="#ffffff" />
          </svg>
        </div>

        {/* Attached Agent Badge */}
        <div
          className={cn(
            "absolute top-4 flex flex-col gap-1 rounded-xl px-2.5 py-1.5 backdrop-blur-md shadow-xl border transition-all duration-300",
            isLeftAligned ? "right-3" : "left-4",
            isDark ? "text-slate-100" : "text-slate-900"
          )}
          style={{
            backgroundColor: bg,
            borderColor: border,
            boxShadow: `0 8px 24px -4px ${glow}`,
            minWidth: "160px",
            maxWidth: "230px",
          }}
        >
          {/* Agent Header Line */}
          <div className="flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-1 font-mono text-[10px] font-bold tracking-tight">
              <span
                className="inline-flex size-3.5 items-center justify-center rounded-full text-[9px] text-white"
                style={{ backgroundColor: color }}
              >
                {agent.avatar}
              </span>
              <span style={{ color }}>{agent.name}</span>
              <span className="opacity-60 text-[9px]">({agent.role})</span>
            </div>
            {isDwelling && (
              <span className="relative flex size-2">
                <span
                  className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                  style={{ backgroundColor: color }}
                />
                <span
                  className="relative inline-flex size-2 rounded-full"
                  style={{ backgroundColor: color }}
                />
              </span>
            )}
          </div>

          {/* Live Action Readout */}
          <p className="font-mono text-[9px] leading-tight opacity-90 truncate">
            {currentWp.action}
          </p>

          {/* Dwell Progress Meter */}
          {isDwelling && (
            <div
              className={cn(
                "h-0.5 w-full overflow-hidden rounded-full mt-0.5",
                isDark ? "bg-black/40" : "bg-black/10"
              )}
            >
              <div
                className="h-full transition-all duration-200"
                style={{
                  width: `${dwellProgress}%`,
                  backgroundColor: color,
                }}
              />
            </div>
          )}
        </div>

        {/* Floating Code Snippet Tag */}
        {currentWp.codeSnippet && isDwelling && (
          <div
            className={cn(
              "swarm-code-snippet absolute -top-8 flex items-center gap-1.5 rounded-md px-2 py-0.5 font-mono text-[9px] font-medium shadow-md border backdrop-blur-md whitespace-nowrap",
              isLeftAligned ? "right-2" : "left-2"
            )}
            style={{
              backgroundColor: isDark ? "rgba(15, 23, 42, 0.94)" : "rgba(255, 255, 255, 0.96)",
              color: color,
              borderColor: border,
              boxShadow: `0 4px 12px ${glow}`,
            }}
          >
            <Code2 className="size-2.5 shrink-0 opacity-70" />
            <span>{currentWp.codeSnippet}</span>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Section 3 Swarm Controller HUD
 * Positioned cleanly with safe clearance from the top edge so it is NEVER clipped!
 */
export interface SwarmHUDProps {
  isDark?: boolean;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSurge: () => void;
  mutationCount: number;
}

export function SwarmHUD({
  isDark = true,
  isPlaying,
  onTogglePlay,
  onSurge,
  mutationCount,
}: SwarmHUDProps) {
  return (
    <>
      <style>{`
        @keyframes swarmClickPulse {
          0% { transform: scale(0.3); opacity: 0.95; }
          60% { opacity: 0.55; }
          100% { transform: scale(2.8); opacity: 0; }
        }
        @keyframes swarmLaserScan {
          0% { transform: translateY(-100%); opacity: 0; }
          20% { opacity: 0.85; }
          80% { opacity: 0.85; }
          100% { transform: translateY(240%); opacity: 0; }
        }
        @keyframes swarmCodeFadeIn {
          0% { transform: translateY(6px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .swarm-pulse-ring {
          animation: swarmClickPulse 1.2s cubic-bezier(0, 0.4, 0.8, 1) forwards;
        }
        .swarm-laser-bar {
          animation: swarmLaserScan 2.8s ease-in-out infinite;
        }
        .swarm-code-snippet {
          animation: swarmCodeFadeIn 0.3s ease-out forwards;
        }
      `}</style>

      {/* Native In-Card Swarm Controller HUD */}
      <div
        className={cn(
          "pointer-events-auto flex items-center gap-2 rounded-full border px-2.5 py-1 backdrop-blur-md shadow-sm transition-all duration-300",
          isDark
            ? "border-emerald-500/20 bg-[#161d19]/85 text-emerald-300"
            : "border-emerald-700/20 bg-white/90 text-emerald-900"
        )}
      >
        {/* Pulsing Status Beacon */}
        <div className="flex items-center gap-2">
          <span className="relative flex size-2.5">
            {isPlaying && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            )}
            <span
              className={cn(
                "relative inline-flex size-2.5 rounded-full",
                isPlaying ? "bg-emerald-500" : "bg-amber-500"
              )}
            />
          </span>
          <span className="font-mono text-[11px] font-semibold tracking-wide uppercase flex items-center gap-1">
            <Bot className="size-3.5 text-emerald-500" />
            Swarm Rebuild
          </span>
        </div>

        {/* Vertical divider */}
        <div
          className={cn(
            "h-3 w-px",
            isDark ? "bg-emerald-500/20" : "bg-emerald-700/20"
          )}
        />

        {/* Live Metrics Ticker */}
        <div className="hidden sm:flex items-center gap-2 font-mono text-[10px] opacity-80">
          <span>4 Agents</span>
          <span>•</span>
          <span className="flex items-center gap-0.5">
            <Zap className="size-2.5 text-amber-400" />
            {mutationCount} patches
          </span>
        </div>

        {/* Surge Rebuild Trigger Button */}
        <button
          type="button"
          onClick={onSurge}
          title="Trigger instantaneous synchronized swarm rebuild surge"
          className={cn(
            "flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] font-medium transition-all hover:scale-105 active:scale-95",
            isDark
              ? "bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30"
              : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300/60"
          )}
        >
          <Sparkles className="size-3 text-emerald-400 animate-pulse" />
          <span>Surge</span>
        </button>

        {/* Pause/Play Toggle Button */}
        <button
          type="button"
          onClick={onTogglePlay}
          title={isPlaying ? "Pause Swarm Simulation" : "Resume Swarm Simulation"}
          className={cn(
            "flex size-6 items-center justify-center rounded-full transition-all hover:scale-105 active:scale-95",
            isDark
              ? "bg-white/10 text-white/80 hover:bg-white/20"
              : "bg-black/5 text-black/80 hover:bg-black/10"
          )}
        >
          {isPlaying ? <Pause className="size-3" /> : <Play className="size-3 fill-current ml-0.5" />}
        </button>
      </div>
    </>
  );
}

export default SwarmCardAgent;
