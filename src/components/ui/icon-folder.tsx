"use client";

import * as React from "react";

/* ------------------------------------------------------------------ */
/*  Icon Folder — a glass folder with app icons fanned out of it.       */
/*  Pops in when it scrolls into view; hover / tap / Enter spreads the  */
/*  icons wider. The folder tab shape is drawn to the real card width. */
/* ------------------------------------------------------------------ */

export type FolderIcon = {
  /** Image URL of an app icon (square works best). */
  src?: string;
  /** Or any custom node (SVG, emoji, component). */
  node?: React.ReactNode;
  /** Tile background behind `node`. */
  background?: string;
  label?: string;
};

export type IconFolderProps = {
  title?: string;
  tags?: string[];
  icons?: FolderIcon[];
  theme?: "dark" | "light";
  /** Start spread open (no hover needed). */
  defaultOpen?: boolean;
  /** Horizontal distance between fanned icons, px. */
  spread?: number;
  /** Small icon pill in the corner of the folder. */
  showPill?: boolean;
  className?: string;
  onSelectTag?: (tag: string) => void;
  onSelectIcon?: (icon: FolderIcon) => void;
};

/* ---------- default content ---------- */

const brand = (d: string) => (
  <svg viewBox="0 0 24 24" width="50%" height="50%" fill="#fff" aria-hidden="true">
    <path d={d} />
  </svg>
);

/* Enterprise Department Brand Marks & Glyphs */
export const DEPARTMENT_ICONS: FolderIcon[] = [
  {
    label: "Marketing & Sales",
    background: "linear-gradient(135deg, #ff5e3a 0%, #ee2a5b 50%, #d81b60 100%)",
    node: (
      <svg viewBox="0 0 40 40" width="58%" height="58%" fill="none" aria-hidden="true">
        {/* Megaphone Acoustic Body */}
        <path
          d="M7 23V17C7 15.9 7.9 15 9 15H13L21 9V31L13 25H9C7.9 25 7 24.1 7 23Z"
          fill="#ffffff"
        />
        <path
          d="M10 25V30C10 31.1 10.9 32 12 32H13C14.1 32 15 31.1 15 30V25"
          fill="#ffffff"
          opacity="0.85"
        />
        {/* Reach Soundwaves */}
        <path
          d="M24 16C25.8 17.5 27 19.5 27 20C27 20.5 25.8 22.5 24 24"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M28 12C31.5 15 33.5 18 33.5 20C33.5 22 31.5 25 28 28"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.6"
        />
        {/* Ascending Sales Velocity Line */}
        <path
          d="M25 28L29 23L33 25L37 18M37 18H31M37 18V24"
          stroke="#ffffff"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Finance",
    background: "linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)",
    node: (
      <svg viewBox="0 0 40 40" width="58%" height="58%" fill="none" aria-hidden="true">
        {/* Financial Security Vault Crest */}
        <path
          d="M20 4L32 9.5V19.5C32 27.5 27 34 20 37.5C13 34 8 27.5 8 19.5V9.5L20 4Z"
          stroke="#ffffff"
          strokeWidth="2.8"
          strokeLinejoin="round"
          fill="rgba(255,255,255,0.08)"
        />
        {/* Currency & Growth Sign */}
        <path
          d="M20 11V29M24.5 16C24.5 13.8 22.8 12.2 20 12.2C17.2 12.2 15.5 13.8 15.5 16C15.5 20.2 24.5 19.2 24.5 23.5C24.5 25.8 22.8 27.5 20 27.5C17.2 27.5 15.5 25.8 15.5 23.5"
          stroke="#ffffff"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "HR",
    background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #3730a3 100%)",
    node: (
      <svg viewBox="0 0 40 40" width="60%" height="60%" fill="none" aria-hidden="true">
        {/* Central Leader Silhouette */}
        <circle cx="20" cy="12" r="4.2" fill="#ffffff" />
        <path
          d="M13 24C13 20.2 16.1 17.2 20 17.2C23.9 17.2 27 20.2 27 24V26H13V24Z"
          fill="#ffffff"
        />
        {/* Left Team Colleague */}
        <circle cx="10" cy="15.5" r="3.2" fill="#ffffff" opacity="0.8" />
        <path
          d="M5 26C5 23 7.4 20.5 10.5 20.5C11.6 20.5 12.6 20.8 13.5 21.4V24H5V26Z"
          fill="#ffffff"
          opacity="0.8"
        />
        {/* Right Team Colleague */}
        <circle cx="30" cy="15.5" r="3.2" fill="#ffffff" opacity="0.8" />
        <path
          d="M35 26C35 23 32.6 20.5 29.5 20.5C28.4 20.5 27.4 20.8 26.5 21.4V24H35V26Z"
          fill="#ffffff"
          opacity="0.8"
        />
        {/* Synergy Connection Bridge */}
        <path
          d="M11 31C16 34 24 34 29 31"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.9"
        />
        <circle cx="20" cy="33" r="1.8" fill="#ffffff" />
      </svg>
    ),
  },
  {
    label: "Administrator",
    background: "linear-gradient(135deg, #0284c7 0%, #0369a1 50%, #075985 100%)",
    node: (
      <svg viewBox="0 0 40 40" width="58%" height="58%" fill="none" aria-hidden="true">
        {/* Governance / Admin Shield */}
        <path
          d="M20 5L32 10.2V19.8C32 27.2 27 33.2 20 36.5C13 33.2 8 27.2 8 19.8V10.2L20 5Z"
          stroke="#ffffff"
          strokeWidth="2.8"
          strokeLinejoin="round"
          fill="rgba(255,255,255,0.06)"
        />
        {/* Central Settings / Control Gear */}
        <circle cx="20" cy="19.5" r="4.5" stroke="#ffffff" strokeWidth="2.4" />
        <circle cx="20" cy="19.5" r="1.8" fill="#ffffff" />
        {/* Gear Teeth */}
        <path
          d="M20 12.8V14.8M20 24.2V26.2M13.3 19.5H15.3M24.7 19.5H26.7M15.3 14.8L16.7 16.2M23.3 22.8L24.7 24.2M15.3 24.2L16.7 22.8M23.3 16.2L24.7 14.8"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export const DEFAULT_ICONS: FolderIcon[] = DEPARTMENT_ICONS;

export const DEFAULTS = {
  title: "Departments",
  tags: ["Marketing & Sales", "Finance", "HR", "Administrator"],
  icons: DEFAULT_ICONS.slice(0, 4),
};

export const THEMES = {
  dark: {
    ink: "#ffffff",
    chipBg: "rgba(36,36,36,.7)",
    chipBorder: "#282828",
    chipInk: "#9f9f9f",
    back: "linear-gradient(180deg,rgba(255,255,255,.035),rgba(255,255,255,.008) 60%)",
    backEdge: "rgba(255,255,255,.07)",
    front: "linear-gradient(160deg,rgba(255,255,255,.09),rgba(255,255,255,.015) 55%),rgba(12,12,12,.78)",
    frontEdge: ["rgba(255,255,255,.38)", "rgba(255,255,255,.1)", "rgba(255,255,255,0)"],
    glow: "rgba(255,255,255,.10)",
    pillBg: "rgba(0,0,0,.55)",
    pillBorder: "rgba(255,255,255,.08)",
    tileRing: "rgba(255,255,255,.14)",
    tileShadow: "rgba(0,0,0,.55)",
    focus: "rgba(255,255,255,.4)",
  },
  light: {
    ink: "#111111",
    chipBg: "rgba(255,255,255,.7)",
    chipBorder: "#e2e2e2",
    chipInk: "#6b6b6b",
    back: "linear-gradient(180deg,rgba(0,0,0,.05),rgba(0,0,0,.015) 60%)",
    backEdge: "rgba(0,0,0,.08)",
    front: "linear-gradient(160deg,rgba(255,255,255,.95),rgba(255,255,255,.55) 55%),rgba(240,240,238,.7)",
    frontEdge: ["rgba(255,255,255,1)", "rgba(0,0,0,.06)", "rgba(0,0,0,.04)"],
    glow: "rgba(60,44,255,.10)",
    pillBg: "rgba(255,255,255,.8)",
    pillBorder: "rgba(0,0,0,.08)",
    tileRing: "rgba(0,0,0,.08)",
    tileShadow: "rgba(0,0,0,.18)",
    focus: "rgba(0,0,0,.35)",
  },
} as const;

/* folder outlines: front pocket has its tab on the left, back plate on the right */
const pathL = (w: number, h: number, r: number, d: number, tw: number, s: number) =>
  `M0 ${r}A${r} ${r} 0 0 1 ${r} 0L${tw} 0C${tw + s * 0.55} 0 ${tw + s * 0.45} ${d} ${tw + s} ${d}L${w - r} ${d}A${r} ${r} 0 0 1 ${w} ${d + r}L${w} ${h - r}A${r} ${r} 0 0 1 ${w - r} ${h}L${r} ${h}A${r} ${r} 0 0 1 0 ${h - r}Z`;
const pathR = (w: number, h: number, r: number, d: number, tw: number, s: number) => {
  const x = w - tw;
  return `M0 ${d + r}A${r} ${r} 0 0 1 ${r} ${d}L${x - s} ${d}C${x - s * 0.45} ${d} ${x - s * 0.55} 0 ${x} 0L${w - r} 0A${r} ${r} 0 0 1 ${w} ${r}L${w} ${h - r}A${r} ${r} 0 0 1 ${w - r} ${h}L${r} ${h}A${r} ${r} 0 0 1 0 ${h - r}Z`;
};

function useShape(ref: React.RefObject<HTMLDivElement | null>, make: (w: number, h: number) => string) {
  const [d, setD] = React.useState("");
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    setD(make(el.offsetWidth || 380, el.offsetHeight || 180));
    const ro = new ResizeObserver(() => setD(make(el.offsetWidth, el.offsetHeight)));
    ro.observe(el);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return d;
}

function Tile({ icon, ring, shadow }: { icon: FolderIcon; ring: string; shadow: string }) {
  return (
    <div
      className="grid h-full w-full place-items-center overflow-hidden rounded-[inherit]"
      style={{ background: icon.src ? undefined : icon.background ?? "#2a2a2a", boxShadow: `0 18px 40px ${shadow}, 0 0 0 1px ${ring}` }}
    >
      {icon.src ? <img src={icon.src} alt="" draggable={false} className="h-full w-full object-cover" /> : icon.node}
    </div>
  );
}

export function IconFolder(props: IconFolderProps) {
  const { title, tags, icons } = { ...DEFAULTS, ...props };
  const { theme = "dark", defaultOpen = false, spread = 70, showPill = true, className = "", onSelectTag, onSelectIcon } = props;
  const t = THEMES[theme];
  const gid = React.useId().replace(/:/g, "");

  const rootRef = React.useRef<HTMLDivElement>(null);
  const frontRef = React.useRef<HTMLDivElement>(null);
  const backRef = React.useRef<HTMLDivElement>(null);
  const [shown, setShown] = React.useState(false);
  const [open, setOpen] = React.useState(defaultOpen);
  const [hover, setHover] = React.useState(false);
  const [hi, setHi] = React.useState<number | null>(null);
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => setOpen(defaultOpen), [defaultOpen]);
  React.useEffect(() => setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches), []);
  React.useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setShown(true), { threshold: 0.1 });
    io.observe(el);
    // Also trigger immediately if already visible
    setShown(true);
    return () => io.disconnect();
  }, []);

  const frontD = useShape(frontRef, (w, h) => pathL(w, h, 24, 24, Math.round(w * 0.42), 46));
  const backD = useShape(backRef, (w, h) => pathR(w, h, 24, 24, Math.round(w * 0.4), 46));

  const n = icons.length;
  const rs = n > 1 ? 25 / (n - 1) : 0; // degrees of tilt per step
  const wide = open || hover;
  const lift = wide;
  const ease = "cubic-bezier(.2,.8,.2,1)";
  const toggle = () => setOpen((o) => !o);

  return (
    <div
      ref={rootRef}
      role="button"
      tabIndex={0}
      aria-expanded={open}
      aria-label={`${title}: ${tags.join(", ")}`}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      }}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
      onPointerLeave={() => {
        setHover(false);
        setHi(null);
      }}
      className={`relative isolate h-[286px] w-full max-w-[420px] cursor-pointer select-none outline-none border-0 [-webkit-tap-highlight-color:transparent] focus:outline-none focus-visible:outline-none ${className}`}
      style={{
        color: t.ink,
        fontFamily: "'Geist', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
        letterSpacing: "-0.05em",
        outline: "none",
        zIndex: lift ? 2 : undefined,
        opacity: shown || reduced ? 1 : 0,
        transform: shown || reduced ? (lift ? "translateY(-6px) scale(1.02)" : "none") : "translateY(34px) scale(.92)",
        transition: reduced ? "none" : `transform .9s ${ease}, opacity .6s ease`,
      }}
    >
      {/* soft glow behind the folder */}
      <div
        className="pointer-events-none absolute left-[8%] right-[8%] top-10 -z-10 h-[200px] rounded-full opacity-80 blur-[18px]"
        style={{ background: `radial-gradient(closest-side, ${t.glow}, transparent)` }}
      />

      {/* back plate */}
      <div
        ref={backRef}
        className="absolute inset-x-0 bottom-0 top-[14px]"
        style={{ background: t.back, clipPath: backD ? `path('${backD}')` : undefined }}
      >
        <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
          <path d={backD} fill="none" stroke={t.backEdge} strokeWidth="2" />
        </svg>
      </div>

      {/* fanned icons */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {icons.map((icon, i) => {
          const k = i - (n - 1) / 2;
          const gap = wide ? spread * 1.15 : spread;
          const y = k * k * 9 - (wide ? 4 : 0);
          const rot = k * rs * (wide ? 1.2 : 1);
          return (
            <div
              key={i}
              className="absolute left-1/2 top-[42px] -ml-[50.5px] h-[101px] w-[101px] rounded-[26px] [backface-visibility:hidden]"
              style={{
                zIndex: hi === i ? 5 : undefined,
                opacity: shown || reduced ? 1 : 0,
                transform: shown || reduced ? `translate3d(${k * gap}px, ${y}px, 0) rotate(${rot}deg)` : `translate3d(${k * spread * 0.6}px, 80px, 0)`,
                transition: reduced ? "none" : `transform ${wide ? 0.6 : 0.9}s ${ease}, opacity .5s`,
                transitionDelay: reduced ? "0s" : wide ? `${i * 0.04}s` : `${0.35 + i * 0.08}s`,
              }}
            >
              <div
                className={`pointer-events-auto relative h-full w-full rounded-[inherit] ${onSelectIcon ? "cursor-pointer" : ""}`}
                onClick={(e) => {
                  if (onSelectIcon) {
                    e.stopPropagation();
                    onSelectIcon(icon);
                  }
                }}
                onPointerEnter={(e) => e.pointerType === "mouse" && setHi(i)}
                onPointerLeave={() => setHi((h) => (h === i ? null : h))}
                style={{
                  transform: hi === i ? `translateY(-26px) rotate(${-rot}deg) scale(1.1)` : hi !== null ? "scale(.96)" : "none",
                  filter: hi !== null && hi !== i ? "saturate(.75) brightness(.85)" : "none",
                  transition: reduced ? "none" : `transform .45s ${ease}, filter .3s ease`,
                }}
              >
                <Tile icon={icon} ring={t.tileRing} shadow={t.tileShadow} />
                {icon.label && (
                  <span
                    className="pointer-events-none absolute bottom-full left-1/2 mb-2.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium leading-4 backdrop-blur-[8px]"
                    style={{
                      background: t.pillBg,
                      borderColor: t.pillBorder,
                      color: t.ink,
                      opacity: hi === i ? 1 : 0,
                      transform: `translateX(-50%) translateY(${hi === i ? 0 : 6}px)`,
                      transition: reduced ? "none" : `opacity .25s ease, transform .35s ${ease}`,
                    }}
                  >
                    {icon.label}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* glass front pocket */}
      <div
        ref={frontRef}
        className="absolute inset-x-0 bottom-0 h-[180px] overflow-hidden backdrop-blur-[18px] backdrop-saturate-150"
        style={{
          background: t.front,
          clipPath: frontD ? `path('${frontD}')` : undefined,
          transform: lift ? "translateY(6px)" : "none",
          transition: reduced ? "none" : `transform .6s ${ease}`,
        }}
      >
        <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
          <defs>
            <linearGradient id={`edge-${gid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={t.frontEdge[0]} />
              <stop offset=".35" stopColor={t.frontEdge[1]} />
              <stop offset="1" stopColor={t.frontEdge[2]} />
            </linearGradient>
          </defs>
          <path d={frontD} fill="none" stroke={`url(#edge-${gid})`} strokeWidth="2" />
        </svg>

        <h3 className="m-0 px-[18px] pt-[34px] text-xl font-medium leading-[26px]">{title}</h3>
        <div className="mx-[18px] mt-3.5 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              role={onSelectTag ? "button" : undefined}
              tabIndex={onSelectTag ? 0 : undefined}
              onClick={(e) => {
                if (onSelectTag) {
                  e.stopPropagation();
                  onSelectTag(tag);
                }
              }}
              onKeyDown={(e) => {
                if (onSelectTag && (e.key === "Enter" || e.key === " ")) {
                  e.preventDefault();
                  e.stopPropagation();
                  onSelectTag(tag);
                }
              }}
              className={`h-6 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs leading-5 backdrop-blur-[7px] ${
                onSelectTag ? "hover:scale-105 active:scale-95 cursor-pointer pointer-events-auto" : ""
              }`}
              style={{
                background: t.chipBg,
                borderColor: hi !== null && icons[hi]?.label === tag ? t.focus : t.chipBorder,
                color: hi !== null && icons[hi]?.label === tag ? t.ink : t.chipInk,
                transition: "border-color .25s ease, color .25s ease, transform .15s ease",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {showPill && (
          <span
            className="absolute bottom-3.5 right-3.5 flex h-[34px] items-center gap-1.5 rounded-full border px-1.5"
            style={{ background: t.pillBg, borderColor: t.pillBorder }}
            aria-hidden="true"
          >
            {icons.map((icon, i) => (
              <span key={i} className="block h-[22px] w-[22px] overflow-hidden rounded-[7px]">
                <span className="grid h-full w-full place-items-center [&_svg]:h-[60%] [&_svg]:w-[60%]" style={{ background: icon.src ? undefined : icon.background }}>
                  {icon.src ? <img src={icon.src} alt="" className="h-full w-full object-cover" /> : icon.node}
                </span>
              </span>
            ))}
          </span>
        )}
      </div>
    </div>
  );
}

export default IconFolder;
