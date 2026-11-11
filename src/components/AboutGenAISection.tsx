import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ThinkingOrb } from 'thinking-orbs';
import type { OrbState } from 'thinking-orbs';
import { ArrowRight, ExternalLink, Cpu } from 'lucide-react';
import '@/styles/about-genai.css';

interface AboutGenAISectionProps {
  id?: string;
  isLayered?: boolean;
}

/**
 * Fixed Warm Cream Theme Color across all states
 */
const FIXED_CREAM_COLOR = '#FDF6E2';

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
  componentDidCatch(error: any) {
    console.warn('[ThinkingOrb error caught safely]:', error);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-16 h-16 rounded-full border border-[#FDF6E2]/40 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-[#FDF6E2]/25 blur-sm" />
        </div>
      );
    }
    return this.props.children;
  }
}

export const AboutGenAISection: React.FC<AboutGenAISectionProps> = ({
  id = 'split',
  isLayered = true,
}) => {
  // Theme state for dynamic adaptation between light and dark
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  useEffect(() => {
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    const handleThemeEvent = (e: any) => {
      if (e.detail?.theme) {
        setIsDark(e.detail.theme === 'dark');
      }
    };
    window.addEventListener('themechange', handleThemeEvent);

    return () => {
      observer.disconnect();
      window.removeEventListener('themechange', handleThemeEvent);
    };
  }, []);

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
  const activeColor = FIXED_CREAM_COLOR;

  // Typing Text Effect Hook
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

  return (
    <section
      id={id}
      className={`genai-about-section ${isLayered ? 'is-layered' : 'is-hidden'}`}
      aria-label="About Axia Kairos Generative AI Solutions"
    >
      <div className="genai-atmo-glow" aria-hidden="true" />

      <div className="genai-grid-container">
        {/* Left Column: Thinking Orb Chamber with Sequential Animations & Text Labels */}
        <div
          className="genai-orbs-column"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Stage with Single Primary Thinking Orb - Increased by 20% via wrapper scale, circles removed */}
          <div className="genai-orb-chamber">
            <div className="genai-main-orb-wrapper">
              <OrbErrorBoundary>
                <ThinkingOrb
                  key={`${activeOrb.state}-dark`}
                  state={activeOrb.state}
                  size={64}
                  theme="dark"
                  color={FIXED_CREAM_COLOR}
                  speed={1.1}
                  gravity={true}
                />
              </OrbErrorBoundary>
            </div>
          </div>

          {/* Prominent Active State Text Label in Warm Cream */}
          <div className="genai-active-state-display">
            <h3 className="genai-active-state-title" style={{ color: FIXED_CREAM_COLOR }}>
              {activeOrb.label}
            </h3>
            <p className="genai-active-state-desc">{activeOrb.desc}</p>
          </div>
        </div>

        {/* Right Column: Generative AI Content & Scrolling Stream (Eyebrow box removed) */}
        <div className="genai-content-column">
          <h2 className="genai-main-title">
            Axia Kairos Generative AI Solutions
          </h2>

          <div className="genai-typing-container" aria-live="polite">
            <p className="genai-typing-lead">
              <span>{typingText}</span>
              <span className="genai-cursor">|</span>
            </p>
          </div>

          <p className="genai-lead-desc">
            We architect and deploy production-grade agentic foundations that connect legacy ERPs,
            unstructured documents, and real-time operations into autonomous, mathematically auditable copilots.
          </p>

          {/* Continuous Moving Stream of Enterprise Gen AI Capabilities */}
          <div className="genai-solutions-stream" aria-label="Solutions Stream">
            <div className="genai-solutions-scroll-track">
              {SOLUTIONS_STREAM.concat(SOLUTIONS_STREAM).map((sol, index) => (
                <div
                  key={`${sol.idx}-${index}`}
                  className="genai-solution-card"
                  tabIndex={0}
                >
                  <div className="genai-card-top">
                    <span className="genai-sol-idx">{sol.idx}</span>
                    <span className="genai-sol-badge">{sol.tag}</span>
                  </div>
                  <h4 className="genai-sol-title">{sol.title}</h4>
                  <p className="genai-sol-desc">{sol.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA Row */}
          <div className="genai-action-row">
            <Link to="/services" className="genai-explore-btn">
              <span>Explore All Capabilities</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="https://axiakairos.com"
              target="_blank"
              rel="noopener noreferrer"
              className="genai-external-link"
            >
              <span>Visit axiakairos.com</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutGenAISection;
