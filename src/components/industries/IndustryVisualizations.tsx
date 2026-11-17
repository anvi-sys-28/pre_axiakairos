import React from "react";
import { motion } from "framer-motion";

export const IsoThemeContext = React.createContext<{ isDark: boolean }>({ isDark: true });

// Helper for drawing an isometric 3D box at center (x, y) with width (w), length (l), and height (h)
export function IsoBox({
  x,
  y,
  w = 60,
  l = 60,
  h = 30,
  topFill,
  leftFill,
  rightFill,
  stroke,
  strokeWidth = 1.3,
  className = "",
}: {
  x: number;
  y: number;
  w?: number;
  l?: number;
  h?: number;
  topFill?: string;
  leftFill?: string;
  rightFill?: string;
  stroke?: string;
  strokeWidth?: number;
  className?: string;
}) {
  const { isDark } = React.useContext(IsoThemeContext);

  // Resolve theme-aware colors:
  // In light mode, replace dark architectural slate fills with crisp architectural white/light-grey
  const isDefaultDarkFill = !topFill || topFill === "#222734" || topFill === "#1a1e28" || topFill === "#181a20" || topFill === "#181b24" || topFill === "#12141a";
  const resolvedTop = !isDark && isDefaultDarkFill ? "#ffffff" : (topFill || (isDark ? "#222734" : "#ffffff"));
  const resolvedLeft = !isDark && isDefaultDarkFill ? "#f4f3ef" : (leftFill || (isDark ? "#181b24" : "#f4f3ef"));
  const resolvedRight = !isDark && isDefaultDarkFill ? "#e5e2d9" : (rightFill || (isDark ? "#12141a" : "#e5e2d9"));

  let resolvedStroke = stroke;
  if (!isDark) {
    if (stroke === "#2ff59b") {
      resolvedStroke = "#0c7075";
    } else if (stroke === "#384358" || stroke === "#3b4458" || stroke === "#272d3b" || stroke === "#30384a" || !stroke) {
      resolvedStroke = "#94a3b8";
    }
  } else {
    if (!resolvedStroke) resolvedStroke = "#384358";
  }

  const wx = w * 0.866;
  const wy = w * 0.5;
  const lx = l * 0.866;
  const ly = l * 0.5;

  const topPath = `M ${x} ${y - h} L ${x + wx} ${y - h + wy} L ${x + wx - lx} ${y - h + wy + ly} L ${x - lx} ${y - h + ly} Z`;
  const leftPath = `M ${x - lx} ${y - h + ly} L ${x + wx - lx} ${y - h + wy + ly} L ${x + wx - lx} ${y + wy + ly} L ${x - lx} ${y + ly} Z`;
  const rightPath = `M ${x + wx - lx} ${y - h + wy + ly} L ${x + wx} ${y - h + wy} L ${x + wx} ${y + wy} L ${x + wx - lx} ${y + wy + ly} Z`;

  return (
    <g className={className}>
      <path d={leftPath} fill={resolvedLeft} stroke={resolvedStroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
      <path d={rightPath} fill={resolvedRight} stroke={resolvedStroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
      <path d={topPath} fill={resolvedTop} stroke={resolvedStroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
    </g>
  );
}

// Master Isometric Platform Base shared across scenes, following Anatomy plate standards
export function MasterPlatform() {
  const { isDark } = React.useContext(IsoThemeContext);
  const accentMajor = isDark ? "rgba(47,245,155,0.7)" : "#0c7075";
  const accentMinor = isDark ? "rgba(255,255,255,0.22)" : "rgba(100,116,139,0.35)";
  const gridLine = isDark ? "rgba(47, 245, 155, 0.2)" : "rgba(12, 112, 117, 0.25)";

  return (
    <g id="master-platform">
      {/* Soft Ambient Ground Shadow */}
      <ellipse
        cx="360"
        cy="340"
        rx="280"
        ry="120"
        fill={isDark ? "rgba(0,0,0,0.7)" : "rgba(15,23,42,0.08)"}
      />

      {/* Lower Platform Tier */}
      <path
        d="M 360 210 L 590 320 L 360 430 L 130 320 Z"
        fill={isDark ? "#151820" : "#ffffff"}
        stroke={isDark ? "#272d3b" : "#cbd5e1"}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M 130 320 L 360 430 L 360 448 L 130 338 Z"
        fill={isDark ? "#0f1116" : "#f1f5f9"}
        stroke={isDark ? "#272d3b" : "#cbd5e1"}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M 360 430 L 590 320 L 590 338 L 360 448 Z"
        fill={isDark ? "#0a0c10" : "#e2e8f0"}
        stroke={isDark ? "#272d3b" : "#94a3b8"}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />

      {/* Upper Stepped Podium */}
      <path
        d="M 360 218 L 565 316 L 360 414 L 155 316 Z"
        fill={isDark ? "#1a1e28" : "#ffffff"}
        stroke={isDark ? "#30384a" : "#94a3b8"}
        strokeWidth="1.3"
        strokeLinejoin="round"
      />

      {/* Precision Ruler Ticks along the front platform edge (Anatomy Craft) */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => {
        const t = i / 12;
        const x1 = 155 + (360 - 155) * t;
        const y1 = 316 + (414 - 316) * t;
        const isMajor = i % 3 === 0;
        return (
          <line
            key={`tick-l-${i}`}
            x1={x1}
            y1={y1}
            x2={x1 + 3}
            y2={y1 - (isMajor ? 6 : 3.5)}
            stroke={isMajor ? accentMajor : accentMinor}
            strokeWidth={isMajor ? "1.2" : "0.8"}
          />
        );
      })}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => {
        const t = i / 12;
        const x1 = 360 + (565 - 360) * t;
        const y1 = 414 + (316 - 414) * t;
        const isMajor = i % 3 === 0;
        return (
          <line
            key={`tick-r-${i}`}
            x1={x1}
            y1={y1}
            x2={x1 - 3}
            y2={y1 - (isMajor ? 6 : 3.5)}
            stroke={isMajor ? accentMajor : accentMinor}
            strokeWidth={isMajor ? "1.2" : "0.8"}
          />
        );
      })}

      {/* Platform Corner Hex Screws (Anatomy instrument aesthetic) */}
      <circle cx="165" cy="316" r="2" fill={isDark ? "#0d0f14" : "#f1f5f9"} stroke={isDark ? "#4b5563" : "#94a3b8"} strokeWidth="0.8" />
      <circle cx="360" cy="406" r="2" fill={isDark ? "#0d0f14" : "#f1f5f9"} stroke={isDark ? "#4b5563" : "#94a3b8"} strokeWidth="0.8" />
      <circle cx="555" cy="316" r="2" fill={isDark ? "#0d0f14" : "#f1f5f9"} stroke={isDark ? "#4b5563" : "#94a3b8"} strokeWidth="0.8" />
      <circle cx="360" cy="226" r="2" fill={isDark ? "#0d0f14" : "#f1f5f9"} stroke={isDark ? "#4b5563" : "#94a3b8"} strokeWidth="0.8" />

      {/* Subtle Technical Grid Lines on Platform */}
      <path
        d="M 257 267 L 462 365 M 462 267 L 257 365"
        stroke={gridLine}
        strokeWidth="1"
        strokeDasharray="4 4"
      />
    </g>
  );
}

// Floating Satellite Mini-Platform with Icon
export function SatellitePlatform({
  x,
  y,
  icon,
}: {
  x: number;
  y: number;
  icon: React.ReactNode;
}) {
  const { isDark } = React.useContext(IsoThemeContext);
  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx="0" cy="22" rx="42" ry="18" fill={isDark ? "rgba(0,0,0,0.5)" : "rgba(15,23,42,0.06)"} />
      <path
        d="M 0 -18 L 36 0 L 0 18 L -36 0 Z"
        fill={isDark ? "#1f2430" : "#ffffff"}
        stroke={isDark ? "#333d4e" : "#cbd5e1"}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M -36 0 L 0 18 L 0 25 L -36 7 Z"
        fill={isDark ? "#141720" : "#f1f5f9"}
        stroke={isDark ? "#333d4e" : "#cbd5e1"}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M 0 18 L 36 0 L 36 7 L 0 25 Z"
        fill={isDark ? "#0e1017" : "#e2e8f0"}
        stroke={isDark ? "#333d4e" : "#cbd5e1"}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <g transform="translate(0, -2)">{icon}</g>
    </g>
  );
}

// Subsystem interactive wrapper with hover highlight, vernier crosshair & telemetry callout
export function SubsystemGroup({
  id,
  active,
  onHover,
  label,
  calloutX,
  calloutY,
  children,
}: {
  id: string;
  active: boolean;
  onHover?: (id: string | null) => void;
  label?: string;
  calloutX?: number;
  calloutY?: number;
  children: React.ReactNode;
}) {
  const { isDark } = React.useContext(IsoThemeContext);
  const accent = isDark ? "#2ff59b" : "#0c7075";
  const calloutBg = isDark ? "#0f1412" : "#ffffff";
  const calloutStroke = isDark ? "#2ff59b" : "#0c7075";
  const calloutText = isDark ? "#2ff59b" : "#0c7075";

  return (
    <g
      data-subsystem={id}
      className="cursor-pointer transition-all duration-200"
      onMouseEnter={() => onHover?.(id)}
      onMouseLeave={() => onHover?.(null)}
      style={{
        filter: active ? (isDark ? "url(#emeraldGlow) brightness(1.28)" : "url(#emeraldGlow) drop-shadow(0 2px 8px rgba(12,112,117,0.35))") : undefined,
      }}
    >
      {children}
      {/* Anatomy Vernier Callout when active */}
      {active && calloutX !== undefined && calloutY !== undefined && label && (
        <g className="pointer-events-none" opacity="0.95">
          <circle cx={calloutX} cy={calloutY} r="3.5" fill={accent} stroke="#ffffff" strokeWidth="1" />
          <line
            x1={calloutX}
            y1={calloutY}
            x2={calloutX > 360 ? calloutX + 32 : calloutX - 32}
            y2={calloutY - 22}
            stroke={accent}
            strokeWidth="1.2"
            strokeDasharray="2 2"
          />
          <rect
            x={calloutX > 360 ? calloutX + 32 : calloutX - 146}
            y={calloutY - 33}
            width="114"
            height="19"
            rx="2"
            fill={calloutBg}
            stroke={calloutStroke}
            strokeWidth="1"
          />
          <text
            x={calloutX > 360 ? calloutX + 38 : calloutX - 140}
            y={calloutY - 20}
            fill={calloutText}
            fontFamily="ui-monospace, monospace"
            fontSize="9"
            fontWeight="bold"
            letterSpacing="0.05em"
          >
            ✛ {label}
          </text>
        </g>
      )}
    </g>
  );
}

// Isometric Dial Indicator (Anatomy dial-indicator standard)
export function IsoDial({
  cx,
  cy,
  r = 18,
  angle = 38,
  label,
  active = false,
}: {
  cx: number;
  cy: number;
  r?: number;
  angle?: number;
  label?: string;
  active?: boolean;
}) {
  const { isDark } = React.useContext(IsoThemeContext);
  const accent = isDark ? "#2ff59b" : "#0c7075";
  const ry = r * 0.58;
  const rad = (angle * Math.PI) / 180;
  const nx = cx + Math.cos(rad) * (r * 0.72);
  const ny = cy + Math.sin(rad) * (ry * 0.72);

  return (
    <g>
      <ellipse cx={cx} cy={cy + 3} rx={r + 3} ry={ry + 2} fill={isDark ? "#0d0f14" : "#f1f5f9"} stroke={isDark ? "#252b38" : "#cbd5e1"} strokeWidth="1.2" />
      <ellipse cx={cx} cy={cy} rx={r + 2} ry={ry + 1.2} fill={isDark ? "#181c25" : "#ffffff"} stroke={isDark ? "#333d52" : "#94a3b8"} strokeWidth="1.2" />
      <ellipse cx={cx} cy={cy} rx={r} ry={ry} fill={isDark ? "#101319" : "#f8fafc"} stroke={active ? accent : (isDark ? "#384358" : "#cbd5e1")} strokeWidth="1.2" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
        const dRad = (deg * Math.PI) / 180;
        const x1 = cx + Math.cos(dRad) * (r * 0.78);
        const y1 = cy + Math.sin(dRad) * (ry * 0.78);
        const x2 = cx + Math.cos(dRad) * (r * 0.94);
        const y2 = cy + Math.sin(dRad) * (ry * 0.94);
        return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke={active ? accent : (isDark ? "rgba(255,255,255,0.4)" : "#94a3b8")} strokeWidth="0.9" />;
      })}
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={active ? (isDark ? "#ffffff" : "#0c7075") : accent} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="2.5" fill={accent} />
      {label && (
        <text x={cx} y={cy + ry * 0.65} fill={active ? accent : (isDark ? "#71717a" : "#64748b")} fontSize="6.5" fontFamily="monospace" textAnchor="middle">
          {label}
        </text>
      )}
    </g>
  );
}

// Wire harness with animated pulse flow (Anatomy craft)
export function WireHarness({
  points,
  active = false,
}: {
  points: Array<[number, number]>;
  active?: boolean;
}) {
  if (points.length < 2) return null;
  const { isDark } = React.useContext(IsoThemeContext);
  const d = points.reduce((acc, pt, i) => `${acc} ${i === 0 ? "M" : "L"} ${pt[0]} ${pt[1]}`, "");
  const start = points[0];
  const end = points[points.length - 1];

  const primaryAccent = isDark ? "#2ff59b" : "#0c7075";
  const inactiveHarness = isDark ? "#2b3446" : "#cbd5e1";
  const underShadow = isDark ? "#0a0c10" : "rgba(15,23,42,0.1)";
  const pingAccent = isDark ? (active ? "#ffffff" : "#2ff59b") : (active ? "#0c7075" : "#10b981");

  return (
    <g>
      <path d={d} fill="none" stroke={underShadow} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={active ? primaryAccent : inactiveHarness} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={pingAccent} strokeWidth="1.2" strokeDasharray="3 5" className="iso-flow-line" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={start[0]} cy={start[1]} r="2.5" fill={isDark ? "#141414" : "#ffffff"} stroke={primaryAccent} strokeWidth="1.2" />
      <circle cx={end[0]} cy={end[1]} r="2.5" fill={isDark ? "#141414" : "#ffffff"} stroke={primaryAccent} strokeWidth="1.2" />
    </g>
  );
}

export interface IllustrationProps {
  hoveredSubsystem?: string | null;
  onHoverSubsystem?: (id: string | null) => void;
}

// =========================================================================
// 01: Automotive & Manufacturing Visualization
// =========================================================================
export function AutomotiveIllustration({ hoveredSubsystem, onHoverSubsystem }: IllustrationProps) {
  return (
    <g>
      <MasterPlatform />

      {/* Wire Harness Routing */}
      <WireHarness points={[[230, 190], [160, 220], [160, 240]]} active={hoveredSubsystem === "factory-core"} />
      <WireHarness points={[[490, 190], [560, 220], [560, 240]]} active={hoveredSubsystem === "robot-arm"} />
      <WireHarness points={[[160, 380], [220, 410]]} active={hoveredSubsystem === "conveyor"} />
      <WireHarness points={[[560, 380], [500, 410]]} active={hoveredSubsystem === "laser-scanner"} />

      {/* Satellite Platforms */}
      <SatellitePlatform x={160} y={235} icon={<path d="M -12 2 C -12 -3 -8 -6 -3 -6 L 3 -6 C 8 -6 12 -3 12 2 L 12 6 L -12 6 Z M -8 7 A 2 2 0 1 0 -8 11 M 8 7 A 2 2 0 1 0 8 11" fill="none" stroke="#2ff59b" strokeWidth="1.4" strokeLinejoin="round" />} />
      <SatellitePlatform x={560} y={235} icon={<path d="M -10 6 L -10 -2 L -5 1 L -5 -4 L 0 -1 L 0 -8 L 8 -8 L 8 6 Z" fill="none" stroke="#2ff59b" strokeWidth="1.4" strokeLinejoin="round" />} />
      <SatellitePlatform x={210} y={405} icon={<circle cx="0" cy="0" r="4" fill="none" stroke="#2ff59b" strokeWidth="1.4" />} />
      <SatellitePlatform x={510} y={405} icon={<path d="M -6 -4 L 0 -7 L 6 -4 L 0 -1 Z M -6 -4 L -6 2 L 0 5 L 0 -1 Z M 0 -1 L 0 5 L 6 2 L 6 -4 Z" fill="none" stroke="#2ff59b" strokeWidth="1.3" />} />

      {/* Subsystem 1: Factory Core & Telemetry Stack */}
      <SubsystemGroup id="factory-core" active={hoveredSubsystem === "factory-core"} onHover={onHoverSubsystem} label="PLANT CORE" calloutX={330} calloutY={180}>
        <IsoBox x={330} y={235} w={125} l={75} h={68} topFill="#222734" leftFill="#181b24" rightFill="#12141a" stroke={hoveredSubsystem === "factory-core" ? "#2ff59b" : "#384358"} />
        <path d="M 270 170 L 290 155 L 290 170 L 320 155 L 320 170 L 350 155 L 350 175" fill="#f4f4f5" stroke="#3b4458" strokeWidth="1.3" />
        <g transform="translate(420, 160)">
          <path d="M -7 0 L -7 -55 L 7 -55 L 7 0 Z" fill="#e4e4e7" stroke="#3b4458" strokeWidth="1.3" />
          <ellipse cx="0" cy="-55" rx="7" ry="2.5" fill="#a1a1aa" stroke="#3b4458" strokeWidth="1.3" />
          <rect x="-6.5" y="-45" width="13" height="6" fill="#2ff59b" />
        </g>
        <text x="395" y="238" fontFamily="sans-serif" fontSize="16" fontWeight="800" letterSpacing="1" fill="#FFFFFF">SAP</text>
        <rect x="385" y="248" width="28" height="30" fill="#181a20" stroke="#3b4458" strokeWidth="1.2" />
        <line x1="385" y1="256" x2="413" y2="256" stroke="#444444" strokeWidth="1" />
        <line x1="385" y1="264" x2="413" y2="264" stroke="#444444" strokeWidth="1" />
        <line x1="385" y1="272" x2="413" y2="272" stroke="#444444" strokeWidth="1" />
        <rect x="305" y="220" width="14" height="10" fill="#2ff59b" opacity="0.8" />
        <rect x="325" y="220" width="14" height="10" fill="#2ff59b" opacity="0.8" />
        <rect x="345" y="220" width="14" height="10" fill="#2ff59b" opacity="0.8" />
      </SubsystemGroup>

      {/* Subsystem 2: Conveyor Transport Deck */}
      <SubsystemGroup id="conveyor" active={hoveredSubsystem === "conveyor"} onHover={onHoverSubsystem} label="CONVEYOR DECK" calloutX={365} calloutY={320}>
        <g transform="translate(365, 310)">
          <path d="M -60 -10 L 40 40 L 40 48 L -60 -2 Z" fill="#2d3340" stroke="#3b4458" strokeWidth="1.2" />
          <path d="M -60 -10 L 0 -40 L 100 10 L 40 40 Z" fill="#1b1f28" stroke="#3b4458" strokeWidth="1.3" />
          {[-30, -10, 10, 30, 50, 70].map((rx, idx) => (
            <line key={idx} x1={rx - 15} y1={(rx * 0.5) - 2} x2={rx + 15} y2={(rx * 0.5) + 12} stroke={hoveredSubsystem === "conveyor" ? "#2ff59b" : "#4b5563"} strokeWidth="1.5" />
          ))}
          <g transform="translate(18, -12)">
            <path d="M -26 -6 L 0 -19 L 26 -6 L 0 7 Z" fill="#ffffff" stroke="#3b4458" strokeWidth="1.3" />
            <path d="M -26 -6 L 0 -19 L 26 -6 L 26 2 L 0 15 L -26 2 Z" fill="#e4e4e7" stroke="#3b4458" strokeWidth="1.3" />
            <path d="M -16 -10 L 0 -18 L 16 -10 L 0 -2 Z" fill="#18181b" stroke="#3b4458" strokeWidth="1" />
            <circle cx="23" cy="0" r="2" fill="#2ff59b" />
            <circle cx="5" cy="11" r="2" fill="#2ff59b" />
          </g>
        </g>
      </SubsystemGroup>

      {/* Subsystem 3: Robotic Servo Arms */}
      <SubsystemGroup id="robot-arm" active={hoveredSubsystem === "robot-arm"} onHover={onHoverSubsystem} label="6-AXIS ROBOT" calloutX={470} calloutY={290}>
        <g transform="translate(295, 290)">
          <ellipse cx="0" cy="10" rx="14" ry="7" fill="#181a20" stroke="#3b4458" strokeWidth="1.2" />
          <path d="M -4 8 L 18 -25 L 26 -22 L 4 11 Z" fill="#2ff59b" stroke="#3b4458" strokeWidth="1.2" />
          <circle cx="22" cy="-23" r="5" fill="#181a20" stroke="#3b4458" strokeWidth="1.2" />
          <path d="M 22 -23 L 55 -5 L 53 1 L 20 -17 Z" fill="#2ff59b" stroke="#3b4458" strokeWidth="1.2" />
          <circle cx="54" cy="-2" r="4" fill="#181a20" stroke="#3b4458" strokeWidth="1.2" />
          <path d="M 54 -2 L 68 8 M 54 -2 L 72 2" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
        </g>
        <g transform="translate(470, 310)">
          <ellipse cx="0" cy="10" rx="14" ry="7" fill="#181a20" stroke="#3b4458" strokeWidth="1.2" />
          <path d="M 4 8 L -18 -25 L -26 -22 L -4 11 Z" fill="#2ff59b" stroke="#3b4458" strokeWidth="1.2" />
          <circle cx="-22" cy="-23" r="5" fill="#181a20" stroke="#3b4458" strokeWidth="1.2" />
          <path d="M -22 -23 L -48 -8 L -46 -2 L -20 -17 Z" fill="#2ff59b" stroke="#3b4458" strokeWidth="1.2" />
          <circle cx="-47" cy="-5" r="4" fill="#181a20" stroke="#3b4458" strokeWidth="1.2" />
          <line x1="-47" y1="-5" x2="-60" y2="4" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="-61" cy="5" r="2.5" fill="#2ff59b" className="animate-ping" />
        </g>
      </SubsystemGroup>

      {/* Subsystem 4: Profilometer Laser Scanner & Operations Terminal */}
      <SubsystemGroup id="laser-scanner" active={hoveredSubsystem === "laser-scanner"} onHover={onHoverSubsystem} label="PROFILOMETER ARCH" calloutX={515} calloutY={255}>
        <g transform="translate(515, 275)">
          <ellipse cx="0" cy="35" rx="12" ry="6" fill="#181a20" stroke="#3b4458" strokeWidth="1.2" />
          <rect x="-2" y="10" width="4" height="25" fill="#3f3f46" />
          <IsoBox x={-5} y={8} w={32} l={8} h={24} topFill="#222734" leftFill="#181b24" rightFill="#12141a" />
          <rect x="-1" y="-12" width="22" height="15" fill="#09090b" stroke="#2ff59b" strokeWidth="0.8" />
          <rect x="2" y="-4" width="3" height="6" fill="#2ff59b" />
          <rect x="7" y="-8" width="3" height="10" fill="#2ff59b" />
          <rect x="12" y="-11" width="3" height="13" fill="#2ff59b" />
          <rect x="17" y="-6" width="3" height="8" fill="#ffffff" />
        </g>
        {/* Laser scanner arch over conveyor */}
        <g transform="translate(415, 280)">
          <path d="M -15 20 L -15 -25 L 15 -40 L 15 5" fill="none" stroke={hoveredSubsystem === "laser-scanner" ? "#2ff59b" : "#475569"} strokeWidth="2" strokeDasharray="3 3" />
          <line x1="-15" y1="-15" x2="15" y2="0" stroke="#2ff59b" strokeWidth="1.5" className="iso-flow-line" />
        </g>
      </SubsystemGroup>
    </g>
  );
}

// =========================================================================
// 02: Banking & Financial Services Visualization
// =========================================================================
export function BankingIllustration({ hoveredSubsystem, onHoverSubsystem }: IllustrationProps) {
  return (
    <g>
      <MasterPlatform />

      <WireHarness points={[[160, 240], [250, 270], [330, 240]]} active={hoveredSubsystem === "vault-core"} />
      <WireHarness points={[[330, 240], [420, 260], [560, 240]]} active={hoveredSubsystem === "ledger-bus"} />
      <WireHarness points={[[265, 310], [330, 350], [440, 310]]} active={hoveredSubsystem === "fraud-dial"} />

      <SatellitePlatform x={160} y={235} icon={<text x="-6" y="5" fontSize="13" fontWeight="bold" fill="#2ff59b">%</text>} />
      <SatellitePlatform x={560} y={235} icon={<path d="M -7 -4 L 7 -4 L 0 6 Z" fill="#FFFFFF" />} />
      <SatellitePlatform x={210} y={405} icon={<circle cx="0" cy="0" r="5" fill="none" stroke="#2ff59b" strokeWidth="1.4" />} />
      <SatellitePlatform x={510} y={405} icon={<rect x="-5" y="-5" width="10" height="10" fill="none" stroke="#ffffff" strokeWidth="1.2" />} />

      {/* Subsystem 1: Cryptographic HSM Vault Tower */}
      <SubsystemGroup id="vault-core" active={hoveredSubsystem === "vault-core"} onHover={onHoverSubsystem} label="HSM VAULT" calloutX={330} calloutY={190}>
        <IsoBox x={330} y={215} w={85} l={60} h={95} topFill="#222734" leftFill="#181b24" rightFill="#12141a" stroke={hoveredSubsystem === "vault-core" ? "#2ff59b" : "#384358"} />
        <ellipse cx="330" cy="120" rx="36" ry="18" fill="#1b202c" stroke="#2ff59b" strokeWidth="1.5" />
        <circle cx="330" cy="120" r="6" fill="#2ff59b" className="animate-ping" />
        {/* Vault lock dial */}
        <IsoDial cx={310} cy={165} r="14" angle={65} label="KYBER" active={hoveredSubsystem === "vault-core"} />
      </SubsystemGroup>

      {/* Subsystem 2: Atomic Dual-Rail Ledger Bus */}
      <SubsystemGroup id="ledger-bus" active={hoveredSubsystem === "ledger-bus"} onHover={onHoverSubsystem} label="LEDGER RAIL" calloutX={380} calloutY={200}>
        <g transform="translate(370, 175)">
          <rect x="0" y="0" width="14" height="65" fill="#2ff59b" opacity="0.85" rx="2" />
          <line x1="7" y1="0" x2="7" y2="65" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="3 3" className="iso-flow-line" />
        </g>
        <g transform="translate(390, 190)">
          <rect x="0" y="0" width="14" height="65" fill="#ffffff" opacity="0.8" rx="2" />
          <line x1="7" y1="0" x2="7" y2="65" stroke="#2ff59b" strokeWidth="1.5" strokeDasharray="3 3" className="iso-flow-line" />
        </g>
      </SubsystemGroup>

      {/* Subsystem 3: Real-Time Fraud & Anomaly Dial Terminal */}
      <SubsystemGroup id="fraud-dial" active={hoveredSubsystem === "fraud-dial"} onHover={onHoverSubsystem} label="AML DIAL" calloutX={455} calloutY={280}>
        <g transform="translate(440, 290)">
          <IsoBox x={0} y={0} w={36} l={14} h={30} topFill="#181a20" leftFill="#121419" rightFill="#0d0e12" stroke={hoveredSubsystem === "fraud-dial" ? "#2ff59b" : "#3b4458"} />
          <line x1="8" y1="-8" x2="8" y2="2" stroke="#2ff59b" strokeWidth="2" />
          <line x1="16" y1="-14" x2="16" y2="-4" stroke="#2ff59b" strokeWidth="2" />
          <line x1="24" y1="-10" x2="24" y2="6" stroke="#FFFFFF" strokeWidth="2" />
        </g>
        <g transform="translate(485, 270)">
          <IsoDial cx={0} cy={0} r="16" angle={120} label="AML" active={hoveredSubsystem === "fraud-dial"} />
        </g>
      </SubsystemGroup>

      {/* Subsystem 4: Decentralized Settlement Gateway Nodes */}
      <SubsystemGroup id="clearing-nodes" active={hoveredSubsystem === "clearing-nodes"} onHover={onHoverSubsystem} label="SETTLEMENT GATEWAY" calloutX={265} calloutY={310}>
        <g transform="translate(265, 310)">
          <circle cx="-12" cy="-5" r="8" fill="#181c25" stroke={hoveredSubsystem === "clearing-nodes" ? "#2ff59b" : "#3b4458"} strokeWidth="1.5" />
          <circle cx="16" cy="-16" r="8" fill="#181c25" stroke={hoveredSubsystem === "clearing-nodes" ? "#2ff59b" : "#3b4458"} strokeWidth="1.5" />
          <circle cx="12" cy="16" r="8" fill="#181c25" stroke="#2ff59b" strokeWidth="1.8" />
          <line x1="-5" y1="-7" x2="10" y2="-13" stroke="#2ff59b" strokeWidth="1.6" strokeDasharray="3 2" className="iso-flow-line" />
          <line x1="13" y1="-8" x2="11" y2="9" stroke="#2ff59b" strokeWidth="1.6" strokeDasharray="3 2" className="iso-flow-line" />
        </g>
      </SubsystemGroup>
    </g>
  );
}

// =========================================================================
// 03: Aviation & Aerospace Visualization
// =========================================================================
export function AviationIllustration({ hoveredSubsystem, onHoverSubsystem }: IllustrationProps) {
  return (
    <g>
      <MasterPlatform />

      <WireHarness points={[[160, 240], [250, 270], [360, 280]]} active={hoveredSubsystem === "airframe-mount"} />
      <WireHarness points={[[360, 280], [470, 260], [560, 240]]} active={hoveredSubsystem === "radar-dish"} />

      <SatellitePlatform x={160} y={235} icon={<path d="M 0 -8 L 8 4 L 0 2 L -8 4 Z" fill="#2ff59b" />} />
      <SatellitePlatform x={560} y={235} icon={<circle cx="0" cy="0" r="5" fill="none" stroke="#FFFFFF" strokeWidth="1.4" />} />

      {/* Subsystem 1: Wind Tunnel Airframe & Piezo Load Cell */}
      <SubsystemGroup id="airframe-mount" active={hoveredSubsystem === "airframe-mount"} onHover={onHoverSubsystem} label="PIEZO LOAD CELL" calloutX={360} calloutY={230}>
        <g transform="translate(360, 230)">
          <path d="M 0 -45 L 38 18 L 0 7 L -38 18 Z" fill="#222734" stroke={hoveredSubsystem === "airframe-mount" ? "#2ff59b" : "#384358"} strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M 0 -45 L 0 7 L -8 24 L 0 18 L 8 24 Z" fill="#181b24" stroke="#2ff59b" strokeWidth="1.2" />
          <circle cx="0" cy="18" r="3" fill="#2ff59b" className="animate-ping" />
        </g>
        <g transform="translate(360, 285)">
          <IsoBox x={0} y={0} w={30} l={30} h={40} topFill="#1a1e27" leftFill="#12141a" rightFill="#0d0e12" stroke={hoveredSubsystem === "airframe-mount" ? "#2ff59b" : "#384358"} />
          <line x1="-12" y1="-20" x2="-12" y2="10" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
        </g>
      </SubsystemGroup>

      {/* Subsystem 2: Tracking Radar Dish */}
      <SubsystemGroup id="radar-dish" active={hoveredSubsystem === "radar-dish"} onHover={onHoverSubsystem} label="PHASED RADAR" calloutX={470} calloutY={230}>
        <g transform="translate(470, 240)">
          <line x1="0" y1="20" x2="0" y2="0" stroke="#4b5563" strokeWidth="3" />
          <ellipse cx="0" cy="-6" rx="26" ry="14" fill="#1b202c" stroke={hoveredSubsystem === "radar-dish" ? "#2ff59b" : "#384358"} strokeWidth="1.5" />
          <line x1="0" y1="-6" x2="14" y2="-22" stroke="#2ff59b" strokeWidth="2" />
          <circle cx="14" cy="-22" r="3" fill="#2ff59b" className="animate-ping" />
        </g>
      </SubsystemGroup>

      {/* Subsystem 3: Hangar Telemetry Station */}
      <SubsystemGroup id="hangar-telemetry" active={hoveredSubsystem === "hangar-telemetry"} onHover={onHoverSubsystem} label="MRO TELEMETRY" calloutX={250} calloutY={290}>
        <g transform="translate(250, 310)">
          <IsoBox x={0} y={0} w={45} l={30} h={35} topFill="#222734" leftFill="#181b24" rightFill="#12141a" stroke={hoveredSubsystem === "hangar-telemetry" ? "#2ff59b" : "#384358"} />
          <rect x="-8" y="-22" width="22" height="14" fill="#09090b" stroke="#2ff59b" strokeWidth="0.8" />
          <path d="M -6 -15 L -2 -18 L 3 -13 L 8 -20" fill="none" stroke="#2ff59b" strokeWidth="1.2" />
        </g>
      </SubsystemGroup>

      {/* Subsystem 4: Avionics Data Harness */}
      <SubsystemGroup id="avionics-bus" active={hoveredSubsystem === "avionics-bus"} onHover={onHoverSubsystem} label="ARINC 429 BUS" calloutX={360} calloutY={340}>
        <g transform="translate(360, 330)">
          <IsoDial cx={0} cy={10} r="18" angle={210} label="MACH" active={hoveredSubsystem === "avionics-bus"} />
          <circle cx="-35" cy="10" r="5" fill="#181c25" stroke="#2ff59b" strokeWidth="1.3" />
          <circle cx="35" cy="10" r="5" fill="#181c25" stroke="#ffffff" strokeWidth="1.3" />
          <line x1="-30" y1="10" x2="-18" y2="10" stroke="#2ff59b" strokeWidth="1.5" className="iso-flow-line" />
          <line x1="18" y1="10" x2="30" y2="10" stroke="#2ff59b" strokeWidth="1.5" className="iso-flow-line" />
        </g>
      </SubsystemGroup>
    </g>
  );
}

// =========================================================================
// 04: E-Commerce & Retail Visualization
// =========================================================================
export function EcommerceIllustration({ hoveredSubsystem, onHoverSubsystem }: IllustrationProps) {
  return (
    <g>
      <MasterPlatform />

      <WireHarness points={[[160, 240], [260, 280], [360, 270]]} active={hoveredSubsystem === "fulfillment-hub"} />
      <WireHarness points={[[360, 270], [460, 290], [560, 240]]} active={hoveredSubsystem === "sortation-tray"} />

      <SatellitePlatform x={160} y={235} icon={<path d="M -8 -4 L -4 6 L 6 6 L 8 -4 Z" fill="none" stroke="#2ff59b" strokeWidth="1.3" />} />
      <SatellitePlatform x={560} y={235} icon={<path d="M -6 -6 L 6 -6 L 6 6 L -6 6 Z" fill="none" stroke="#FFFFFF" strokeWidth="1.2" />} />

      {/* Subsystem 1: Automated Fulfillment High-Bay Hub */}
      <SubsystemGroup id="fulfillment-hub" active={hoveredSubsystem === "fulfillment-hub"} onHover={onHoverSubsystem} label="HIGH-BAY HUB" calloutX={320} calloutY={200}>
        <IsoBox x={310} y={220} w={95} l={65} h={80} topFill="#222734" leftFill="#181b24" rightFill="#12141a" stroke={hoveredSubsystem === "fulfillment-hub" ? "#2ff59b" : "#384358"} />
        {/* High bay shelves */}
        <line x1="260" y1="180" x2="320" y2="215" stroke="#2ff59b" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="260" y1="195" x2="320" y2="230" stroke="#2ff59b" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="260" y1="210" x2="320" y2="245" stroke="#2ff59b" strokeWidth="1" strokeDasharray="3 3" />
      </SubsystemGroup>

      {/* Subsystem 2: Cross-Belt Sortation Tray Loop */}
      <SubsystemGroup id="sortation-tray" active={hoveredSubsystem === "sortation-tray"} onHover={onHoverSubsystem} label="SORTATION TRAY" calloutX={420} calloutY={270}>
        <g transform="translate(420, 280)">
          <ellipse cx="0" cy="0" rx="42" ry="22" fill="none" stroke={hoveredSubsystem === "sortation-tray" ? "#2ff59b" : "#384358"} strokeWidth="2.5" />
          <ellipse cx="0" cy="0" rx="36" ry="18" fill="none" stroke="#2ff59b" strokeWidth="1.2" strokeDasharray="4 4" className="iso-flow-line" />
          <IsoBox x={-15} y={-5} w={12} l={12} h={10} topFill="#ffffff" leftFill="#e4e4e7" rightFill="#a1a1aa" />
          <IsoBox x={15} y={5} w={12} l={12} h={10} topFill="#2ff59b" leftFill="#10b981" rightFill="#059669" />
        </g>
      </SubsystemGroup>

      {/* Subsystem 3: Optical 3D Volumetric Dimensioner */}
      <SubsystemGroup id="dimensioner" active={hoveredSubsystem === "dimensioner"} onHover={onHoverSubsystem} label="3D DIMENSIONER" calloutX={360} calloutY={315}>
        <g transform="translate(360, 310)">
          <path d="M -25 15 L -25 -20 L 25 -35 L 25 0" fill="none" stroke={hoveredSubsystem === "dimensioner" ? "#2ff59b" : "#475569"} strokeWidth="2" strokeDasharray="2 3" />
          <line x1="-25" y1="-10" x2="25" y2="5" stroke="#2ff59b" strokeWidth="1.5" className="iso-flow-line" />
          <circle cx="0" cy="-2" r="3" fill="#2ff59b" className="animate-ping" />
        </g>
      </SubsystemGroup>

      {/* Subsystem 4: Autonomous AGV Mobile Fleet */}
      <SubsystemGroup id="dispatch-fleet" active={hoveredSubsystem === "dispatch-fleet"} onHover={onHoverSubsystem} label="AGV DISPATCH" calloutX={240} calloutY={350}>
        <g transform="translate(240, 350)">
          <IsoBox x={0} y={0} w={24} l={18} h={12} topFill="#2ff59b" leftFill="#10b981" rightFill="#059669" />
          <IsoBox x={2} y={-14} w={18} l={14} h={14} topFill="#FFFFFF" leftFill="#EDEDEB" rightFill="#DCDCD9" />
          <circle cx="-10" cy="10" r="3" fill="#181a20" />
          <circle cx="8" cy="18" r="3" fill="#181a20" />
        </g>
      </SubsystemGroup>
    </g>
  );
}

// =========================================================================
// 05: Education & Learning Visualization
// =========================================================================
export function EducationIllustration({ hoveredSubsystem, onHoverSubsystem }: IllustrationProps) {
  return (
    <g>
      <MasterPlatform />

      <WireHarness points={[[160, 240], [260, 270], [360, 250]]} active={hoveredSubsystem === "knowledge-core"} />
      <WireHarness points={[[360, 250], [460, 270], [560, 240]]} active={hoveredSubsystem === "memory-matrix"} />

      <SatellitePlatform x={160} y={235} icon={<path d="M 0 -7 L 8 -2 L 0 3 L -8 -2 Z M 0 3 L 0 7" fill="none" stroke="#2ff59b" strokeWidth="1.3" />} />
      <SatellitePlatform x={560} y={235} icon={<circle cx="0" cy="0" r="5" fill="none" stroke="#FFFFFF" strokeWidth="1.3" />} />

      {/* Subsystem 1: Hierarchical Knowledge Concept Spire */}
      <SubsystemGroup id="knowledge-core" active={hoveredSubsystem === "knowledge-core"} onHover={onHoverSubsystem} label="KNOWLEDGE TOWER" calloutX={360} calloutY={180}>
        <IsoBox x={360} y={210} w={65} l={65} h={105} topFill="#222734" leftFill="#181b24" rightFill="#12141a" stroke={hoveredSubsystem === "knowledge-core" ? "#2ff59b" : "#384358"} />
        <ellipse cx="360" cy="105" rx="24" ry="12" fill="#1e293b" stroke="#2ff59b" strokeWidth="1.5" />
        <line x1="360" y1="105" x2="360" y2="70" stroke="#2ff59b" strokeWidth="2" />
        <circle cx="360" cy="70" r="4" fill="#2ff59b" className="animate-ping" />
      </SubsystemGroup>

      {/* Subsystem 2: Spaced-Repetition Memory Matrix */}
      <SubsystemGroup id="memory-matrix" active={hoveredSubsystem === "memory-matrix"} onHover={onHoverSubsystem} label="MEMORY MATRIX" calloutX={460} calloutY={270}>
        <g transform="translate(460, 280)">
          <IsoBox x={0} y={0} w={45} l={35} h={25} topFill="#1a1e28" leftFill="#12141a" rightFill="#0d0e12" stroke={hoveredSubsystem === "memory-matrix" ? "#2ff59b" : "#384358"} />
          {/* Grid memory cells */}
          <line x1="-12" y1="-8" x2="16" y2="8" stroke="#2ff59b" strokeWidth="1.2" strokeDasharray="3 3" />
          <circle cx="2" cy="0" r="3" fill="#2ff59b" />
        </g>
      </SubsystemGroup>

      {/* Subsystem 3: Academic Pacing Chronometer Clock Tower */}
      <SubsystemGroup id="clock-tower" active={hoveredSubsystem === "clock-tower"} onHover={onHoverSubsystem} label="CHRONOMETER" calloutX={260} calloutY={270}>
        <g transform="translate(260, 280)">
          <IsoBox x={0} y={0} w={35} l={35} h={60} topFill="#222734" leftFill="#181b24" rightFill="#12141a" stroke={hoveredSubsystem === "clock-tower" ? "#2ff59b" : "#384358"} />
          <IsoDial cx={0} cy="-35" r="14" angle={150} label="SEMESTER" active={hoveredSubsystem === "clock-tower"} />
        </g>
      </SubsystemGroup>

      {/* Subsystem 4: Student Adaptive Feedback Bus */}
      <SubsystemGroup id="learning-bus" active={hoveredSubsystem === "learning-bus"} onHover={onHoverSubsystem} label="ADAPTIVE BUS" calloutX={360} calloutY={340}>
        <g transform="translate(360, 335)">
          <IsoDial cx={0} cy={10} r="18" angle={90} label="COMPREHENSION" active={hoveredSubsystem === "learning-bus"} />
        </g>
      </SubsystemGroup>
    </g>
  );
}

// =========================================================================
// 06: Government & Public Sector Visualization
// =========================================================================
export function GovernmentIllustration({ hoveredSubsystem, onHoverSubsystem }: IllustrationProps) {
  return (
    <g>
      <MasterPlatform />

      <WireHarness points={[[160, 240], [250, 270], [330, 240]]} active={hoveredSubsystem === "enclave-vault"} />
      <WireHarness points={[[330, 240], [430, 260], [560, 240]]} active={hoveredSubsystem === "data-diode"} />

      <SatellitePlatform x={160} y={235} icon={<path d="M 0 -7 L 6 0 L 0 7 L -6 0 Z" fill="#2ff59b" />} />
      <SatellitePlatform x={560} y={235} icon={<path d="M -6 -5 L 6 -5 L 0 5 Z" fill="#FFFFFF" />} />

      {/* Subsystem 1: Sovereign Root-of-Trust Crypt */}
      <SubsystemGroup id="enclave-vault" active={hoveredSubsystem === "enclave-vault"} onHover={onHoverSubsystem} label="SOVEREIGN CRYPT" calloutX={330} calloutY={190}>
        <IsoBox x={330} y={220} w={85} l={70} h={85} topFill="#222734" leftFill="#181b24" rightFill="#12141a" stroke={hoveredSubsystem === "enclave-vault" ? "#2ff59b" : "#384358"} />
        <ellipse cx="330" cy="135" rx="30" ry="15" fill="#1b202c" stroke="#2ff59b" strokeWidth="1.5" />
        <rect x="315" y="150" width="30" height="25" fill="#09090b" stroke="#2ff59b" strokeWidth="1" />
        <circle cx="330" cy="162" r="4" fill="#2ff59b" />
      </SubsystemGroup>

      {/* Subsystem 2: Optocoupled Unidirectional Data Diode */}
      <SubsystemGroup id="data-diode" active={hoveredSubsystem === "data-diode"} onHover={onHoverSubsystem} label="DATA DIODE" calloutX={450} calloutY={250}>
        <g transform="translate(450, 260)">
          <IsoBox x={0} y={0} w={35} l={20} h={25} topFill="#1a1e28" leftFill="#12141a" rightFill="#0d0e12" stroke={hoveredSubsystem === "data-diode" ? "#2ff59b" : "#384358"} />
          {/* Diode symbol */}
          <path d="M -8 0 L 6 -7 L 6 7 Z" fill="#2ff59b" />
          <line x1="-8" y1="-7" x2="-8" y2="7" stroke="#ffffff" strokeWidth="1.5" />
        </g>
      </SubsystemGroup>

      {/* Subsystem 3: Citizen Identity Attestation Terminal */}
      <SubsystemGroup id="civic-kiosk" active={hoveredSubsystem === "civic-kiosk"} onHover={onHoverSubsystem} label="CIVIC ATTESTATION" calloutX={250} calloutY={300}>
        <g transform="translate(250, 310)">
          <IsoBox x={0} y={0} w={30} l={25} h={40} topFill="#222734" leftFill="#181b24" rightFill="#12141a" stroke={hoveredSubsystem === "civic-kiosk" ? "#2ff59b" : "#384358"} />
          <rect x="-8" y="-25" width="16" height="12" fill="#09090b" stroke="#2ff59b" strokeWidth="1" />
          <circle cx="0" cy="-19" r="3" fill="#2ff59b" className="animate-ping" />
        </g>
      </SubsystemGroup>

      {/* Subsystem 4: Immutable Merkle Audit Log Monolith */}
      <SubsystemGroup id="audit-journal" active={hoveredSubsystem === "audit-journal"} onHover={onHoverSubsystem} label="MERKLE JOURNAL" calloutX={360} calloutY={340}>
        <g transform="translate(360, 335)">
          <IsoDial cx={0} cy={10} r="18" angle={45} label="SHA-3" active={hoveredSubsystem === "audit-journal"} />
        </g>
      </SubsystemGroup>
    </g>
  );
}

// =========================================================================
// 07: Energy & Utilities Visualization
// =========================================================================
export function EnergyIllustration({ hoveredSubsystem, onHoverSubsystem }: IllustrationProps) {
  return (
    <g>
      <MasterPlatform />

      <WireHarness points={[[160, 240], [250, 270], [330, 240]]} active={hoveredSubsystem === "substation-pylon"} />
      <WireHarness points={[[330, 240], [450, 260], [560, 240]]} active={hoveredSubsystem === "wind-turbine"} />

      <SatellitePlatform x={160} y={235} icon={<path d="M 0 -7 L -4 1 L 2 1 L 0 7 L 4 -1 L -2 -1 Z" fill="#2ff59b" />} />
      <SatellitePlatform x={560} y={235} icon={<circle cx="0" cy="0" r="5" fill="none" stroke="#FFFFFF" strokeWidth="1.3" />} />

      {/* Subsystem 1: 765 kV Ultra-High Voltage Substation Pylon */}
      <SubsystemGroup id="substation-pylon" active={hoveredSubsystem === "substation-pylon"} onHover={onHoverSubsystem} label="HV PYLON" calloutX={320} calloutY={170}>
        <g transform="translate(320, 200)">
          <path d="M -12 40 L -4 -50 L 4 -50 L 12 40 Z" fill="none" stroke={hoveredSubsystem === "substation-pylon" ? "#2ff59b" : "#4b5563"} strokeWidth="1.6" />
          <line x1="-25" y1="-30" x2="25" y2="-30" stroke="#2ff59b" strokeWidth="1.8" />
          <line x1="-32" y1="-10" x2="32" y2="-10" stroke="#2ff59b" strokeWidth="1.8" />
          <circle cx="-25" cy="-30" r="3" fill="#2ff59b" />
          <circle cx="25" cy="-30" r="3" fill="#2ff59b" />
        </g>
      </SubsystemGroup>

      {/* Subsystem 2: Renewable Generation Wind Turbine */}
      <SubsystemGroup id="wind-turbine" active={hoveredSubsystem === "wind-turbine"} onHover={onHoverSubsystem} label="WIND TURBINE" calloutX={460} calloutY={190}>
        <g transform="translate(460, 210)">
          <path d="M -3 35 L -1 -45 L 1 -45 L 3 35 Z" fill="#d4d4d8" stroke="#3b4458" strokeWidth="1.2" />
          <circle cx="0" cy="-45" r="4" fill="#2ff59b" />
          {/* 3 Blades */}
          <line x1="0" y1="-45" x2="0" y2="-75" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          <line x1="0" y1="-45" x2="26" y2="-30" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          <line x1="0" y1="-45" x2="-26" y2="-30" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        </g>
      </SubsystemGroup>

      {/* Subsystem 3: Precision PMU Phasor Measurement Unit */}
      <SubsystemGroup id="synchrophasor" active={hoveredSubsystem === "synchrophasor"} onHover={onHoverSubsystem} label="PMU PHASOR" calloutX={250} calloutY={290}>
        <g transform="translate(250, 310)">
          <IsoBox x={0} y={0} w={35} l={25} h={30} topFill="#222734" leftFill="#181b24" rightFill="#12141a" stroke={hoveredSubsystem === "synchrophasor" ? "#2ff59b" : "#384358"} />
          <IsoDial cx={0} cy="-18" r="14" angle={50} label="50.00Hz" active={hoveredSubsystem === "synchrophasor"} />
        </g>
      </SubsystemGroup>

      {/* Subsystem 4: BESS Solid-State Four-Quadrant Inverter */}
      <SubsystemGroup id="battery-inverter" active={hoveredSubsystem === "battery-inverter"} onHover={onHoverSubsystem} label="BESS INVERTER" calloutX={380} calloutY={320}>
        <g transform="translate(380, 320)">
          <IsoBox x={0} y={0} w={45} l={35} h={35} topFill="#1a1e28" leftFill="#12141a" rightFill="#0d0e12" stroke={hoveredSubsystem === "battery-inverter" ? "#2ff59b" : "#384358"} />
          <rect x="-10" y="-15" width="20" height="8" fill="#2ff59b" rx="2" />
          <line x1="-6" y1="-11" x2="6" y2="-11" stroke="#ffffff" strokeWidth="1.2" />
        </g>
      </SubsystemGroup>
    </g>
  );
}

// =========================================================================
// 08: Healthcare & Life Sciences Visualization
// =========================================================================
export function HealthcareIllustration({ hoveredSubsystem, onHoverSubsystem }: IllustrationProps) {
  return (
    <g>
      <MasterPlatform />

      <WireHarness points={[[160, 240], [250, 270], [330, 240]]} active={hoveredSubsystem === "cryo-dewar"} />
      <WireHarness points={[[330, 240], [450, 260], [560, 240]]} active={hoveredSubsystem === "spectrometer"} />

      <SatellitePlatform x={160} y={235} icon={<path d="M -6 0 L 6 0 M 0 -6 L 0 6" stroke="#2ff59b" strokeWidth="2" />} />
      <SatellitePlatform x={560} y={235} icon={<circle cx="0" cy="0" r="5" fill="none" stroke="#FFFFFF" strokeWidth="1.3" />} />

      {/* Subsystem 1: Liquid Nitrogen Cryogenic Bio-Dewar */}
      <SubsystemGroup id="cryo-dewar" active={hoveredSubsystem === "cryo-dewar"} onHover={onHoverSubsystem} label="CRYO DEWAR" calloutX={320} calloutY={190}>
        <g transform="translate(320, 220)">
          <ellipse cx="0" cy="20" rx="24" ry="12" fill="#181a20" stroke="#3b4458" strokeWidth="1.2" />
          <path d="M -24 20 L -24 -40 L 24 -40 L 24 20 Z" fill="#222734" stroke={hoveredSubsystem === "cryo-dewar" ? "#2ff59b" : "#384358"} strokeWidth="1.4" />
          <ellipse cx="0" cy="-40" rx="24" ry="12" fill="#2ff59b" opacity="0.8" />
          <circle cx="0" cy="-40" r="4" fill="#ffffff" />
        </g>
      </SubsystemGroup>

      {/* Subsystem 2: Optical Laser Spectrometer */}
      <SubsystemGroup id="spectrometer" active={hoveredSubsystem === "spectrometer"} onHover={onHoverSubsystem} label="SPECTROMETER" calloutX={460} calloutY={230}>
        <g transform="translate(460, 240)">
          <IsoBox x={0} y={0} w={35} l={25} h={35} topFill="#222734" leftFill="#181b24" rightFill="#12141a" stroke={hoveredSubsystem === "spectrometer" ? "#2ff59b" : "#384358"} />
          <line x1="-10" y1="-12" x2="10" y2="-12" stroke="#2ff59b" strokeWidth="2" strokeDasharray="2 2" className="iso-flow-line" />
          <circle cx="0" cy="-12" r="3" fill="#2ff59b" className="animate-ping" />
        </g>
      </SubsystemGroup>

      {/* Subsystem 3: Precision Peristaltic Micro-Dosing Loop */}
      <SubsystemGroup id="infusion-manifold" active={hoveredSubsystem === "infusion-manifold"} onHover={onHoverSubsystem} label="MICRO-DOSING" calloutX={250} calloutY={300}>
        <g transform="translate(250, 310)">
          <ellipse cx="0" cy="0" rx="28" ry="15" fill="none" stroke={hoveredSubsystem === "infusion-manifold" ? "#2ff59b" : "#475569"} strokeWidth="2" />
          <circle cx="0" cy="0" r="5" fill="#2ff59b" />
          <line x1="-28" y1="0" x2="-28" y2="20" stroke="#2ff59b" strokeWidth="1.5" className="iso-flow-line" />
        </g>
      </SubsystemGroup>

      {/* Subsystem 4: HIPAA / HL7 FHIR Healthcare Gateway */}
      <SubsystemGroup id="clinical-gateway" active={hoveredSubsystem === "clinical-gateway"} onHover={onHoverSubsystem} label="HL7 FHIR GATEWAY" calloutX={370} calloutY={330}>
        <g transform="translate(370, 330)">
          <IsoDial cx={0} cy={10} r="18" angle={135} label="FHIR R4" active={hoveredSubsystem === "clinical-gateway"} />
        </g>
      </SubsystemGroup>
    </g>
  );
}

// =========================================================================
// 09: Oil & Gas Visualization
// =========================================================================
export function OilGasIllustration({ hoveredSubsystem, onHoverSubsystem }: IllustrationProps) {
  return (
    <g>
      <MasterPlatform />

      <WireHarness points={[[160, 240], [250, 270], [330, 240]]} active={hoveredSubsystem === "choke-valve"} />
      <WireHarness points={[[330, 240], [450, 260], [560, 240]]} active={hoveredSubsystem === "storage-sphere"} />

      <SatellitePlatform x={160} y={235} icon={<path d="M 0 -7 C 4 -2 4 4 0 7 C -4 4 -4 -2 0 -7 Z" fill="#2ff59b" />} />
      <SatellitePlatform x={560} y={235} icon={<circle cx="0" cy="0" r="5" fill="none" stroke="#FFFFFF" strokeWidth="1.3" />} />

      {/* Subsystem 1: High-Pressure Choke Valve Manifold */}
      <SubsystemGroup id="choke-valve" active={hoveredSubsystem === "choke-valve"} onHover={onHoverSubsystem} label="CHOKE MANIFOLD" calloutX={310} calloutY={190}>
        <g transform="translate(310, 210)">
          <IsoBox x={0} y={0} w={65} l={45} h={55} topFill="#222734" leftFill="#181b24" rightFill="#12141a" stroke={hoveredSubsystem === "choke-valve" ? "#2ff59b" : "#384358"} />
          {/* Wheel handle on top */}
          <ellipse cx="0" cy="-35" rx="16" ry="8" fill="none" stroke="#2ff59b" strokeWidth="2" />
          <line x1="-16" y1="-35" x2="16" y2="-35" stroke="#ffffff" strokeWidth="1.5" />
        </g>
      </SubsystemGroup>

      {/* Subsystem 2: Pressurized Liquefied Storage Sphere */}
      <SubsystemGroup id="storage-sphere" active={hoveredSubsystem === "storage-sphere"} onHover={onHoverSubsystem} label="STORAGE SPHERE" calloutX={460} calloutY={210}>
        <g transform="translate(460, 230)">
          <circle cx="0" cy="-10" r="28" fill="#1b202c" stroke={hoveredSubsystem === "storage-sphere" ? "#2ff59b" : "#384358"} strokeWidth="1.5" />
          <ellipse cx="0" cy="-10" rx="28" ry="10" fill="none" stroke="#2ff59b" strokeWidth="1" strokeDasharray="3 3" />
          {/* Legs */}
          <line x1="-18" y1="12" x2="-22" y2="28" stroke="#4b5563" strokeWidth="2.5" />
          <line x1="18" y1="12" x2="22" y2="28" stroke="#4b5563" strokeWidth="2.5" />
        </g>
      </SubsystemGroup>

      {/* Subsystem 3: Differential Pressure Orifice Meter Run */}
      <SubsystemGroup id="orifice-meter" active={hoveredSubsystem === "orifice-meter"} onHover={onHoverSubsystem} label="ORIFICE RUN" calloutX={250} calloutY={290}>
        <g transform="translate(250, 310)">
          <line x1="-30" y1="0" x2="30" y2="0" stroke="#4b5563" strokeWidth="6" strokeLinecap="round" />
          <line x1="-30" y1="0" x2="30" y2="0" stroke="#2ff59b" strokeWidth="2" strokeDasharray="3 3" className="iso-flow-line" />
          <circle cx="0" cy="0" r="6" fill="#101319" stroke="#2ff59b" strokeWidth="1.5" />
        </g>
      </SubsystemGroup>

      {/* Subsystem 4: SCADA Acoustic Leak Sensor */}
      <SubsystemGroup id="pipeline-telemetry" active={hoveredSubsystem === "pipeline-telemetry"} onHover={onHoverSubsystem} label="SCADA SENSOR" calloutX={370} calloutY={320}>
        <g transform="translate(370, 330)">
          <IsoDial cx={0} cy={10} r="18" angle={160} label="140 BAR" active={hoveredSubsystem === "pipeline-telemetry"} />
        </g>
      </SubsystemGroup>
    </g>
  );
}

// =========================================================================
// 10: Telecom & Media Visualization
// =========================================================================
export function TelecomIllustration({ hoveredSubsystem, onHoverSubsystem }: IllustrationProps) {
  return (
    <g>
      <MasterPlatform />

      <WireHarness points={[[160, 240], [250, 270], [330, 240]]} active={hoveredSubsystem === "mimo-array"} />
      <WireHarness points={[[330, 240], [450, 260], [560, 240]]} active={hoveredSubsystem === "server-blade"} />

      <SatellitePlatform x={160} y={235} icon={<path d="M -6 6 A 8 8 0 0 1 -6 -6 M 6 6 A 8 8 0 0 0 6 -6" stroke="#2ff59b" strokeWidth="1.5" fill="none" />} />
      <SatellitePlatform x={560} y={235} icon={<circle cx="0" cy="0" r="5" fill="none" stroke="#FFFFFF" strokeWidth="1.3" />} />

      {/* Subsystem 1: 5G 64T64R Massive-MIMO Panel Tower */}
      <SubsystemGroup id="mimo-array" active={hoveredSubsystem === "mimo-array"} onHover={onHoverSubsystem} label="MIMO TOWER" calloutX={320} calloutY={160}>
        <g transform="translate(320, 200)">
          <line x1="0" y1="35" x2="0" y2="-65" stroke="#4b5563" strokeWidth="3" />
          <IsoBox x={-15} y={-45} w={30} l={15} h={45} topFill="#222734" leftFill="#181b24" rightFill="#12141a" stroke={hoveredSubsystem === "mimo-array" ? "#2ff59b" : "#384358"} />
          <circle cx="0" cy="-70" r="4" fill="#2ff59b" className="animate-ping" />
        </g>
      </SubsystemGroup>

      {/* Subsystem 2: Open-RAN Virtualized Baseband Server Rack */}
      <SubsystemGroup id="server-blade" active={hoveredSubsystem === "server-blade"} onHover={onHoverSubsystem} label="O-RAN SERVER" calloutX={460} calloutY={220}>
        <g transform="translate(460, 240)">
          <IsoBox x={0} y={0} w={40} l={30} h={65} topFill="#1a1e28" leftFill="#12141a" rightFill="#0d0e12" stroke={hoveredSubsystem === "server-blade" ? "#2ff59b" : "#384358"} />
          {/* Rack blades */}
          <line x1="-12" y1="-25" x2="16" y2="-10" stroke="#2ff59b" strokeWidth="1.5" />
          <line x1="-12" y1="-15" x2="16" y2="0" stroke="#2ff59b" strokeWidth="1.5" />
          <line x1="-12" y1="-5" x2="16" y2="10" stroke="#ffffff" strokeWidth="1.5" />
        </g>
      </SubsystemGroup>

      {/* Subsystem 3: eCPRI Optical Distribution Hub */}
      <SubsystemGroup id="optical-fronthaul" active={hoveredSubsystem === "optical-fronthaul"} onHover={onHoverSubsystem} label="eCPRI HUB" calloutX={250} calloutY={290}>
        <g transform="translate(250, 310)">
          <IsoBox x={0} y={0} w={30} l={20} h={25} topFill="#222734" leftFill="#181b24" rightFill="#12141a" stroke={hoveredSubsystem === "optical-fronthaul" ? "#2ff59b" : "#384358"} />
          <circle cx="-5" cy="-8" r="3" fill="#2ff59b" />
          <circle cx="5" cy="-3" r="3" fill="#ffffff" />
        </g>
      </SubsystemGroup>

      {/* Subsystem 4: RF Spectrum Analyzer Dial */}
      <SubsystemGroup id="spectrum-dial" active={hoveredSubsystem === "spectrum-dial"} onHover={onHoverSubsystem} label="SPECTRUM DIAL" calloutX={370} calloutY={320}>
        <g transform="translate(370, 330)">
          <IsoDial cx={0} cy={10} r="18" angle={75} label="28GHz" active={hoveredSubsystem === "spectrum-dial"} />
        </g>
      </SubsystemGroup>
    </g>
  );
}

// =========================================================================
// 11: Pharmaceuticals & Biotechnology Visualization
// =========================================================================
export function PharmaIllustration({ hoveredSubsystem, onHoverSubsystem }: IllustrationProps) {
  return (
    <g>
      <MasterPlatform />

      <WireHarness points={[[160, 240], [250, 270], [330, 240]]} active={hoveredSubsystem === "bioreactor-vessel"} />
      <WireHarness points={[[330, 240], [450, 260], [560, 240]]} active={hoveredSubsystem === "dna-sequencer"} />

      <SatellitePlatform x={160} y={235} icon={<circle cx="0" cy="0" r="5" fill="#2ff59b" />} />
      <SatellitePlatform x={560} y={235} icon={<path d="M -5 -5 L 5 5 M -5 5 L 5 -5" stroke="#FFFFFF" strokeWidth="1.5" />} />

      {/* Subsystem 1: 316L Stainless Steel Continuous Perfusion Bioreactor */}
      <SubsystemGroup id="bioreactor-vessel" active={hoveredSubsystem === "bioreactor-vessel"} onHover={onHoverSubsystem} label="BIOREACTOR" calloutX={320} calloutY={180}>
        <g transform="translate(320, 210)">
          <ellipse cx="0" cy="25" rx="26" ry="13" fill="#181a20" stroke="#3b4458" strokeWidth="1.2" />
          <path d="M -26 25 L -26 -45 L 26 -45 L 26 25 Z" fill="#222734" stroke={hoveredSubsystem === "bioreactor-vessel" ? "#2ff59b" : "#384358"} strokeWidth="1.4" />
          <ellipse cx="0" cy="-45" rx="26" ry="13" fill="#2ff59b" opacity="0.85" />
          {/* Impeller shaft */}
          <line x1="0" y1="-45" x2="0" y2="10" stroke="#ffffff" strokeWidth="2" />
          <line x1="-12" y1="10" x2="12" y2="10" stroke="#ffffff" strokeWidth="2" />
        </g>
      </SubsystemGroup>

      {/* Subsystem 2: Microfluidic DNA Sequencer Cell */}
      <SubsystemGroup id="dna-sequencer" active={hoveredSubsystem === "dna-sequencer"} onHover={onHoverSubsystem} label="DNA SEQUENCER" calloutX={460} calloutY={230}>
        <g transform="translate(460, 240)">
          <IsoBox x={0} y={0} w={35} l={25} h={35} topFill="#222734" leftFill="#181b24" rightFill="#12141a" stroke={hoveredSubsystem === "dna-sequencer" ? "#2ff59b" : "#384358"} />
          <line x1="-8" y1="-10" x2="8" y2="-10" stroke="#2ff59b" strokeWidth="2" strokeDasharray="2 3" className="iso-flow-line" />
          <circle cx="0" cy="-10" r="3" fill="#2ff59b" className="animate-ping" />
        </g>
      </SubsystemGroup>

      {/* Subsystem 3: Micro-Porous Gas Sparging Loop */}
      <SubsystemGroup id="sparger-manifold" active={hoveredSubsystem === "sparger-manifold"} onHover={onHoverSubsystem} label="SPARGER LOOP" calloutX={250} calloutY={290}>
        <g transform="translate(250, 310)">
          <ellipse cx="0" cy="0" rx="25" ry="14" fill="none" stroke={hoveredSubsystem === "sparger-manifold" ? "#2ff59b" : "#475569"} strokeWidth="2" strokeDasharray="3 3" />
          <circle cx="-12" cy="0" r="2.5" fill="#2ff59b" />
          <circle cx="12" cy="0" r="2.5" fill="#ffffff" />
        </g>
      </SubsystemGroup>

      {/* Subsystem 4: Annex 11 / 21 CFR Part 11 Electronic Log */}
      <SubsystemGroup id="gmp-controller" active={hoveredSubsystem === "gmp-controller"} onHover={onHoverSubsystem} label="GMP CONTROLLER" calloutX={370} calloutY={320}>
        <g transform="translate(370, 330)">
          <IsoDial cx={0} cy={10} r="18" angle={115} label="pH 7.22" active={hoveredSubsystem === "gmp-controller"} />
        </g>
      </SubsystemGroup>
    </g>
  );
}

// =========================================================================
// 12: Lending & FinTech Visualization
// =========================================================================
export function FintechIllustration({ hoveredSubsystem, onHoverSubsystem }: IllustrationProps) {
  return (
    <g>
      <MasterPlatform />

      <WireHarness points={[[160, 240], [250, 270], [330, 240]]} active={hoveredSubsystem === "matching-engine"} />
      <WireHarness points={[[330, 240], [450, 260], [560, 240]]} active={hoveredSubsystem === "ptp-clock"} />

      <SatellitePlatform x={160} y={235} icon={<text x="-6" y="5" fontSize="13" fontWeight="bold" fill="#2ff59b">$</text>} />
      <SatellitePlatform x={560} y={235} icon={<path d="M -7 -4 L 7 -4 L 0 6 Z" fill="#FFFFFF" />} />

      {/* Subsystem 1: Ultra-Low Latency Matching Engine */}
      <SubsystemGroup id="matching-engine" active={hoveredSubsystem === "matching-engine"} onHover={onHoverSubsystem} label="MATCHING ENGINE" calloutX={330} calloutY={180}>
        <IsoBox x={330} y={215} w={85} l={60} h={95} topFill="#222734" leftFill="#181b24" rightFill="#12141a" stroke={hoveredSubsystem === "matching-engine" ? "#2ff59b" : "#384358"} />
        <ellipse cx="330" cy="120" rx="36" ry="18" fill="#1b202c" stroke="#2ff59b" strokeWidth="1.5" />
        <circle cx="330" cy="120" r="5" fill="#2ff59b" className="animate-ping" />
      </SubsystemGroup>

      {/* Subsystem 2: Rubidium Atomic PTP Hardware Master Clock */}
      <SubsystemGroup id="ptp-clock" active={hoveredSubsystem === "ptp-clock"} onHover={onHoverSubsystem} label="PTP ATOMIC CLOCK" calloutX={460} calloutY={220}>
        <g transform="translate(460, 240)">
          <IsoBox x={0} y={0} w={35} l={25} h={45} topFill="#1a1e28" leftFill="#12141a" rightFill="#0d0e12" stroke={hoveredSubsystem === "ptp-clock" ? "#2ff59b" : "#384358"} />
          <IsoDial cx={0} cy="-20" r="14" angle={84} label="STRATUM 1" active={hoveredSubsystem === "ptp-clock"} />
        </g>
      </SubsystemGroup>

      {/* Subsystem 3: Instant DvP Atomic Clearing Bridge */}
      <SubsystemGroup id="settlement-bridge" active={hoveredSubsystem === "settlement-bridge"} onHover={onHoverSubsystem} label="DvP BRIDGE" calloutX={250} calloutY={290}>
        <g transform="translate(250, 310)">
          <circle cx="-12" cy="0" r="8" fill="#181c25" stroke={hoveredSubsystem === "settlement-bridge" ? "#2ff59b" : "#384358"} strokeWidth="1.5" />
          <circle cx="12" cy="0" r="8" fill="#181c25" stroke="#2ff59b" strokeWidth="1.8" />
          <line x1="-4" y1="0" x2="4" y2="0" stroke="#2ff59b" strokeWidth="2" className="iso-flow-line" />
        </g>
      </SubsystemGroup>

      {/* Subsystem 4: Value-at-Risk (VaR) Governor Dial */}
      <SubsystemGroup id="risk-dial" active={hoveredSubsystem === "risk-dial"} onHover={onHoverSubsystem} label="VaR GOVERNOR" calloutX={370} calloutY={320}>
        <g transform="translate(370, 330)">
          <IsoDial cx={0} cy={10} r="18" angle={25} label="VaR 99.9%" active={hoveredSubsystem === "risk-dial"} />
        </g>
      </SubsystemGroup>
    </g>
  );
}

// =========================================================================
// Master Industry Visualization Renderer Mapping
// =========================================================================
export function IndustryVisualization({
  industryId,
  hoveredSubsystem,
  onHoverSubsystem,
  isDark = true,
}: {
  industryId: string;
  hoveredSubsystem?: string | null;
  onHoverSubsystem?: (id: string | null) => void;
  isDark?: boolean;
}) {
  const renderIllustration = () => {
    const props: IllustrationProps = {
      hoveredSubsystem,
      onHoverSubsystem,
    };

    switch (industryId) {
      case "automotive-manufacturing":
        return <AutomotiveIllustration {...props} />;
      case "banking-financial-services":
        return <BankingIllustration {...props} />;
      case "aviation-aerospace":
        return <AviationIllustration {...props} />;
      case "ecommerce-retail":
        return <EcommerceIllustration {...props} />;
      case "education-learning":
        return <EducationIllustration {...props} />;
      case "government-public-sector":
        return <GovernmentIllustration {...props} />;
      case "energy-utilities":
        return <EnergyIllustration {...props} />;
      case "healthcare-life-sciences":
        return <HealthcareIllustration {...props} />;
      case "oil-gas":
        return <OilGasIllustration {...props} />;
      case "telecom-media":
        return <TelecomIllustration {...props} />;
      case "pharmaceuticals-biotechnology":
        return <PharmaIllustration {...props} />;
      case "lending-fintech":
        return <FintechIllustration {...props} />;
      default:
        return <AutomotiveIllustration {...props} />;
    }
  };

  return (
    <IsoThemeContext.Provider value={{ isDark }}>
      <div className="relative w-full h-full flex items-center justify-center p-2 sm:p-4 select-none">
        <motion.svg
          key={industryId}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
          viewBox="0 0 720 520"
          className={`w-full max-w-[680px] h-auto ${isDark ? "iso-theme-dark drop-shadow-[0_12px_28px_rgba(0,0,0,0.65)]" : "iso-theme-light drop-shadow-[0_12px_28px_rgba(12,112,117,0.12)]"}`}
        >
          <defs>
            <filter id="emeraldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={isDark ? "#2ff59b" : "#0c7075"} floodOpacity={isDark ? "0.8" : "0.55"} />
            </filter>
            <style>{`
              .iso-theme-light [stroke="#2ff59b"] {
                stroke: #0c7075 !important;
              }
              .iso-theme-light [fill="#2ff59b"] {
                fill: #10b981 !important;
              }
              .iso-theme-light [stroke="#384358"],
              .iso-theme-light [stroke="#3b4458"] {
                stroke: #94a3b8 !important;
              }
              .iso-theme-light [fill="#181a20"],
              .iso-theme-light [fill="#1b1f28"],
              .iso-theme-light [fill="#0f1116"] {
                fill: #f1f5f9 !important;
              }
              .iso-theme-light [fill="#2d3340"] {
                fill: #e2e8f0 !important;
              }
              .iso-theme-light text[fill="#FFFFFF"],
              .iso-theme-light text[fill="#ffffff"] {
                fill: #0f172a !important;
              }
            `}</style>
          </defs>
          {renderIllustration()}
        </motion.svg>
      </div>
    </IsoThemeContext.Provider>
  );
}

export default IndustryVisualization;
