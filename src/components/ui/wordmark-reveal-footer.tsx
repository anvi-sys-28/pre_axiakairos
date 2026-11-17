"use client";

import * as React from "react";
import { Check, LoaderCircle } from "lucide-react";

type FooterProps = React.ComponentProps<"footer">;

export type FooterLink = { label: string; href: string };

export type FooterColumn = { title: string; links: FooterLink[] };

export type FooterOffice = { city: string; timeZone: string };

export type FooterSocial = { label: string; href: string; icon: React.ReactNode };

export type FooterStatus = { label: string; tone?: "ok" | "warn" | "down" };

export type FooterNewsletter = { placeholder?: string; label?: string; buttonLabel?: string; doneLabel?: string; onSubscribe: (email: string) => unknown };

export type WordmarkRevealFooterProps = FooterProps & {
  wordmark: string;
  brand?: { name: string; mark?: React.ReactNode; blurb: string };
  columns: FooterColumn[];
  status?: FooterStatus;
  offices?: FooterOffice[];
  newsletter?: FooterNewsletter;
  socials?: FooterSocial[];
  legal?: FooterLink[];
  reflection?: boolean;
  reveal?: "mount" | "inView" | "manual";
  revealed?: boolean;
  defaultRevealed?: boolean;
  onRevealEnd?: () => void;
  ref?: FooterProps["ref"];
};

const EASE = "cubic-bezier(0.2, 0.8, 0.2, 1)";
const EASE_IN = "cubic-bezier(0.55, 0, 0.8, 0.4)";
export const WORDMARK_TIMING = { lead: 300, stagger: 70, letter: 620, reflection: 400, drop: 400, statusAfter: 500, clocksAfter: 300 } as const;
const BASE_FONT = "clamp(72px, 15vw, 220px)";
const TONE = { ok: "bg-chart-2", warn: "bg-chart-4", down: "bg-destructive" } as const;

function useReducedMotion() {
  const [reduced, setReduced] = React.useState(true);
  React.useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return reduced;
}

export function formatOfficeTime(date: Date, timeZone: string) {
  try {
    return new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone }).format(date);
  } catch {
    return "--:--";
  }
}

function canAnimate(node: Element | null): node is HTMLElement {
  return !!node && typeof (node as HTMLElement).animate === "function";
}

export function WordmarkRevealFooter({
  wordmark,
  brand,
  columns,
  status,
  offices,
  newsletter,
  socials,
  legal,
  reflection = true,
  reveal = "inView",
  revealed,
  defaultRevealed = false,
  onRevealEnd,
  className = "",
  ref,
  ...rest
}: WordmarkRevealFooterProps) {
  const reduced = useReducedMotion();
  const baseId = React.useId();
  const [localRevealed, setLocalRevealed] = React.useState(defaultRevealed);
  const isRevealed = revealed ?? localRevealed;
  const controlled = revealed !== undefined;
  const [lit, setLit] = React.useState(false);
  const [hover, setHover] = React.useState(-1);
  const [metrics, setMetrics] = React.useState({ descent: 0, fit: 0 });
  const [now, setNow] = React.useState(0);
  const [mailStatus, setMailStatus] = React.useState("idle" as "idle" | "invalid" | "sending" | "done");
  const rootRef = React.useRef(null as HTMLElement | null);
  const wordmarkRef = React.useRef(null as HTMLDivElement | null);
  const rowRef = React.useRef(null as HTMLDivElement | null);
  const probeRef = React.useRef(null as HTMLSpanElement | null);
  const reflectionRef = React.useRef(null as HTMLDivElement | null);
  const letterRefs = React.useRef([] as (HTMLSpanElement | null)[]);
  const dotRef = React.useRef(null as HTMLSpanElement | null);
  const haloRef = React.useRef(null as HTMLSpanElement | null);
  const labelRef = React.useRef(null as HTMLSpanElement | null);
  const officeRefs = React.useRef([] as (HTMLSpanElement | null)[]);
  const emailRef = React.useRef(null as HTMLInputElement | null);
  const animations = React.useRef([] as Animation[]);
  const timers = React.useRef([] as number[]);
  const wasRevealed = React.useRef(null as boolean | null);
  const onRevealEndRef = React.useRef(onRevealEnd);
  onRevealEndRef.current = onRevealEnd;

  const letters = React.useMemo(() => [...wordmark], [wordmark]);
  const lettersEnd = WORDMARK_TIMING.lead + Math.max(0, letters.length - 1) * WORDMARK_TIMING.stagger + WORDMARK_TIMING.letter;

  React.useEffect(() => {
    if (controlled || reveal === "manual") return;
    if (reveal === "mount") { setLocalRevealed(true); return; }
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === "undefined") { setLocalRevealed(true); return; }
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const viewport = entry.rootBounds?.height ?? window.innerHeight;
        if (entry.isIntersecting && (entry.intersectionRatio >= 0.5 || entry.intersectionRect.height >= viewport * 0.5)) {
          setLocalRevealed(true);
          observer.disconnect();
        }
      }
    }, { threshold: [0, 0.25, 0.5, 0.75, 1] });
    observer.observe(root);
    return () => observer.disconnect();
  }, [controlled, reveal]);

  // Typography metrics: shrink long wordmarks to the container, and find the baseline so the floor line and the reflection meet the glyphs.
  React.useLayoutEffect(() => {
    const wrapper = wordmarkRef.current;
    const row = rowRef.current;
    const probe = probeRef.current;
    if (!wrapper || !row || !probe) return;
    const measure = () => {
      wrapper.style.fontSize = BASE_FONT;
      const available = wrapper.clientWidth;
      const needed = row.scrollWidth;
      const basePx = Number.parseFloat(getComputedStyle(wrapper).fontSize) || 72;
      const fit = available > 0 && needed > available ? Math.max(24, Math.floor(basePx * (available / needed) * 10) / 10) : 0;
      if (fit) wrapper.style.fontSize = `${fit}px`;
      const rowBox = row.getBoundingClientRect();
      const probeBox = probe.getBoundingClientRect();
      const descent = Math.max(0, Math.round((rowBox.bottom - probeBox.top) * 10) / 10);
      setMetrics((previous) => (previous.descent === descent && previous.fit === fit ? previous : { descent, fit }));
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => measure());
    observer.observe(wrapper, { box: "border-box" });
    return () => observer.disconnect();
  }, [wordmark]);

  // The reveal sequence: letters rise through the floor line, the reflection switches on, then the status band lights up.
  React.useLayoutEffect(() => {
    const previous = wasRevealed.current;
    wasRevealed.current = isRevealed;
    if (previous === isRevealed) return;
    for (const animation of animations.current) animation.cancel();
    animations.current = [];
    for (const timer of timers.current) window.clearTimeout(timer);
    timers.current = [];
    const nodes = letterRefs.current.slice(0, letters.length);
    const mirror = reflectionRef.current;
    const motion = !reduced && nodes.every((node) => canAnimate(node));
    if (isRevealed) {
      if (!motion) {
        setLit(true);
        timers.current.push(window.setTimeout(() => onRevealEndRef.current?.(), 0));
        return;
      }
      const risers = nodes.map((node, i) => (node as HTMLElement).animate(
        [{ transform: "translateY(110%)" }, { transform: "translateY(0%)" }],
        { duration: WORDMARK_TIMING.letter, delay: WORDMARK_TIMING.lead + i * WORDMARK_TIMING.stagger, easing: EASE, fill: "backwards" },
      ));
      animations.current.push(...risers);
      if (canAnimate(mirror)) {
        const target = getComputedStyle(mirror).opacity;
        animations.current.push(mirror.animate([{ opacity: 0 }, { opacity: target }], { duration: WORDMARK_TIMING.reflection, delay: lettersEnd + 100, easing: "ease-out", fill: "backwards" }));
      }
      Promise.all(risers.map((animation) => animation.finished)).then(() => onRevealEndRef.current?.(), () => undefined);
      timers.current.push(window.setTimeout(() => setLit(true), lettersEnd + WORDMARK_TIMING.statusAfter));
      return;
    }
    if (previous === null || !motion) return;
    const last = nodes.length - 1;
    nodes.forEach((node, i) => {
      animations.current.push((node as HTMLElement).animate(
        [{ transform: "translateY(0%)" }, { transform: "translateY(110%)" }],
        { duration: WORDMARK_TIMING.drop, delay: (last - i) * 20, easing: EASE_IN, fill: "backwards" },
      ));
    });
    if (canAnimate(mirror)) {
      const from = mirror.getAnimations().length ? "0" : getComputedStyle(mirror).opacity;
      animations.current.push(mirror.animate([{ opacity: from === "0" ? 0 : from }, { opacity: 0 }], { duration: 200, easing: "ease-out", fill: "backwards" }));
    }
  }, [isRevealed, reduced, letters.length, lettersEnd]);

  React.useLayoutEffect(() => {
    if (!lit) return;
    const dot = dotRef.current;
    const halo = haloRef.current;
    const label = labelRef.current;
    const clocks = officeRefs.current.filter((node): node is HTMLSpanElement => !!node);
    if (reduced || !canAnimate(dot)) return;
    const local = [] as Animation[];
    local.push(dot.animate([{ transform: "scale(0)" }, { transform: "scale(1)" }], { duration: 200, easing: EASE, fill: "backwards" }));
    if (canAnimate(label)) local.push(label.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 320, delay: 120, easing: "ease-out", fill: "backwards" }));
    clocks.forEach((clock, i) => {
      if (!canAnimate(clock)) return;
      local.push(clock.animate([{ transform: "translateY(100%)" }, { transform: "translateY(0%)" }], { duration: 380, delay: WORDMARK_TIMING.clocksAfter + i * 120, easing: EASE, fill: "backwards" }));
    });
    if (canAnimate(halo)) {
      local.push(halo.animate(
        [{ transform: "scale(1)", opacity: 0.55 }, { transform: "scale(2.1)", opacity: 0 }],
        { duration: 2400, delay: 400, iterations: Number.POSITIVE_INFINITY, easing: "ease-out" },
      ));
    }
    return () => { for (const animation of local) animation.cancel(); };
  }, [lit, reduced]);

  const officeKey = (offices ?? []).map((office) => office.timeZone).join("|");
  React.useEffect(() => {
    if (!officeKey) return;
    let timer = 0;
    const tick = () => {
      setNow(Date.now());
      timer = window.setTimeout(tick, 60_000 - (Date.now() % 60_000) + 20);
    };
    tick();
    return () => window.clearTimeout(timer);
  }, [officeKey]);

  React.useEffect(() => () => {
    for (const animation of animations.current) animation.cancel();
    for (const timer of timers.current) window.clearTimeout(timer);
  }, []);

  const glint = (index: number) => {
    setHover(index);
    const glyph = letterRefs.current[index]?.firstElementChild ?? null;
    if (reduced || !canAnimate(glyph) || glyph.getAnimations().length) return;
    glyph.animate([{ backgroundPosition: "0% 0%" }, { backgroundPosition: "100% 0%" }], { duration: 640, easing: "cubic-bezier(0.4, 0, 0.2, 1)" });
  };

  const subscribe = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newsletter || mailStatus === "sending" || mailStatus === "done") return;
    const input = emailRef.current;
    const email = input?.value.trim() ?? "";
    if (!input || !input.checkValidity() || !email) { setMailStatus("invalid"); return; }
    setMailStatus("sending");
    try { await newsletter.onSubscribe(email); setMailStatus("done"); } catch { setMailStatus("idle"); }
  };

  const tone = status?.tone ?? "ok";
  const descent = metrics.descent;
  const fontSize = metrics.fit ? `${metrics.fit}px` : BASE_FONT;
  const date = now ? new Date(now) : null;

  return (
    <footer
      {...rest}
      ref={(node) => {
        rootRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      data-slot="wordmark-reveal-footer"
      data-revealed={isRevealed ? "true" : "false"}
      data-lit={lit ? "true" : "false"}
      data-reveal={reveal}
      className={`@container relative flex w-full flex-col bg-background text-foreground ${className}`}
    >
      <div className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col px-6 pt-8 @3xl:px-10 @3xl:pt-10">
        <div className="grid gap-8 @2xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] @2xl:gap-10">
          {brand && (
            <div data-brand className="max-w-[340px]">
              <div className="flex items-center gap-2.5">
                {brand.mark && <span aria-hidden="true" className="inline-flex size-7 items-center justify-center text-foreground [&_svg]:size-7">{brand.mark}</span>}
                <span className="text-[15px] font-semibold tracking-tight">{brand.name}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{brand.blurb}</p>
              {newsletter && (
                <form data-newsletter data-status={mailStatus} noValidate onSubmit={subscribe} className="mt-4 flex items-stretch gap-2">
                  <div className="min-w-0 flex-1">
                    <label htmlFor={`${baseId}-email`} className="sr-only">{newsletter.label ?? "Email address"}</label>
                    <input
                      ref={emailRef}
                      id={`${baseId}-email`}
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder={newsletter.placeholder ?? "you@company.com"}
                      aria-invalid={mailStatus === "invalid" ? "true" : undefined}
                      aria-describedby={mailStatus === "invalid" ? `${baseId}-email-error` : undefined}
                      disabled={mailStatus === "done" || mailStatus === "sending"}
                      onChange={() => { if (mailStatus === "invalid") setMailStatus("idle"); }}
                      className={`h-9 w-full min-w-0 rounded-lg border bg-background px-3 text-sm outline-none transition-colors motion-reduce:transition-none placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-70 ${mailStatus === "invalid" ? "border-destructive" : "border-border"}`}
                    />
                    {mailStatus === "invalid" && <p id={`${baseId}-email-error`} className="mt-1 text-xs text-destructive">Enter a valid email address.</p>}
                  </div>
                  <button
                    type="submit"
                    data-subscribe
                    aria-label={mailStatus === "done" ? (newsletter.doneLabel ?? "Subscribed") : undefined}
                    className={`inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg px-3.5 text-sm font-medium outline-none transition-[background-color,color,width] duration-300 motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${mailStatus === "done" ? "bg-muted text-foreground" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}
                  >
                    {mailStatus === "sending" && <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />}
                    {mailStatus === "done" ? <Check className="size-4 text-chart-2" aria-hidden="true" /> : null}
                    {mailStatus === "done" ? (newsletter.doneLabel ?? "Subscribed") : (newsletter.buttonLabel ?? "Subscribe")}
                  </button>
                  <p className="sr-only" aria-live="polite">{mailStatus === "done" ? (newsletter.doneLabel ?? "Subscribed") : ""}</p>
                </form>
              )}
            </div>
          )}
          <div className={`grid gap-6 ${columns.length >= 3 ? "grid-cols-3" : columns.length === 2 ? "grid-cols-2" : "grid-cols-1"}`}>
            {columns.map((column) => (
              <nav key={column.title} aria-label={column.title} data-column>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{column.title}</p>
                <ul className="mt-3 space-y-2">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className="inline-block rounded-sm text-sm text-foreground/80 outline-none transition-colors motion-reduce:transition-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">{link.label}</a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {(status || (offices && offices.length > 0)) && (
          <div data-band className="mt-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-border py-3 text-xs @3xl:mt-10">
            {status && (
              <p role="status" data-status-indicator data-tone={tone} className="flex items-center gap-2.5 text-foreground/80">
                <span className="relative inline-flex size-2.5 items-center justify-center">
                  <span ref={haloRef} aria-hidden="true" data-halo className={`absolute inset-0 rounded-full ${TONE[tone]} ${lit && !reduced ? "" : "opacity-0"}`} />
                  <span ref={dotRef} data-dot className={`relative size-2.5 rounded-full ${TONE[tone]}`} style={{ transform: lit ? "scale(1)" : "scale(0)" }} />
                </span>
                <span ref={labelRef} style={{ opacity: lit ? 1 : 0 }}>{lit ? status.label : ""}</span>
              </p>
            )}
            {offices && offices.length > 0 && (
              <ul data-offices aria-label="Office hours" className="flex flex-wrap items-center gap-x-4 gap-y-1 tabular-nums text-muted-foreground">
                {offices.map((office, i) => (
                  <li key={office.timeZone + office.city} data-office={office.timeZone} className="overflow-hidden leading-5">
                    <span ref={(node) => { officeRefs.current[i] = node; }} className="inline-flex items-baseline gap-1.5 will-change-transform" style={{ transform: lit ? "translateY(0%)" : "translateY(100%)" }}>
                      <span>{office.city}</span>
                      <span data-office-time className="font-medium text-foreground/80">{date ? formatOfficeTime(date, office.timeZone) : ""}</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div
          ref={wordmarkRef}
          data-wordmark
          role="img"
          aria-label={wordmark}
          onPointerLeave={() => setHover(-1)}
          className="relative mt-auto select-none pt-8 font-extrabold @3xl:pt-12 leading-none tracking-[-0.04em] [--glint:color-mix(in_oklch,var(--color-foreground)_42%,var(--color-background))] [--wm:var(--color-foreground)] dark:[--glint:var(--color-foreground)] dark:[--wm:color-mix(in_oklch,var(--color-foreground)_90%,transparent)]"
          style={{
            fontSize,
            ['--wm' as string]: 'var(--color-foreground, var(--foreground, #ffffff))',
            ['--glint' as string]: 'var(--color-foreground, #ffffff)',
          } as React.CSSProperties}
        >
          <div ref={rowRef} data-row className="relative whitespace-nowrap" style={{ clipPath: `inset(-100% 0 ${descent}px 0)`, marginBottom: `${-descent}px` }}>
            {letters.map((letter, i) => (
              <span
                key={`${i}-${letter}`}
                ref={(node) => { letterRefs.current[i] = node; }}
                data-letter={i}
                aria-hidden="true"
                onPointerEnter={() => glint(i)}
                className="inline-block will-change-transform"
                style={{ transform: isRevealed ? "translateY(0%)" : "translateY(110%)" }}
              >
                <span
                  data-glyph
                  className="inline-block transition-transform duration-150 ease-out will-change-transform motion-reduce:transition-none"
                  style={{
                    transform: hover === i ? "translateY(-6px)" : "translateY(0px)",
                    color: "var(--wm)",
                    backgroundImage: "linear-gradient(105deg, var(--wm) 0%, var(--wm) 46%, var(--glint) 50%, var(--wm) 54%, var(--wm) 100%)",
                    backgroundSize: "250% 100%",
                    backgroundPosition: "0% 0%",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {letter === " " ? " " : letter}
                </span>
              </span>
            ))}
            <span ref={probeRef} aria-hidden="true" data-baseline className="inline-block h-0 w-0 align-baseline" />
          </div>
          <div data-floor aria-hidden="true" className="relative h-px w-full bg-border" />
          {reflection && (
            <div
              ref={reflectionRef}
              data-reflection
              aria-hidden="true"
              className="relative overflow-hidden opacity-[0.14] dark:opacity-10"
              style={{ height: "0.42em", maskImage: "linear-gradient(to bottom, black 0%, transparent 92%)", WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 92%)", opacity: isRevealed ? undefined : 0 }}
            >
              <div data-mirror-row className="whitespace-nowrap" style={{ transform: "scaleY(-1)", marginTop: `${-descent - 1}px` }}>
                {letters.map((letter, i) => (
                  <span
                    key={`${i}-${letter}`}
                    data-mirror={i}
                    className="inline-block transition-transform duration-150 ease-out will-change-transform motion-reduce:transition-none"
                    style={{ transform: hover === i ? "translateY(-6px)" : "translateY(0px)", color: "var(--wm)", filter: "blur(1px)" }}
                  >
                    {letter === " " ? " " : letter}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div data-legal className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-4 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            {brand && <span>© {new Date().getFullYear()} {brand.name}</span>}
            {legal?.map((link) => (
              <a key={link.label} href={link.href} className="rounded-sm outline-none transition-colors motion-reduce:transition-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">{link.label}</a>
            ))}
          </div>
          {socials && socials.length > 0 && (
            <ul aria-label="Social links" className="flex items-center gap-1">
              {socials.map((social) => (
                <li key={social.label}>
                  <a href={social.href} aria-label={social.label} className="inline-flex size-8 items-center justify-center rounded-lg outline-none transition-colors motion-reduce:transition-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-4">{social.icon}</a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
}

export default WordmarkRevealFooter;