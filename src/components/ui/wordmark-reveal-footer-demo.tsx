"use client";

import * as React from "react";
import { WordmarkRevealFooter } from "@/components/ui/wordmark-reveal-footer";
import type { FooterColumn, FooterOffice, FooterSocial } from "@/components/ui/wordmark-reveal-footer";

const COLUMNS: FooterColumn[] = [
  { title: "Product", links: [{ label: "Overview", href: "#" }, { label: "Pricing", href: "#" }, { label: "Changelog", href: "#" }, { label: "Download", href: "#" }] },
  { title: "Company", links: [{ label: "About", href: "#" }, { label: "Careers", href: "#" }, { label: "Press", href: "#" }, { label: "Contact", href: "#" }] },
  { title: "Resources", links: [{ label: "Docs", href: "#" }, { label: "Guides", href: "#" }, { label: "Community", href: "#" }, { label: "Status", href: "#" }] },
];

const OFFICES: FooterOffice[] = [
  { city: "Seoul", timeZone: "Asia/Seoul" },
  { city: "San Francisco", timeZone: "America/Los_Angeles" },
  { city: "Berlin", timeZone: "Europe/Berlin" },
];

const SOCIALS: FooterSocial[] = [
  { label: "Alder on X", href: "#", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M4 4l16 16M20 4L4 20" /></svg> },
  { label: "Alder on GitHub", href: "#", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg> },
  { label: "Alder on LinkedIn", href: "#", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg> },
];

const MARK = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M10.9 3.6a1.3 1.3 0 0 1 2.2 0l8.2 15.8c.5.9-.2 2.1-1.2 2.1h-3.1a1.3 1.3 0 0 1-1.2-.8L12 11.7l-3.8 9a1.3 1.3 0 0 1-1.2.8H3.9c-1 0-1.7-1.2-1.2-2.1Z" />
  </svg>
);

const REPLAY_AT = 4400;

function readParams() {
  if (typeof window === "undefined") return new URLSearchParams();
  return new URLSearchParams(window.location.search);
}

export default function Demo({ autoplay = true }: { autoplay?: boolean }) {
  const params = React.useMemo(readParams, []);
  const manual = params.get("manual") === "1";
  const inView = params.get("inview") === "1";
  const tone = params.get("tone");
  const wordmark = params.get("wordmark") || "ALDER";
  const [revealed, setRevealed] = React.useState(params.get("revealed") === "1");
  const [ends, setEnds] = React.useState(0);
  const [subscribed, setSubscribed] = React.useState("");
  const stopped = React.useRef(false);

  React.useEffect(() => {
    if (!manual) return;
    const apply = () => {
      if (window.location.hash === "#revealed") setRevealed(true);
      if (window.location.hash === "#hidden") setRevealed(false);
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, [manual]);

  React.useEffect(() => {
    if (manual || inView) return;
    const frame = window.requestAnimationFrame(() => setRevealed(true));
    return () => window.cancelAnimationFrame(frame);
  }, [manual, inView]);

  React.useEffect(() => {
    if (!autoplay || manual || inView) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;
    let rise = 0;
    const drop = window.setTimeout(() => {
      if (stopped.current) return;
      setRevealed(false);
      rise = window.setTimeout(() => { if (!stopped.current) setRevealed(true); }, 460);
    }, REPLAY_AT);
    return () => { window.clearTimeout(drop); window.clearTimeout(rise); };
  }, [autoplay, manual, inView]);

  const stop = () => { stopped.current = true; };

  const footer = (
    <WordmarkRevealFooter
      wordmark={wordmark}
      brand={{ name: "Alder", mark: MARK, blurb: "Alder is the design workspace for teams who ship. Design, prototype and hand off from one file." }}
      columns={COLUMNS}
      status={{ label: tone === "down" ? "Partial outage: file sync" : tone === "warn" ? "Degraded performance: exports" : "All systems operational", tone: tone === "down" ? "down" : tone === "warn" ? "warn" : "ok" }}
      offices={OFFICES}
      newsletter={{ placeholder: "you@company.com", onSubscribe: (email) => new Promise((resolve) => { window.setTimeout(() => { setSubscribed(email); resolve(undefined); }, 500); }) }}
      socials={SOCIALS}
      legal={[{ label: "Privacy", href: "#" }, { label: "Terms", href: "#" }]}
      reflection={params.get("reflection") !== "0"}
      reveal={inView ? "inView" : manual ? "manual" : "mount"}
      revealed={inView ? undefined : revealed}
      onRevealEnd={() => setEnds((count) => count + 1)}
      className="border-t border-border"
    />
  );

  if (inView) {
    return (
      <main data-demo data-reveal-ends={ends} data-subscribed={subscribed} className="w-full bg-background text-foreground">
        <section className="flex h-[140vh] items-end px-6 pb-16">
          <p className="max-w-md text-sm text-muted-foreground">Scroll to the end of the page. The footer reveals itself when half of it is on screen.</p>
        </section>
        {footer}
      </main>
    );
  }

  return (
    <main
      data-demo
      data-reveal-ends={ends}
      data-subscribed={subscribed}
      onPointerDownCapture={stop}
      onKeyDownCapture={stop}
      onFocusCapture={stop}
      className="flex h-[min(100svh,900px)] w-full flex-col justify-end overflow-hidden bg-background text-foreground"
    >
      {footer}
    </main>
  );
}
