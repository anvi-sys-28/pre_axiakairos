import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, Sparkles } from 'lucide-react';
import GlassFolder, { type FolderFile } from '@/components/ui/glass-folder-cards';

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

export default function GlassFolderShowcaseSection() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [speed, setSpeed] = useState<'normal' | 'fast' | 'slow'>('normal');

  // Duplicate items for continuous seamless scrolling loop
  const displayDossiers = [...DOSSIERS, ...DOSSIERS];

  const durationSec = speed === 'fast' ? 24 : speed === 'slow' ? 60 : 38;

  return (
    <section
      id="glass-folders"
      className="halden-glass-folders-section relative w-full pt-16 pb-14 sm:pt-20 sm:pb-16 bg-gradient-to-b from-white via-slate-50/70 to-slate-50 dark:from-[#070d18] dark:via-[#090f1d] dark:to-[#0c1017] text-slate-900 dark:text-white transition-colors duration-500 overflow-hidden border-t border-slate-200/60 dark:border-white/5"
    >
      <style>{`
        @keyframes dossierMarqueeLeft {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .dossier-marquee-track {
          display: flex;
          width: max-content;
          will-change: transform;
          animation-name: dossierMarqueeLeft;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        .dossier-marquee-track:hover {
          animation-play-state: paused !important;
        }
      `}</style>

      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-10 w-80 h-80 bg-teal-500/5 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/2 right-10 w-80 h-80 bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20 backdrop-blur-md mb-3">
              <Sparkles className="w-3.5 h-3.5 text-teal-500 dark:text-teal-400" />
              Interactive Dossiers & Playbooks
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Enterprise Case Repositories
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl">
              Glassmorphism folders with real frosted optical physics moving right to left in a continuous loop. Hover card to pause and lean glass, click to fan internal files.
            </p>
          </div>

          {/* Controls: Play/Pause Ticker & Speed Switcher */}
          <div className="flex items-center gap-2.5 self-start md:self-end">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm"
              title={isPlaying ? 'Pause right-to-left marquee' : 'Resume right-to-left marquee'}
              aria-label={isPlaying ? 'Pause marquee loop' : 'Resume marquee loop'}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-teal-500" />
                  <span>Pause loop</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-teal-500" />
                  <span>Auto-scroll</span>
                </>
              )}
            </button>

            {/* Speed pill */}
            <div className="hidden sm:flex items-center rounded-full p-0.5 border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 text-[11px] font-mono">
              <button
                type="button"
                onClick={() => setSpeed('slow')}
                className={`px-2.5 py-1 rounded-full transition-colors ${
                  speed === 'slow'
                    ? 'bg-teal-500 text-white font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                0.5x
              </button>
              <button
                type="button"
                onClick={() => setSpeed('normal')}
                className={`px-2.5 py-1 rounded-full transition-colors ${
                  speed === 'normal'
                    ? 'bg-teal-500 text-white font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                1x
              </button>
              <button
                type="button"
                onClick={() => setSpeed('fast')}
                className={`px-2.5 py-1 rounded-full transition-colors ${
                  speed === 'fast'
                    ? 'bg-teal-500 text-white font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                1.5x
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Marquee viewport with soft gradient edge masks */}
      <div
        className="relative w-full overflow-hidden py-6"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Left & Right gradient vignettes for seamless entry/exit fade */}
        <div className="absolute top-0 bottom-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-white dark:from-[#070d18] to-transparent z-20 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-white dark:from-[#070d18] to-transparent z-20 pointer-events-none" />

        {/* Continuous right-to-left scrolling loop */}
        <div
          className="dossier-marquee-track flex items-center gap-8 sm:gap-10 pl-4"
          style={{
            animationDuration: `${durationSec}s`,
            animationPlayState: isPlaying && !isHovered ? 'running' : 'paused',
          }}
        >
          {displayDossiers.map((dossier, idx) => (
            <div
              key={`${dossier.id}-${idx}`}
              className="flex-none transition-transform duration-300 hover:scale-[1.03] cursor-pointer"
            >
              <GlassFolder
                width={310}
                label={dossier.label}
                meta={dossier.meta}
                tone={dossier.tone || 'light'}
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

      {/* Helpful Hint */}
      <div className="text-center mt-4">
        <p className="font-mono text-[11px] tracking-[0.18em] text-slate-400 dark:text-slate-500 uppercase">
          Hover to pause loop · Click folder to fan files · Click + to insert records
        </p>
      </div>
    </section>
  );
}
