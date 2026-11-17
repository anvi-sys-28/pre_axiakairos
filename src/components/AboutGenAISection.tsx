import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
import { ThinkingOrb } from 'thinking-orbs';
import type { OrbState } from 'thinking-orbs';
// import { ArrowRight, ExternalLink, Pause, Play, Sparkles } from 'lucide-react';
// import GlassFolder, { type FolderFile } from '@/components/ui/glass-folder-cards';
import WorkflowBlueprint from '@/components/ui/interactive-workflow-blueprint';
import { graph, apps } from '@/components/ui/demo';
import '@/styles/about-genai.css';

interface AboutGenAISectionProps {
  id?: string;
  isLayered?: boolean;
  isDark?: boolean;
}

/**
 * Warm Cream Theme Color for dark mode thinking orb
 */
const FIXED_CREAM_COLOR = '#FDF6E2';

const AUTOMATE_FLOWS_STYLE: React.CSSProperties = {
  "--color-background": "#141414",
  "--color-foreground": "#f1f7ff",
  "--color-card": "#181818",
  "--color-muted-foreground": "#bfced5",
  "--color-border": "rgba(255,255,255,0.12)",
  "--color-primary": "#2ff59b",
  "--color-primary-foreground": "#08120d",
  "--color-chart-2": "#2ff59b",
  "--color-chart-3": "#e5a93c",
} as React.CSSProperties;

const NEUTRAL_FLOWS_STYLE: React.CSSProperties = {
  "--color-background": "#141414",
  "--color-foreground": "#f1f7ff",
  "--color-card": "#181818",
  "--color-muted-foreground": "#8899a6",
  "--color-border": "rgba(255,255,255,0.12)",
  "--color-primary": "rgba(255,255,255,0.25)",
  "--color-primary-foreground": "#ffffff",
  "--color-chart-2": "rgba(255,255,255,0.18)",
  "--color-chart-3": "rgba(255,255,255,0.18)",
} as React.CSSProperties;

const LIGHT_AUTOMATE_STYLE: React.CSSProperties = {
  "--color-background": "#fbfbfa",
  "--color-foreground": "#0f172a",
  "--color-card": "#ffffff",
  "--color-muted-foreground": "#64748b",
  "--color-border": "#e2e8f0",
  "--color-primary": "#0c7075",
  "--color-primary-foreground": "#ffffff",
  "--color-chart-2": "#10b981",
  "--color-chart-3": "#059669",
} as React.CSSProperties;

const LIGHT_NEUTRAL_STYLE: React.CSSProperties = {
  "--color-background": "#fbfbfa",
  "--color-foreground": "#0f172a",
  "--color-card": "#ffffff",
  "--color-muted-foreground": "#94a3b8",
  "--color-border": "#e2e8f0",
  "--color-primary": "rgba(12, 112, 117, 0.4)",
  "--color-primary-foreground": "#0f172a",
  "--color-chart-2": "rgba(16, 185, 129, 0.3)",
  "--color-chart-3": "rgba(12, 112, 117, 0.3)",
} as React.CSSProperties;

/*
interface FolderDossier {
  id: string;
  label: string;
  meta: string;
  tone?: 'light' | 'dark';
  art?: 'aurora' | 'ember' | 'dusk' | 'glacier' | 'verdant' | 'none';
  seed?: number;
  labelPlacement?: 'bottom-left' | 'top-left' | 'top-right';
  files: FolderFile[];
}

const DOSSIERS: FolderDossier[] = [
  {
    id: 'sovereign-ai',
    label: 'Sovereign AI',
    meta: 'AI Architectures',
    tone: 'dark',
    art: 'aurora',
    seed: 3,
    labelPlacement: 'bottom-left',
    files: [
      { name: 'Agentic Swarm Blueprint', meta: 'Cognitive DAG', art: 'aurora' },
      { name: 'LLM Security Guardrails', meta: 'v2.4 Audit', art: 'dusk' },
      { name: 'Latency Benchmark.pdf', meta: '48ms P99' },
    ],
  },
  {
    id: 'sap-core',
    label: 'SAP S/4HANA',
    meta: 'Enterprise Core',
    tone: 'dark',
    art: 'ember',
    seed: 7,
    labelPlacement: 'top-left',
    files: [
      { name: 'Clean Core Architecture', meta: 'BTP Extensibility', art: 'ember' },
      { name: 'Process Mining Feed', meta: '4.2M txns/day' },
      { name: 'Migration_Runbook.pdf', meta: 'PDF · 8.4 MB', art: 'dusk' },
    ],
  },
  {
    id: 'supply-chain',
    label: 'Supply Chain',
    meta: 'Autonomous Ops',
    tone: 'dark',
    art: 'verdant',
    seed: 14,
    labelPlacement: 'bottom-left',
    files: [
      { name: 'Global Logistics Graph', meta: '48 Warehouses', art: 'verdant' },
      { name: 'Demand Predictor', meta: '99.4% Accuracy', art: 'aurora' },
      { name: 'Cold-Chain IoT.csv', meta: 'Live Stream' },
    ],
  },
  {
    id: 'fintech-risk',
    label: 'FinTech & Risk',
    meta: 'Treasury Systems',
    tone: 'dark',
    art: 'glacier',
    seed: 21,
    labelPlacement: 'top-right',
    files: [
      { name: 'T+0 Settlement Engine', meta: 'Smart Reconciliation', art: 'glacier' },
      { name: 'ISO27001 Compliance', meta: 'Verified' },
      { name: 'Cash Flow Sim.drx', meta: 'Stress Test', art: 'ember' },
    ],
  },
  {
    id: 'cloud-mesh',
    label: 'Cloud Modernization',
    meta: 'Multi-Cloud Mesh',
    tone: 'dark',
    art: 'dusk',
    seed: 33,
    labelPlacement: 'bottom-left',
    files: [
      { name: 'Zero-Trust Topology', meta: 'Kubernetes Mesh', art: 'dusk' },
      { name: 'Terraform Modules', meta: 'GitOps IaC' },
      { name: 'Disaster Recovery Plan', meta: 'RTO < 3 min', art: 'glacier' },
    ],
  },
  {
    id: 'case-studies',
    label: 'Client Case Studies',
    meta: 'Proven Impact',
    tone: 'dark',
    art: 'aurora',
    seed: 42,
    labelPlacement: 'top-left',
    files: [
      { name: 'Fortune 50 Energy Utility', meta: 'SAP Transformation', art: 'ember' },
      { name: 'Global CPG Brand', meta: 'Agentic Workflows', art: 'verdant' },
      { name: 'Public Sector Modernization', meta: 'Cloud Data Lake' },
    ],
  },
];
*/

/**
 * 4 Shipped Thinking Orb Animations in exact user requested sequence:
 * 1. Thinking (working)
 * 2. Searching (searching)
 * 3. Solving (solving)
 * 4. Connecting (connecting)
 */
const ORB_STATES: {
  state: OrbState;
  label: string;
  desc: string;
}[] = [
  {
    state: 'working',
    label: 'Thinking',
    desc: 'Deep cognitive neural reasoning and autonomous multi-step problem decomposition',
  },
  {
    state: 'searching',
    label: 'Searching',
    desc: 'Global enterprise knowledge graph traversal and sub-second context retrieval',
  },
  {
    state: 'solving',
    label: 'Solving',
    desc: 'Autonomous exception resolution and mathematical constraint optimization',
  },
  {
    state: 'connecting',
    label: 'Connecting',
    desc: 'Multi-agent neural constellation and distributed swarm task routing',
  },
];

/*
const TYPING_PHRASES = [
  'Autonomous Enterprise Generative AI Solutions.',
  'Multi-Agent Cognitive Systems & Workflows.',
  'Private Sovereign LLMs Built for Maximum Precision.',
];

const SOLUTIONS_STREAM = [
  {
    idx: 'GEN-AI 01',
    title: 'Multi-Agent Process Orchestration',
    tag: 'Autonomous Workflows',
    desc: 'Autonomous AI teammates that cross-correlate shipping manifests, trigger SAP transactions, coordinate berth schedules, and solve exceptions with zero human delay.',
  },
  {
    idx: 'GEN-AI 02',
    title: 'Private Enterprise RAG & Knowledge Synthesis',
    tag: 'Zero Data Leakage',
    desc: 'Sub-second semantic intelligence over millions of regulatory files, customs contracts, engineering blueprints, and ERP data with mathematical auditability.',
  },
  {
    idx: 'GEN-AI 03',
    title: 'SAP S/4HANA & Cloud Copilots',
    tag: 'SAP BTP & Hybrid Cloud',
    desc: 'Context-aware generative copilots embedded directly into SAP ERP, AWS, Azure, and Google Cloud environments for immediate executive decision velocity.',
  },
  {
    idx: 'GEN-AI 04',
    title: 'Autonomous Decision Intelligence',
    tag: 'Predictive Reasoning',
    desc: 'Dynamic simulation models that foresee port bottlenecks, tariff shifts, vessel ETA variations, and predictive logistics maintenance before issues occur.',
  },
  {
    idx: 'GEN-AI 05',
    title: 'Sovereign LLMs & Enterprise Guardrails',
    tag: 'Dedicated VPC Security',
    desc: 'Custom fine-tuned domain models deployed on dedicated enterprise infrastructure with automated red-teaming, hallucination defense, and zero data retention.',
  },
  {
    idx: 'GEN-AI 06',
    title: 'Cognitive Vision & Document Extraction',
    tag: 'Multimodal AI',
    desc: 'Next-gen vision-language agents parsing multi-lingual bills of lading, complex invoices, customs declarations, and sensor telemetries in sub-second times.',
  },
];
*/

class OrbErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.warn('[OrbErrorBoundary] Suppressed ThinkingOrb error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center w-full h-full text-center p-4">
          <div
            className="w-16 h-16 rounded-full border border-teal-400/40 animate-pulse mb-3"
            style={{
              background: 'radial-gradient(circle, rgba(45,212,191,0.2) 0%, transparent 70%)',
            }}
          />
          <span className="text-xs font-mono text-teal-300">Cognitive Neural Core</span>
        </div>
      );
    }
    return this.props.children;
  }
}

export const AboutGenAISection: React.FC<AboutGenAISectionProps> = ({
  id = 'split',
  isLayered = false,
  isDark: isDarkProp,
}) => {
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

  /*
  // Scrolling Files Marquee State (Commented per user request)
  const [isFilesHovered, setIsFilesHovered] = useState(false);
  const [isFilesPlaying, setIsFilesPlaying] = useState(true);
  const displayDossiers = [...DOSSIERS, ...DOSSIERS];

  // Simple Changing Text for capabilities below description (Commented per user request)
  const [solIndex, setSolIndex] = useState(0);
  const [isSolTransitioning, setIsSolTransitioning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsSolTransitioning(true);
      setTimeout(() => {
        setSolIndex((prev) => (prev + 1) % SOLUTIONS_STREAM.length);
        setIsSolTransitioning(false);
      }, 300);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  const activeSol = SOLUTIONS_STREAM[solIndex];
  */

  // Orb Sequential State Progression (Thinking -> Searching -> Solving -> Connecting)
  const [activeOrbIndex, setActiveOrbIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveOrbIndex((prev) => (prev + 1) % ORB_STATES.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [isHovered]);

  const activeOrb = ORB_STATES[activeOrbIndex];
  const [useBrandColors, setUseBrandColors] = useState<boolean>(true);

  /*
  // Typing Text Effect Hook (Commented per user request)
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingText, setTypingText] = useState('');

  useEffect(() => {
    const currentPhrase = TYPING_PHRASES[phraseIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting) {
      if (charIndex < currentPhrase.length) {
        timeout = setTimeout(() => {
          setTypingText(currentPhrase.substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        }, 45);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 2600);
      }
    } else {
      if (charIndex > 0) {
        timeout = setTimeout(() => {
          setTypingText(currentPhrase.substring(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        }, 22);
      } else {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % TYPING_PHRASES.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, phraseIndex]);
  */

  return (
    <section
      id={id}
      className={`genai-about-section ${isLayered ? 'is-layered' : 'is-hidden'}`}
      aria-label="About Axia Kairos Generative AI Solutions"
    >
      <style>{`
        @keyframes genaiFilesMarqueeLeft {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .genai-files-track {
          display: flex;
          width: max-content;
          will-change: transform;
          animation-name: genaiFilesMarqueeLeft;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        .genai-files-track:hover {
          animation-play-state: paused !important;
        }
      `}</style>

      <div className="genai-atmo-glow" aria-hidden="true" />

      {/* =========================================================================
          LAYER 2 TOP STRIP: Continuous Scrolling Files Track
          (Commented out per user request)
          ========================================================================= */}
      {/*
      <div className="genai-files-marquee-section">
        <div
          className="relative w-full overflow-hidden"
          onMouseEnter={() => setIsFilesHovered(true)}
          onMouseLeave={() => setIsFilesHovered(false)}
        >
          <div className="absolute top-0 bottom-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-[#141414] to-transparent z-20 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-[#141414] to-transparent z-20 pointer-events-none" />

          <div
            className="genai-files-track flex items-center gap-4 sm:gap-5 pl-4"
            style={{
              animationDuration: '38s',
              animationPlayState: isFilesPlaying && !isFilesHovered ? 'running' : 'paused',
            }}
          >
            {displayDossiers.map((dossier, idx) => (
              <div
                key={`${dossier.id}-${idx}`}
                className="flex-none transition-transform duration-300 hover:scale-[1.03] cursor-pointer"
              >
                <GlassFolder
                  width={132}
                  label={dossier.label}
                  meta={dossier.meta}
                  tone={dossier.tone || 'dark'}
                  art={dossier.art || 'aurora'}
                  seed={dossier.seed || 3}
                  labelPlacement={dossier.labelPlacement || 'bottom-left'}
                  files={dossier.files}
                  action="add"
                  appear={false}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      */}

      {/* =========================================================================
          LAYER 2 LAYOUT:
          [ Left Column ]:
            - About Us heading & content
            - Orby 3D Animation
            - Orby Changing Text (kept directly down of orby animation)
          [ Right Column ]:
            - Use Automate Flows colors toggle
            - React Flow Blueprint with Dotted Grid
            - Horizontal Connection Stack Box
          ========================================================================= */}
      <div className="genai-section2-layout">
        {/* LEFT COLUMN: About Us -> Orby Animation -> Orby Changing Text */}
        <div className="genai-col-left">
          {/* 1. About Us Heading & Content */}
          <div className="genai-about-info">
            <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 transition-colors ${
              isDark ? "text-white" : "text-[#0f172a]"
            }`}>
              About Us
            </h2>
            <p className={`text-base sm:text-[18px] font-normal leading-relaxed max-w-xl transition-colors ${
              isDark ? "text-slate-200" : "text-slate-600"
            }`}>
              Axia Kairos architects and deploys sovereign, production-grade agentic foundations that connect legacy ERPs, unstructured documents, and real-time operations into autonomous, mathematically auditable copilots.
            </p>
          </div>

          {/* 2. Orby Animation Chamber */}
          <div
            className="genai-orb-chamber-wrap"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="genai-orb-chamber">
              <div className="genai-main-orb-wrapper">
                <OrbErrorBoundary>
                  <ThinkingOrb
                    key={`${activeOrb.state}-${isDark ? 'dark' : 'light'}`}
                    state={activeOrb.state}
                    size={64}
                    theme={isDark ? "dark" : "light"}
                    color={isDark ? FIXED_CREAM_COLOR : "#0c7075"}
                    speed={1.1}
                    gravity={true}
                  />
                </OrbErrorBoundary>
              </div>
            </div>
            <div className="text-center mt-2">
              <span className={`text-[11px] font-mono uppercase tracking-wider ${
                isDark ? "text-amber-200/80" : "text-emerald-800"
              }`}>
                {activeOrb.label} · Neural Constellation
              </span>
            </div>
          </div>

          {/* 3. Orby Changing Text (Directly Down of Orby Animation, Free from Box) */}
          <div className="genai-orby-text-card">
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`w-2 h-2 rounded-full animate-pulse ${isDark ? "bg-[#2ff59b]" : "bg-[#059669]"}`} />
              <span className={`text-[11px] font-mono uppercase tracking-widest ${
                isDark ? "text-emerald-400" : "text-emerald-700"
              }`}>
                Active Cognitive State
              </span>
            </div>
            <h3 className={`text-2xl sm:text-3xl font-bold tracking-tight mb-2 transition-all duration-300 ${
              isDark ? "text-[#FDF6E2]" : "text-[#0f172a]"
            }`}>
              {activeOrb.label}
            </h3>
            <p className={`text-sm sm:text-base leading-relaxed transition-all duration-300 max-w-lg ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}>
              {activeOrb.desc}
            </p>
            {/* Interactive State Indicators */}
            <div className="flex items-center gap-2 mt-3.5">
              {ORB_STATES.map((orb, i) => (
                <button
                  key={orb.state}
                  type="button"
                  onClick={() => setActiveOrbIndex(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === activeOrbIndex
                      ? (isDark ? 'w-8 bg-emerald-400' : 'w-8 bg-[#059669]')
                      : (isDark ? 'w-2.5 bg-white/20 hover:bg-white/40' : 'w-2.5 bg-black/15 hover:bg-black/30')
                  }`}
                  title={`${orb.label} state`}
                  aria-label={`Switch to ${orb.label} state`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Toggle -> React Flow Canvas -> Horizontal Connection Stack (Borderless) */}
        <div className={`genai-col-right ${isDark ? "dark" : "light"}`} data-theme={isDark ? "dark" : "light"}>
          {/* Top Control Bar: Use Automate Flows colors Checkbox */}
          <div className="genai-right-header flex items-center justify-between mb-3 flex-wrap gap-2">
            <span className={`text-xs font-mono uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Agentic Blueprint Canvas · Chat with your spreadsheets
            </span>
            <label className="genai-brand-preset-toggle">
              <input
                type="checkbox"
                checked={useBrandColors}
                onChange={(e) => setUseBrandColors(e.target.checked)}
              />
              <span className={isDark ? "text-slate-300" : "text-slate-700"}>Use Automate Flows colors</span>
            </label>
          </div>

          {/* React Flow + Horizontal Connection Stack Container (Borderless) */}
          <div className="genai-reactflow-box">
            <WorkflowBlueprint
              canvasOnly={true}
              showStack={true}
              title="Chat with your spreadsheets"
              initialGraph={graph}
              apps={apps}
              style={
                isDark
                  ? (useBrandColors ? AUTOMATE_FLOWS_STYLE : NEUTRAL_FLOWS_STYLE)
                  : (useBrandColors ? LIGHT_AUTOMATE_STYLE : LIGHT_NEUTRAL_STYLE)
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutGenAISection;
