import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Menu, X, ExternalLink, Sun, Moon } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { Footer } from './Footer';
import { Header } from './Header';
import { AboutGenAISection } from './AboutGenAISection';
import { IndustriesWeServeSection } from './IndustriesWeServeSection';
import { siteContent } from '../content/site';
import '@/styles/halden.css';

function parseHex(hex: string): [number, number, number] {
  if (hex.startsWith('rgb')) {
    const m = hex.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (m) return [parseInt(m[1]), parseInt(m[2]), parseInt(m[3])];
  }
  const c = hex.replace('#', '');
  return [
    parseInt(c.slice(0, 2), 16),
    parseInt(c.slice(2, 4), 16),
    parseInt(c.slice(4, 6), 16),
  ];
}

function lerpColor(c1: string, c2: string, u: number): string {
  const [r1, g1, b1] = parseHex(c1);
  const [r2, g2, b2] = parseHex(c2);
  const r = Math.round(r1 + (r2 - r1) * u);
  const g = Math.round(g1 + (g2 - g1) * u);
  const b = Math.round(b1 + (b2 - b1) * u);
  return `rgb(${r},${g},${b})`;
}

function smoothstep01(u: number): number {
  if (u <= 0) return 0;
  if (u >= 1) return 1;
  return u * u * (3 - 2 * u);
}

const keys = [
  { q: 0.00, tip: 0.30, half: 0.34, soft: 0.22 },
  { q: 0.03, tip: 0.45, half: 0.38, soft: 0.26 },
  { q: 0.08, tip: 0.65, half: 0.38, soft: 0.22 },
  { q: 0.18, tip: 0.80, half: 0.38, soft: 0.22 },
  { q: 0.40, tip: 0.95, half: 0.38, soft: 0.19 },
  { q: 0.66, tip: 1.05, half: 0.46, soft: 0.16 },
  { q: 0.87, tip: 1.05, half: 0.66, soft: 0.13 },
  { q: 1.15, tip: 1.10, half: 0.90, soft: 0.10 },
  { q: 1.43, tip: 1.30, half: 1.60, soft: 0.10 },
  { q: 1.80, tip: 2.40, half: 3.00, soft: 0.10 },
];

function getTargets(q: number) {
  if (q <= keys[0].q) return { tip: keys[0].tip, half: keys[0].half, soft: keys[0].soft };
  const last = keys[keys.length - 1];
  if (q >= last.q) return { tip: last.tip, half: last.half, soft: last.soft };
  for (let i = 0; i < keys.length - 1; i++) {
    const k1 = keys[i];
    const k2 = keys[i + 1];
    if (q >= k1.q && q <= k2.q) {
      const r = (q - k1.q) / (k2.q - k1.q);
      return {
        tip: k1.tip + (k2.tip - k1.tip) * r,
        half: k1.half + (k2.half - k1.half) * r,
        soft: k1.soft + (k2.soft - k1.soft) * r,
      };
    }
  }
  return { tip: last.tip, half: last.half, soft: last.soft };
}

function splitChars(el: HTMLElement): HTMLElement[] {
  const rawNodes = Array.from(el.childNodes);
  el.innerHTML = '';
  const charSpans: HTMLElement[] = [];

  function processNode(node: ChildNode, isHl: boolean) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || '';
      const parts = text.split(/(\s+)/);
      parts.forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          el.appendChild(document.createTextNode(part));
        } else {
          const wordWrap = document.createElement('span');
          wordWrap.className = 'halden-word-wrap';
          for (let i = 0; i < part.length; i++) {
            const ch = document.createElement('span');
            ch.className = 'halden-ch';
            ch.textContent = part[i];
            if (isHl) ch.setAttribute('data-hl', '1');
            wordWrap.appendChild(ch);
            charSpans.push(ch);
          }
          el.appendChild(wordWrap);
        }
      });
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const elNode = node as HTMLElement;
      if (elNode.tagName.toLowerCase() === 'br') {
        el.appendChild(document.createElement('br'));
        el.appendChild(document.createTextNode(' '));
      } else if (elNode.classList.contains('hl')) {
        Array.from(elNode.childNodes).forEach((child) => processNode(child, true));
      } else {
        Array.from(elNode.childNodes).forEach((child) => processNode(child, isHl));
      }
    }
  }

  rawNodes.forEach((node) => processNode(node, false));
  return charSpans;
}

function paint(
  chars: HTMLElement[],
  p: number,
  spread: number,
  final: string,
  accent: string,
  ghost: string
) {
  const n = chars.length;
  if (n === 0) return;

  // Fully revealed clamp - guarantees 100% crisp rendering with no residual blur or fade
  if (p >= 0.999) {
    for (let i = 0; i < n; i++) {
      const el = chars[i];
      const isFlagged = el.getAttribute('data-hl') === '1';
      el.style.color = isFlagged ? '#5b7cf0' : final;
      el.style.filter = 'none';
      el.style.opacity = '1';
    }
    return;
  }

  // Fully hidden clamp
  if (p <= 0.001) {
    for (let i = 0; i < n; i++) {
      const el = chars[i];
      el.style.color = ghost;
      el.style.filter = 'blur(1.5px)';
      el.style.opacity = '0';
    }
    return;
  }

  // Progressive character sweep: spreads reveal across characters so all complete at p = 1
  for (let i = 0; i < n; i++) {
    const el = chars[i];
    const isFlagged = el.getAttribute('data-hl') === '1';
    const effectiveFinal = isFlagged ? '#5b7cf0' : final;
    const charNorm = n > 1 ? i / (n - 1) : 0;
    const effP = p * (1 + spread);
    const d = (effP - charNorm) / spread;

    if (d <= 0) {
      el.style.color = ghost;
      el.style.filter = 'blur(1.5px)';
      el.style.opacity = '0';
    } else if (d < 1) {
      const u = smoothstep01(d);
      el.style.color = lerpColor(accent, effectiveFinal, u);
      el.style.filter = `blur(${((1 - u) * 1.5).toFixed(2)}px)`;
      el.style.opacity = `${(0.25 + 0.75 * u).toFixed(2)}`;
    } else {
      el.style.color = effectiveFinal;
      el.style.filter = 'none';
      el.style.opacity = '1';
    }
  }
}

export const HaldenLanding: React.FC = () => {
  const location = useLocation();
  const [isAboutLayered, setIsAboutLayered] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const stmtRef = useRef<HTMLParagraphElement>(null);
  const isDarkRef = useRef(false);

  const heroFadeRef = useRef<HTMLDivElement>(null);
  const atmoDarkRef = useRef<HTMLDivElement>(null);

  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof document !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored === 'dark' || stored === 'light') return stored === 'dark';
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  const toggleTheme = () => {
    const nextDark = !document.documentElement.classList.contains('dark');
    setIsDark(nextDark);
    isDarkRef.current = nextDark;
    document.documentElement.classList.toggle('dark', nextDark);
    document.body.classList.toggle('dark', nextDark);
    try {
      localStorage.setItem('theme', nextDark ? 'dark' : 'light');
    } catch {}
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: nextDark ? 'dark' : 'light' } }));
  };

  // Sync theme changes from documentElement class 'dark' and custom events
  useEffect(() => {
    const updateTheme = () => {
      const dark = document.documentElement.classList.contains('dark');
      isDarkRef.current = dark;
      setIsDark(dark);
    };
    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    const handleThemeEvent = (e: any) => {
      const dark = e.detail?.theme === 'dark';
      isDarkRef.current = dark;
      setIsDark(dark);
    };
    window.addEventListener('themechange', handleThemeEvent);

    return () => {
      observer.disconnect();
      window.removeEventListener('themechange', handleThemeEvent);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const navEl = navRef.current;
    const h1El = h1Ref.current;
    const descEl = descRef.current;
    const stmtEl = stmtRef.current;
    const container = containerRef.current;

    if (!canvas || !navEl || !h1El || !stmtEl) {
      return;
    }

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const W = 240;
    const H = 150;
    const imgData = ctx.createImageData(W, H);
    const data32 = new Uint32Array(imgData.data.buffer);

    const HEADLINES = [
      'Strategy that<br />moves you <span class="hl">forward</span>.',
      'Smart generative AI<br />built for <span class="hl">business</span>.',
      'Execution that<br />defines <span class="hl">excellence</span>.',
    ];
    const DESCRIPTIONS = [
      'We help forward-thinking organizations navigate complexity, make confident decisions, and architect lasting digital progress.',
      'Pioneering intelligent digital foundations and enterprise generative AI solutions to automate complex workflows and accelerate sustainable growth.',
      'Connecting bold strategic vision with mission-critical delivery, empowering enterprise teams to lead industry disruption.',
    ];
    let headlineIndex = 0;
    h1El.innerHTML = HEADLINES[0];
    if (descEl) descEl.textContent = DESCRIPTIONS[0];
    let h1Chars = splitChars(h1El);
    const stmtChars = splitChars(stmtEl);

    // Initial paint respecting current theme
    const isDarkInit = document.documentElement.classList.contains('dark');
    const initFinal = isDarkInit ? '#ffffff' : '#072a2a';
    const initAccent = isDarkInit ? '#2dd4bf' : '#0c7075';
    const initGhost = isDarkInit ? '#04181a' : '#ffffff';

    paint(h1Chars, 0, 0.35, initFinal, initAccent, initGhost);
    // Statement text begins hidden on white preloader layer with dark typography
    const initStmtFinal = '#111827';
    const initStmtAccent = '#0d9488';
    const initStmtGhost = '#ffffff';
    paint(stmtChars, 0, 0.16, initStmtFinal, initStmtAccent, initStmtGhost);

    // Section 2 Reveal Animation & Scroll-Lock State
    let stmtAnimActive = false;
    let stmtAnimDone = false;
    let stmtStartTime: number | null = null;

    function triggerStatementReveal() {
      if (stmtAnimActive || stmtAnimDone) return;
      stmtAnimActive = true;
      stmtStartTime = performance.now();

      // Lock scrolling so user experiences the full 5-second reveal sequence
      document.body.style.overflow = 'hidden';

      const targetEl = document.getElementById('scene2Wrap') || document.getElementById('statement') || document.getElementById('split');
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    function finishStatement() {
      stmtAnimActive = false;
      stmtAnimDone = true;
      document.body.style.overflow = '';
      setIsAboutLayered(true);
      const secEl = document.getElementById('statement');
      if (secEl) {
        secEl.style.backgroundColor = '#141414';
        secEl.classList.add('is-dissolving');
        setTimeout(() => {
          secEl.classList.add('is-completed');
        }, 700);
      }
    }

    (window as any).__finishStatement = finishStatement;

    let curTip = 0.30;
    let curHalf = 0.34;
    let curSoft = 0.22;
    let lastTime = performance.now();

    function renderCanvas(t: number) {
      if (!ctx) return;
      const isDark = isDarkRef.current || document.documentElement.classList.contains('dark');
      const dt = Math.min(0.05, (t - lastTime) / 1000);
      lastTime = t;

      const ih = Math.max(window.innerHeight, 1);
      const q = window.scrollY / ih;
      const target = getTargets(q);

      const blend = 1 - Math.exp(-dt * 12);
      curTip += (target.tip - curTip) * blend;
      curHalf += (target.half - curHalf) * blend;
      curSoft += (target.soft - curSoft) * blend;

      const scrollShift = (curTip - 0.30) * 1.3;

      for (let y = 0; y < H; y++) {
        const yn = y / (H - 1);
        const rowOffset = y * W;

        for (let x = 0; x < W; x++) {
          const xn = x / (W - 1);

          // Asymmetric crest line matching reference design (media_1794207005471_5cb104c1.jpg):
          // Left side: crest stays low (y ≈ 0.60 - 0.63), keeping the headline & description 100% pure white & bright
          // Right side: crest sweeps gracefully up to y ≈ 0.28 under the robot mascot & rolling partner columns
          let crestY: number;
          if (xn < 0.42) {
            const u = (0.42 - xn) / 0.42;
            crestY = 0.63 - 0.04 * u;
          } else {
            const u = (xn - 0.42) / 0.58;
            const ease = u * (2 - u);
            crestY = 0.63 - 0.35 * ease;
          }

          const targetY = crestY + scrollShift;
          const deltaY = yn - targetY;

          let r: number, gCol: number, b: number;
          if (!isDark) {
            if (deltaY < 0) {
              // Sky region above crest: Clean white fading into soft luminous cyan mist
              if (deltaY < -0.16) {
                r = 255;
                gCol = 255;
                b = 255;
              } else {
                const m = smoothstep01((deltaY + 0.16) / 0.16);
                r = Math.round(255 + (180 - 255) * m);
                gCol = Math.round(255 + (245 - 255) * m);
                b = Math.round(255 + (238 - 255) * m);
              }
            } else {
              // Hill / bowl region below crest:
              // Start at radiant glowing cyan rim (#2dd4bf), then smoothly blend into oceanic teal
              const d = Math.min(1, deltaY / 0.40);
              const m = smoothstep01(d);

              // On the right side under logos: deep oceanic teal (#073b3a)
              // On the left side: kept airy, light & soft seafoam (#14b8a6) so it never dominates
              const rightWeight = smoothstep01((xn - 0.20) / 0.50);

              const targetR = Math.round(18 - 11 * rightWeight); // 18 down to 7
              const targetG = Math.round(155 - 96 * rightWeight); // 155 down to 59
              const targetB = Math.round(145 - 87 * rightWeight); // 145 down to 58

              const rimR = 45;
              const rimG = 212;
              const rimB = 191;

              r = Math.round(rimR + (targetR - rimR) * m);
              gCol = Math.round(rimG + (targetG - rimG) * m);
              b = Math.round(rimB + (targetB - rimB) * m);
            }
          } else {
            // Dark Mode: Obsidian midnight sky with radiant northern lights aurora
            if (deltaY < 0) {
              if (deltaY < -0.16) {
                r = 4;
                gCol = 18;
                b = 20;
              } else {
                const m = smoothstep01((deltaY + 0.16) / 0.16);
                r = Math.round(4 + (12 - 4) * m);
                gCol = Math.round(18 + (38 - 18) * m);
                b = Math.round(20 + (44 - 20) * m);
              }
            } else {
              const d = Math.min(1, deltaY / 0.40);
              const m = smoothstep01(d);
              const rightWeight = smoothstep01((xn - 0.20) / 0.50);

              const targetR = Math.round(10 - 6 * rightWeight);
              const targetG = Math.round(52 - 28 * rightWeight);
              const targetB = Math.round(56 - 30 * rightWeight);

              const rimR = 45;
              const rimG = 212;
              const rimB = 191;

              r = Math.round(rimR + (targetR - rimR) * m);
              gCol = Math.round(rimG + (targetG - rimG) * m);
              b = Math.round(rimB + (targetB - rimB) * m);
            }
          }

          const color32 = (255 << 24) | ((b & 255) << 16) | ((gCol & 255) << 8) | (r & 255);
          data32[rowOffset + x] = color32;
        }
      }

      ctx.putImageData(imgData, 0, 0);
    }

    function onScroll() {
      const ih = Math.max(window.innerHeight, 1);
      const q = window.scrollY / ih;

      // Nav scroll state: normal edge-to-edge navbar when scrolling, floating island at top
      if (window.scrollY > 20) {
        navEl.classList.add('scrolled');
      } else {
        navEl.classList.remove('scrolled');
      }

      // Section 2 (#141414 dark background) detector to keep Date/Time white and visible
      const scene2 = document.getElementById('scene2Wrap') || document.getElementById('split') || document.getElementById('statement');
      const inSec2 = scene2 ? (scene2.getBoundingClientRect().top <= 140) : (window.scrollY >= 120);

      if (inSec2 || (window.scrollY >= 120)) {
        navEl.classList.add('in-section-2');
        navEl.classList.add('nav-over-dark');
      } else {
        navEl.classList.remove('in-section-2');
        navEl.classList.remove('nav-over-dark');
      }

      // Entire Section 1 uniform fade out ONLY when scrolling and entering Section 2 second time
      // Starts at 5% of scroll (q = 0.05) and smoothly fades over a balanced, silky span (0.24)
      const heroFadeProgress = stmtAnimDone ? Math.min(1, Math.max(0, (q - 0.05) / 0.24)) : 0;

      if (heroFadeRef.current) {
        heroFadeRef.current.style.opacity = heroFadeProgress.toFixed(3);
      }
      if (atmoDarkRef.current) {
        atmoDarkRef.current.style.opacity = heroFadeProgress.toFixed(3);
      }

      // Trigger 5-second reveal when user reaches Section 2
      if (window.scrollY >= ih * 0.72 && !stmtAnimDone && !stmtAnimActive) {
        triggerStatementReveal();
      }
    }

    let headlineStart: number | null = null;
    let animId: number;
    const REVEAL_IN = 1250;
    const HOLD = 3200;
    const REVEAL_OUT = 750;
    const TOTAL_CYCLE = REVEAL_IN + HOLD + REVEAL_OUT;

    function loop(t: number) {
      if (headlineStart === null) headlineStart = t;
      const elapsed = t - headlineStart;
      const isDark = isDarkRef.current || document.documentElement.classList.contains('dark');
      const h1Final = isDark ? '#ffffff' : '#072a2a';
      const h1Accent = isDark ? '#2dd4bf' : '#0c7075';
      const h1Ghost = isDark ? '#04181a' : '#ffffff';

      if (elapsed < REVEAL_IN) {
        // Phase 1: Reveal in letter-by-letter
        const p = Math.min(1, elapsed / REVEAL_IN);
        paint(h1Chars, p, 0.35, h1Final, h1Accent, h1Ghost);
        if (descEl) {
          descEl.style.opacity = `${0.4 + 0.6 * p}`;
        }
      } else if (elapsed < REVEAL_IN + HOLD) {
        // Phase 2: Hold fully revealed
        paint(h1Chars, 1, 0.35, h1Final, h1Accent, h1Ghost);
        if (descEl) {
          descEl.style.opacity = '1';
        }
      } else if (elapsed < TOTAL_CYCLE) {
        // Phase 3: Smooth dissolve / reveal out in reverse
        const pOut = 1 - (elapsed - (REVEAL_IN + HOLD)) / REVEAL_OUT;
        paint(h1Chars, Math.max(0, pOut), 0.35, h1Final, h1Accent, h1Ghost);
        if (descEl) {
          descEl.style.opacity = `${0.4 + 0.6 * Math.max(0, pOut)}`;
        }
      } else {
        // Phase 4: Advance to next headline and restart cycle
        headlineIndex = (headlineIndex + 1) % HEADLINES.length;
        headlineStart = t;
        h1El.innerHTML = HEADLINES[headlineIndex];
        if (descEl) {
          descEl.textContent = DESCRIPTIONS[headlineIndex];
          descEl.style.opacity = '0.4';
        }
        h1Chars = splitChars(h1El);
        paint(h1Chars, 0, 0.35, h1Final, h1Accent, h1Ghost);
      }

      // Handle 5-second Section 2 reveal animation
      if (stmtAnimActive && stmtStartTime !== null) {
        const stmtElapsed = t - stmtStartTime;
        const stmtFinal = '#111827';
        const stmtAccent = '#0d9488';
        const stmtGhost = '#ffffff';

        if (stmtElapsed < 3800) {
          // Progressive letter-by-letter reveal on white preloader layer
          const p = Math.min(1, stmtElapsed / 3800);
          paint(stmtChars, p, 0.16, stmtFinal, stmtAccent, stmtGhost);
        } else if (stmtElapsed < 4200) {
          // Hold 100% revealed
          paint(stmtChars, 1, 0.16, stmtFinal, stmtAccent, stmtGhost);
        } else if (stmtElapsed < 5200) {
          // Transformation phase: white color smoothly transforms into #141414 as text starts disappearing
          const p = Math.min(1, (stmtElapsed - 4200) / 1000);
          const c = Math.round(255 - (255 - 20) * p);
          const secEl = document.getElementById('statement');
          if (secEl) {
            secEl.style.backgroundColor = `rgb(${c}, ${c}, ${c})`;
          }
          // Dissolve statement text
          stmtEl.style.opacity = Math.max(0, 1 - p * 1.25).toFixed(3);
          stmtEl.style.filter = `blur(${(p * 8).toFixed(1)}px)`;
          setIsAboutLayered(true);
        } else {
          // Complete sequence & unlock scrolling
          finishStatement();
        }
      }

      renderCanvas(t);
      onScroll();

      animId = requestAnimationFrame(loop);
    }

    if (container) {
      container.classList.add('ready');
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      document.body.style.overflow = '';
      delete (window as any).__finishStatement;
    };
  }, []);

  return (
    <div ref={containerRef} className="halden-page">
      {/* 240x150 High-Fidelity Atmospheric Canvas */}
      <div className="halden-atmo">
        <canvas ref={canvasRef} id="bg" width={240} height={150} />
        {/* Uniform Atmospheric Dark Overlay for seamless transition into Section 2 #141414 */}
        <div ref={atmoDarkRef} className="halden-atmo-dark-overlay" aria-hidden="true" />
      </div>

      {/* Navigation Bar (Shared across all pages) */}
      <Header ref={navRef} />

      <main className="halden-main">
        {/* Scene 1: Hero */}
        <section className="halden-hero" id="hero">
          {/* Entire Hero Section Uniform Fade Overlay (no localized bottom fadeout) */}
          <div ref={heroFadeRef} className="halden-hero-fade" aria-hidden="true" />

          <div className="halden-hero-content">
            <h1 ref={h1Ref} id="h1">
              Strategy that
              <br />
              moves you <span className="hl">forward</span>.
            </h1>

            <p
              ref={descRef}
              className="halden-hero-desc halden-fade-up"
              style={{ ['--d' as any]: '0.35s' }}
            >
              We help forward-thinking organizations navigate complexity, make confident decisions, and architect lasting digital progress.
            </p>

            <div
              className="halden-hero-search halden-fade-up"
              style={{ ['--d' as any]: '0.5s' }}
            >
              <SearchBar placeholder="Search capabilities & services..." />
            </div>

            <div
              className="halden-hero-actions halden-fade-up"
              style={{ ['--d' as any]: '0.65s' }}
            >
              <Link
                to="/contact"
                className="halden-btn lg"
              >
                <span>Get a demo</span>
                <span className="dot">
                  <svg className="chev" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M4.5 2.5 8 6l-3.5 3.5"
                      stroke="#042a2b"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </Link>

              <div className="trust">
                Port operators trust Halden
              </div>
            </div>
          </div>

          {/* 4 Rolling Logo Columns */}
          <div className="halden-logos halden-fade-up" style={{ ['--d' as any]: '1.25s' }}>
            {/* Column 1: Down to Up */}
            <div className="halden-roll-col halden-roll-up halden-roll-col-1">
              <div className="halden-roll-track">
                {/* Group A */}
                <div className="halden-roll-group">
                  <div className="halden-logo-cell" title="PwC">
                    <img src="/assets/logos/clients/pwc.png" alt="PwC" className="halden-client-logo-img" loading="lazy" />
                  </div>
                  <div className="halden-logo-cell" title="adidas">
                    <img src="/assets/logos/clients/adidas.png" alt="adidas" className="halden-client-logo-img" loading="lazy" />
                  </div>
                  <div className="halden-logo-cell" title="Coca-Cola">
                    <img src="/assets/logos/clients/coca_cola.png" alt="Coca-Cola" className="halden-client-logo-img" loading="lazy" />
                  </div>
                  <div className="halden-logo-cell" title="SAP">
                    <img src="/assets/logos/clients/sap.png" alt="SAP" className="halden-client-logo-img" loading="lazy" />
                  </div>
                  <div className="halden-logo-cell" title="Honeywell">
                    <img src="/assets/logos/clients/honeywell.png" alt="Honeywell" className="halden-client-logo-img" loading="lazy" />
                  </div>
                  <div className="halden-logo-cell" title="Chevron">
                    <img src="/assets/logos/clients/chevron.png" alt="Chevron" className="halden-client-logo-img" loading="lazy" />
                  </div>
                  <div className="halden-logo-cell" title="Hitachi">
                    <img src="/assets/logos/clients/hitachi.png" alt="Hitachi" className="halden-client-logo-img" loading="lazy" />
                  </div>
                  <div className="halden-logo-cell" title="Valvoline">
                    <img src="/assets/logos/clients/valvoline.png" alt="Valvoline" className="halden-client-logo-img" loading="lazy" />
                  </div>
                </div>
                {/* Group B (Duplicate for seamless loop) */}
                <div className="halden-roll-group" aria-hidden="true">
                  <div className="halden-logo-cell" title="PwC">
                    <img src="/assets/logos/clients/pwc.png" alt="PwC" className="halden-client-logo-img" loading="lazy" />
                  </div>
                  <div className="halden-logo-cell" title="adidas">
                    <img src="/assets/logos/clients/adidas.png" alt="adidas" className="halden-client-logo-img" loading="lazy" />
                  </div>
                  <div className="halden-logo-cell" title="Coca-Cola">
                    <img src="/assets/logos/clients/coca_cola.png" alt="Coca-Cola" className="halden-client-logo-img" loading="lazy" />
                  </div>
                  <div className="halden-logo-cell" title="SAP">
                    <img src="/assets/logos/clients/sap.png" alt="SAP" className="halden-client-logo-img" loading="lazy" />
                  </div>
                  <div className="halden-logo-cell" title="Honeywell">
                    <img src="/assets/logos/clients/honeywell.png" alt="Honeywell" className="halden-client-logo-img" loading="lazy" />
                  </div>
                  <div className="halden-logo-cell" title="Chevron">
                    <img src="/assets/logos/clients/chevron.png" alt="Chevron" className="halden-client-logo-img" loading="lazy" />
                  </div>
                  <div className="halden-logo-cell" title="Hitachi">
                    <img src="/assets/logos/clients/hitachi.png" alt="Hitachi" className="halden-client-logo-img" loading="lazy" />
                  </div>
                  <div className="halden-logo-cell" title="Valvoline">
                    <img src="/assets/logos/clients/valvoline.png" alt="Valvoline" className="halden-client-logo-img" loading="lazy" />
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Up to Down */}
            <div className="halden-roll-col halden-roll-down halden-roll-col-2">
              <div className="halden-roll-track">
                {/* Group A */}
                <div className="halden-roll-group">
                  <div className="halden-logo-cell" title="Under Armour">
                    <img src="/assets/logos/clients/under_armour.png" alt="Under Armour" className="halden-client-logo-img" loading="lazy" />
                  </div>
                  <div className="halden-logo-cell" title="Heineken">
                    <img src="/assets/logos/clients/heineken.png" alt="Heineken" className="halden-client-logo-img" loading="lazy" />
                  </div>
                  <div className="halden-logo-cell" title="The Home Depot">
                    <img src="/assets/logos/clients/the_home_depot.png" alt="The Home Depot" className="halden-client-logo-img" loading="lazy" />
                  </div>
                  <div className="halden-logo-cell" title="bp">
                    <img src="/assets/logos/clients/bp.png" alt="bp" className="halden-client-logo-img" loading="lazy" />
                  </div>
                  <div className="halden-logo-cell" title="Kellogg's">
                    <img src="/assets/logos/clients/kelloggs.png" alt="Kellogg's" className="halden-client-logo-img" loading="lazy" />
                  </div>
                  <div className="halden-logo-cell" title="Pembina">
                    <img src="/assets/logos/clients/pembina.png" alt="Pembina" className="halden-client-logo-img" loading="lazy" />
                  </div>
                  <div className="halden-logo-cell" title="Lexmark">
                    <img src="/assets/logos/clients/lexmark.png" alt="Lexmark" className="halden-client-logo-img" loading="lazy" />
                  </div>
                  <div className="halden-logo-cell" title="ALDO">
                    <img src="/assets/logos/clients/aldo.png" alt="ALDO" className="halden-client-logo-img" loading="lazy" />
                  </div>
                </div>
                {/* Group B (Duplicate for seamless loop) */}
                <div className="halden-roll-group" aria-hidden="true">
                  <div className="halden-logo-cell" title="Under Armour">
                    <img src="/assets/logos/clients/under_armour.png" alt="Under Armour" className="halden-client-logo-img" loading="lazy" />
                  </div>
                  <div className="halden-logo-cell" title="Heineken">
                    <img src="/assets/logos/clients/heineken.png" alt="Heineken" className="halden-client-logo-img" loading="lazy" />
                  </div>
                  <div className="halden-logo-cell" title="The Home Depot">
                    <img src="/assets/logos/clients/the_home_depot.png" alt="The Home Depot" className="halden-client-logo-img" loading="lazy" />
                  </div>
                  <div className="halden-logo-cell" title="bp">
                    <img src="/assets/logos/clients/bp.png" alt="bp" className="halden-client-logo-img" loading="lazy" />
                  </div>
                  <div className="halden-logo-cell" title="Kellogg's">
                    <img src="/assets/logos/clients/kelloggs.png" alt="Kellogg's" className="halden-client-logo-img" loading="lazy" />
                  </div>
                  <div className="halden-logo-cell" title="Pembina">
                    <img src="/assets/logos/clients/pembina.png" alt="Pembina" className="halden-client-logo-img" loading="lazy" />
                  </div>
                  <div className="halden-logo-cell" title="Lexmark">
                    <img src="/assets/logos/clients/lexmark.png" alt="Lexmark" className="halden-client-logo-img" loading="lazy" />
                  </div>
                  <div className="halden-logo-cell" title="ALDO">
                    <img src="/assets/logos/clients/aldo.png" alt="ALDO" className="halden-client-logo-img" loading="lazy" />
                  </div>
                </div>
              </div>
            </div>

            {/* Column 3: Down to Up */}
            <div className="halden-roll-col halden-roll-up halden-roll-col-3">
              <div className="halden-roll-track">
                {/* Group A */}
                <div className="halden-roll-group">
                  <div className="halden-logo-cell" title="P&G">
                    <img src="/assets/logos/clients/pg.png" alt="P&G" className="halden-client-logo-img" loading="lazy" />
                  </div>
                  <div className="halden-logo-cell" title="Johnsonville">
                    <img src="/assets/logos/clients/johnsonville.png" alt="Johnsonville" className="halden-client-logo-img" loading="lazy" />
                  </div>
                  <div className="halden-logo-cell" title="MOEN">
                    <img src="/assets/logos/clients/moen.png" alt="MOEN" className="halden-client-logo-img" loading="lazy" />
                  </div>
                  <div className="halden-logo-cell" title="Corteva Agriscience">
                    <img src="/assets/logos/clients/corteva.png" alt="Corteva Agriscience" className="halden-client-logo-img" loading="lazy" />
                  </div>
                  <div className="halden-logo-cell" title="ITC">
                    <img src="/assets/logos/clients/itc.png" alt="ITC" className="halden-client-logo-img" loading="lazy" />
                  </div>
                  <div className="halden-logo-cell" title="Spectra Energy">
                    <img src="/assets/logos/clients/spectra_energy.png" alt="Spectra Energy" className="halden-client-logo-img" loading="lazy" />
                  </div>
                  <div className="halden-logo-cell" title="ally">
                    <img src="/assets/logos/clients/ally.png" alt="ally" className="halden-client-logo-img" loading="lazy" />
                  </div>
                  <div className="halden-logo-cell" title="NOVUS">
                    <img src="/assets/logos/clients/novus.png" alt="NOVUS" className="halden-client-logo-img" loading="lazy" />
                  </div>
                </div>
                {/* Group B (Duplicate for seamless loop) */}
                <div className="halden-roll-group" aria-hidden="true">
                  <div className="halden-logo-cell" title="P&G">
                    <img src="/assets/logos/clients/pg.png" alt="P&G" className="halden-client-logo-img" loading="lazy" />
                  </div>
                  <div className="halden-logo-cell" title="Johnsonville">
                    <img src="/assets/logos/clients/johnsonville.png" alt="Johnsonville" className="halden-client-logo-img" loading="lazy" />
                  </div>
                  <div className="halden-logo-cell" title="MOEN">
                    <img src="/assets/logos/clients/moen.png" alt="MOEN" className="halden-client-logo-img" loading="lazy" />
                  </div>
                  <div className="halden-logo-cell" title="Corteva Agriscience">
                    <img src="/assets/logos/clients/corteva.png" alt="Corteva Agriscience" className="halden-client-logo-img" loading="lazy" />
                  </div>
                  <div className="halden-logo-cell" title="ITC">
                    <img src="/assets/logos/clients/itc.png" alt="ITC" className="halden-client-logo-img" loading="lazy" />
                  </div>
                  <div className="halden-logo-cell" title="Spectra Energy">
                    <img src="/assets/logos/clients/spectra_energy.png" alt="Spectra Energy" className="halden-client-logo-img" loading="lazy" />
                  </div>
                  <div className="halden-logo-cell" title="ally">
                    <img src="/assets/logos/clients/ally.png" alt="ally" className="halden-client-logo-img" loading="lazy" />
                  </div>
                  <div className="halden-logo-cell" title="NOVUS">
                    <img src="/assets/logos/clients/novus.png" alt="NOVUS" className="halden-client-logo-img" loading="lazy" />
                  </div>
                </div>
              </div>
            </div>

            {/* Column 4: Up to Down */}
            <div className="halden-roll-col halden-roll-down halden-roll-col-4">
              <div className="halden-roll-track">
                {/* Group A */}
                <div className="halden-roll-group">
                  <div className="halden-logo-cell" title="Brighthouse Financial">
                    <img src="/assets/logos/clients/brighthouse.png" alt="Brighthouse Financial" className="halden-client-logo-img" loading="lazy" />
                  </div>
                  <div className="halden-logo-cell" title="Chedraui">
                    <img src="/assets/logos/clients/chedraui.png" alt="Chedraui" className="halden-client-logo-img" loading="lazy" />
                  </div>
                  <div className="halden-logo-cell" title="VF Corporation">
                    <img src="/assets/logos/clients/vf.png" alt="VF Corporation" className="halden-client-logo-img" loading="lazy" />
                  </div>
                  <div className="halden-logo-cell" title="cmpc">
                    <img src="/assets/logos/clients/cmpc.png" alt="cmpc" className="halden-client-logo-img" loading="lazy" />
                  </div>
                  <div className="halden-logo-cell" title="Seventy Seven Energy">
                    <img src="/assets/logos/clients/seventy_seven_energy.png" alt="Seventy Seven Energy" className="halden-client-logo-img" loading="lazy" />
                  </div>
                  <div className="halden-logo-cell" title="SAIL">
                    <img src="/assets/logos/clients/sail.png" alt="SAIL" className="halden-client-logo-img" loading="lazy" />
                  </div>
                  <div className="halden-logo-cell" title="MEI">
                    <img src="/assets/logos/clients/mei.png" alt="MEI" className="halden-client-logo-img" loading="lazy" />
                  </div>
                </div>
                {/* Group B (Duplicate for seamless loop) */}
                <div className="halden-roll-group" aria-hidden="true">
                  <div className="halden-logo-cell" title="Brighthouse Financial">
                    <img src="/assets/logos/clients/brighthouse.png" alt="Brighthouse Financial" className="halden-client-logo-img" loading="lazy" />
                  </div>
                  <div className="halden-logo-cell" title="Chedraui">
                    <img src="/assets/logos/clients/chedraui.png" alt="Chedraui" className="halden-client-logo-img" loading="lazy" />
                  </div>
                  <div className="halden-logo-cell" title="VF Corporation">
                    <img src="/assets/logos/clients/vf.png" alt="VF Corporation" className="halden-client-logo-img" loading="lazy" />
                  </div>
                  <div className="halden-logo-cell" title="cmpc">
                    <img src="/assets/logos/clients/cmpc.png" alt="cmpc" className="halden-client-logo-img" loading="lazy" />
                  </div>
                  <div className="halden-logo-cell" title="Seventy Seven Energy">
                    <img src="/assets/logos/clients/seventy_seven_energy.png" alt="Seventy Seven Energy" className="halden-client-logo-img" loading="lazy" />
                  </div>
                  <div className="halden-logo-cell" title="SAIL">
                    <img src="/assets/logos/clients/sail.png" alt="SAIL" className="halden-client-logo-img" loading="lazy" />
                  </div>
                  <div className="halden-logo-cell" title="MEI">
                    <img src="/assets/logos/clients/mei.png" alt="MEI" className="halden-client-logo-img" loading="lazy" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Scene 2 & 3: About Axia Kairos & Generative AI Section with Preloader Layer Overlay */}
        <div className="halden-scene-2-wrap" id="scene2Wrap">
          {/* Scene 3: About Axia Kairos - Enterprise Generative AI & Thinking Orbs (Base layer #141414) */}
          <AboutGenAISection id="split" isLayered={isAboutLayered} />

          {/* Scene 2: Preloader-like Statement Layer (Overlay that transforms white -> #141414) */}
          <section className="halden-statement" id="statement">
            <div className="pin">
              <p ref={stmtRef} id="stmt">
                Axia Kairos is an enterprise AI teammate
                <br /> that automates workflows, orchestrates SAP systems,
                <br /> synthesizes sovereign intelligence, and solves
                <br /> complex operations to keep global business moving
              </p>
              <button
                type="button"
                className="halden-stmt-skip-btn"
                onClick={() => {
                  const finish = (window as any).__finishStatement;
                  if (finish) finish();
                }}
                title="Skip animation to About Axia Kairos"
              >
                Skip to About →
              </button>
            </div>
          </section>
        </div>

        {/* Scene 4: Industries We Serve ("Elo One" Case Study Results) */}
        <IndustriesWeServeSection />
      </main>

      {/* Shared Ticket Stub Footer */}
      <Footer />
    </div>
  );
};

export default HaldenLanding;
