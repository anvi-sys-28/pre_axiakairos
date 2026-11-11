import React, { useState, useEffect } from 'react';
import {
  Building2,
  Copy,
  Check,
  ExternalLink,
  Target,
  Compass,
  ShieldCheck,
  Award,
  Zap,
  HeartHandshake,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Clock,
  TrendingUp,
  Globe2,
} from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { SEO } from '../components/SEO';
import DuotoneTeamRoster from '../components/ui/duotone-team-roster';
import { Timeline, type TimelineEntry } from '../components/ui/timeline';
import { ServiceRequestForm } from '../components/ServiceRequestForm';
import { useCMS, DEFAULT_ABOUT_PAGE } from '../lib/cmsStore';
import { aboutData, type MilestoneItem } from '../data/about';

export function AboutPage() {
  const cms = useCMS();
  const aboutCMS = cms.aboutPage || DEFAULT_ABOUT_PAGE;
  const roster = aboutCMS.teamRoster || DEFAULT_ABOUT_PAGE.teamRoster;

  // Dark mode detection
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
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

    return () => observer.disconnect();
  }, []);

  // Copy address state feedback with 2-second timeout
  const [copiedAddressIndex, setCopiedAddressIndex] = useState<number | null>(null);

  const handleCopyAddress = async (text: string, index: number) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopiedAddressIndex(index);
      setTimeout(() => setCopiedAddressIndex(null), 2000);
    } catch (err) {
      console.warn('Copy address failed:', err);
    }
  };

  // Section 5 Timeline Entries
  const milestoneHighlights: Record<string, { tags: string[] }> = {
    'milestone-1': {
      tags: ['Automotive & Lubricants', 'Enterprise Kickoff'],
    },
    'milestone-2': {
      tags: ['Pharmaceuticals', 'Regulated Markets'],
    },
    'milestone-3': {
      tags: ['Retail & Commerce', 'Multi-Industry Growth'],
    },
    'milestone-4': {
      tags: ['Bangalore Entity', 'Global Delivery Center'],
    },
    'milestone-5': {
      tags: ['Global Scale', 'Future Roadmap'],
    },
  };

  const timelineMilestones: TimelineEntry[] = aboutData.journeyAndMilestones.milestones.map((item) => {
    const isUpcoming = item.status === 'upcoming';
    const highlights = milestoneHighlights[item.id] || { tags: [] };

    return {
      title: item.displayDate,
      content: (
        <div className="space-y-4">
          <div
            className={`p-6 md:p-8 rounded-2xl transition-all duration-300 backdrop-blur-xs ${
              isUpcoming
                ? 'bg-white/40 dark:bg-white/[0.02] border border-dashed border-[#c2a675]/40 dark:border-[#c2a675]/30'
                : 'bg-white/70 dark:bg-white/[0.02] border border-slate-200/70 dark:border-white/10 hover:border-[#c2a675]/60 dark:hover:border-[#c2a675]/60 hover:shadow-[0_4px_24px_rgba(194,166,117,0.12)]'
            }`}
          >
            {/* Header: Date mono + Status pill */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#c2a675] dark:text-[#dfc493]">
                {item.displayDate}
              </span>
              {isUpcoming ? (
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-[#c2a675]/10 dark:bg-[#c2a675]/15 text-[#9e7d3b] dark:text-[#dfc493] border border-[#c2a675]/30 uppercase tracking-widest font-semibold">
                  <Clock className="w-3.5 h-3.5 text-[#c2a675] dark:text-[#dfc493] animate-pulse" />
                  Upcoming Roadmap
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-[#c2a675]/10 dark:bg-[#c2a675]/15 text-[#9e7d3b] dark:text-[#dfc493] border border-[#c2a675]/30 uppercase tracking-wider font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#c2a675]" />
                  Milestone Achieved
                </span>
              )}
            </div>

            {/* Tag chips */}
            {highlights.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {highlights.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[11px] px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 hover:border-[#c2a675]/40 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Verbatim Description */}
            <p
              className={`text-sm md:text-base leading-relaxed ${
                isUpcoming
                  ? 'text-slate-600 dark:text-slate-300 italic'
                  : 'text-slate-700 dark:text-slate-200 font-normal'
              }`}
            >
              {item.text}
            </p>

            {/* Developer note visible only during development */}
            {isUpcoming && import.meta.env.DEV && (
              <div className="mt-4 pt-3 border-t border-dashed border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-400">
                {/* TODO(client): "Milestones are dated; request updates after Nov 2025" */}
                [TODO(client): Milestones are dated; request updates after Nov 2025]
              </div>
            )}
          </div>
        </div>
      ),
    };
  });

  // Value icons map with warm gold palette
  const valueIcons = [
    <ShieldCheck key="v-01" className="w-5 h-5 text-[#c2a675] dark:text-[#dfc493]" />,
    <Award key="v-02" className="w-5 h-5 text-[#c2a675] dark:text-[#dfc493]" />,
    <Zap key="v-03" className="w-5 h-5 text-[#c2a675] dark:text-[#dfc493]" />,
    <HeartHandshake key="v-04" className="w-5 h-5 text-[#c2a675] dark:text-[#dfc493]" />,
    <Users key="v-05" className="w-5 h-5 text-[#c2a675] dark:text-[#dfc493]" />,
  ];

  // Why Axia icons map with warm gold palette
  const whyIcons = [
    <TrendingUp key="w-1" className="w-5 h-5 text-[#c2a675] dark:text-[#dfc493]" />,
    <Target key="w-2" className="w-5 h-5 text-[#c2a675] dark:text-[#dfc493]" />,
    <Sparkles key="w-3" className="w-5 h-5 text-[#c2a675] dark:text-[#dfc493]" />,
    <Globe2 key="w-4" className="w-5 h-5 text-[#c2a675] dark:text-[#dfc493]" />,
    <ShieldCheck key="w-5" className="w-5 h-5 text-[#c2a675] dark:text-[#dfc493]" />,
  ];

  // JSON-LD structured schemas
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Axia Kairos',
    url: 'https://axiakairos.com',
    logo: 'https://axiakairos.com/l.webp',
    description: 'Axia Kairos is a next-gen tech consulting firm specializing in enterprise transformation, cloud modernization, and data innovation.',
    address: [
      {
        '@type': 'PostalAddress',
        name: 'Axia Kairos Consulting Inc',
        streetAddress: '34 Minowan Miikan Lane',
        addressLocality: 'Toronto',
        addressRegion: 'ON',
        postalCode: 'M6J0G3',
        addressCountry: 'CA',
      },
      {
        '@type': 'PostalAddress',
        name: 'Axia Kairos Software Solutions Pvt. Ltd.',
        streetAddress: 'Regus, The Estate, 8th Floor, Dickenson Road',
        addressLocality: 'Bangalore',
        addressRegion: 'Karnataka',
        postalCode: '560042',
        addressCountry: 'IN',
      },
    ],
    areaServed: ['Canada', 'USA', 'UAE', 'India'],
    sameAs: [
      'https://www.facebook.com/axiakairos',
      'https://www.linkedin.com/company/axiakairos/',
      'https://x.com/axia_kairos',
      'https://twitter.com/axiakairos',
      'https://www.instagram.com/axiakairos/',
    ],
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://axiakairos.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'About Us',
        item: 'https://axiakairos.com/about-us',
      },
    ],
  };

  return (
    <div className="min-h-screen w-full bg-[#f8f9fb] dark:bg-[#05080e] text-[#0b192c] dark:text-slate-100 flex flex-col selection:bg-[#c2a675]/25 overflow-x-clip transition-colors duration-300">
      <SEO
        title="About Axiakairos | IT & Digital Transformation Experts"
        description="Learn about Axiakairos, a trusted provider of IT, AI, and digital transformation services delivering innovative, scalable solutions worldwide."
        canonicalUrl="https://axiakairos.com/about-us"
        ogImage="/l.webp"
        jsonLd={[organizationSchema, breadcrumbSchema]}
      />

      {/* Global Navigation Header */}
      <Header />

      <main className="w-full flex-1 flex flex-col">
        {/* ========================================================
            SECTION 1: Duotone Team & Leadership Hero (PRESERVED)
            ======================================================== */}
        <section aria-label="Leadership & Team Roster">
          <DuotoneTeamRoster
            eyebrow={roster.eyebrow || 'LEADERSHIP · EXPERTISE · VALUES'}
            title={roster.title || 'The\nminds'}
            intro={
              roster.intro ||
              'Strategic consultants, digital architects, and transformation leaders empowering global enterprises to navigate complexity.'
            }
            cta={{
              label: roster.ctaLabel || 'Join the team',
              href: roster.ctaHref || '/careers',
            }}
            secondaryCta={{
              label: roster.secondaryCtaLabel || 'Our Approach →',
              href: roster.secondaryCtaHref || '/services',
            }}
            preset={isDark ? 'axiaDark' : 'axiaLight'}
            height="100vh"
            showPhotos={false}
            columns={roster.columns || 3}
            driftSeconds={roster.driftSeconds || 22}
            members={
              roster.members && roster.members.length > 0
                ? roster.members
                : DEFAULT_ABOUT_PAGE.teamRoster.members
            }
            openRoles={
              roster.openRoles && roster.openRoles.length > 0
                ? roster.openRoles
                : DEFAULT_ABOUT_PAGE.teamRoster.openRoles
            }
          />
        </section>

        {/* ========================================================
            UNIFIED COMMON CONTENT SECTION WITH CONTINUOUS GRID BACKGROUND
            (Combines Sections 2 - 7 into one cohesive architectural story)
            ======================================================== */}
        <div className="relative w-full bg-[#f8f9fb] dark:bg-[#0a1122] text-[#0b192c] dark:text-slate-100 transition-colors duration-300 overflow-hidden">
          
          {/* Continuous Subtle Grid Background Layer */}
          <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
            {/* Grid Image from user upload with gentle, non-dominating opacity */}
            <div 
              className="absolute inset-0 bg-repeat opacity-15 dark:opacity-20 hidden dark:block"
              style={{
                backgroundImage: "url('/assets/grid-bg.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
              }}
            />
            {/* Soft, delicate architectural hairline grid lines */}
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(to right, currentColor 1px, transparent 1px),
                  linear-gradient(to bottom, currentColor 1px, transparent 1px)
                `,
                backgroundSize: '56px 56px',
                color: isDark ? 'rgba(255, 255, 255, 0.035)' : 'rgba(11, 25, 44, 0.035)',
                maskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, #000 50%, transparent 95%)',
                WebkitMaskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, #000 50%, transparent 95%)',
              }}
            />
            {/* Ambient gold glow points to soften and warm up the background */}
            <div className="absolute top-[8%] right-[15%] w-[650px] h-[650px] bg-[#c2a675]/8 dark:bg-[#c2a675]/10 rounded-full blur-[160px]" />
            <div className="absolute top-[40%] left-[10%] w-[650px] h-[650px] bg-[#c2a675]/6 dark:bg-[#c2a675]/8 rounded-full blur-[160px]" />
            <div className="absolute top-[75%] right-[15%] w-[650px] h-[650px] bg-[#c2a675]/8 dark:bg-[#c2a675]/10 rounded-full blur-[160px]" />
          </div>

          <div className="relative z-10">

            {/* ========================================================
                SECTION 2: "Who We Are"
                ======================================================== */}
            <section
              id="who-we-are"
              className="py-20 sm:py-24 px-6 md:px-12 lg:px-20 transition-colors duration-300"
            >
              <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="max-w-3xl mb-14 sm:mb-16">
                  <span className="font-mono text-xs uppercase tracking-widest text-[#c2a675] dark:text-[#dfc493] font-semibold mb-3 inline-block">
                    {aboutData.whoWeAre.eyebrow}
                  </span>
                  <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#0b192c] dark:text-white tracking-tight leading-[1.15]">
                    Who <span className="italic font-normal font-serif text-[#c2a675] dark:text-[#dfc493]">We</span> Are
                  </h2>
                  <div className="mt-6 space-y-4 text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {aboutData.whoWeAre.lead.split('\n\n').map((paragraph, pIdx) => (
                      <p key={pIdx}>{paragraph}</p>
                    ))}
                  </div>
                </div>

                {/* Content Grid: Left (Headquarters) | Right (Locations & Focus Areas) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left Column: Headquarters Address Blocks (lg:col-span-6) */}
                  <div className="lg:col-span-6 flex flex-col space-y-4">
                    <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-[#c2a675] dark:text-[#dfc493] font-semibold mb-1">
                      <Building2 className="w-4 h-4 text-[#c2a675] dark:text-[#dfc493]" />
                      <span>Headquarters & Operational Hubs</span>
                    </div>

                    <div className="p-7 sm:p-8 rounded-2xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-xs border border-slate-200/70 dark:border-white/10 space-y-7 divide-y divide-slate-200/60 dark:divide-white/10 shadow-xs">
                      {aboutData.whoWeAre.headquarters.map((hq, idx) => (
                        <div key={idx} className={idx > 0 ? "pt-7 flex flex-col justify-between" : "flex flex-col justify-between"}>
                          <div>
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#0b192c] dark:text-white leading-snug">
                                {hq.company}
                              </h3>
                              <span className="font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-[#c2a675]/10 dark:bg-[#c2a675]/15 text-[#9e7d3b] dark:text-[#dfc493] border border-[#c2a675]/30 shrink-0 font-semibold">
                                Hub 0{idx + 1}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-2 whitespace-pre-line">
                              {hq.address}
                            </p>
                          </div>

                          {/* Action buttons: Copy Address & Open in Maps */}
                          <div className="mt-5 flex flex-wrap items-center gap-3">
                            <button
                              type="button"
                              onClick={() => handleCopyAddress(hq.address, idx)}
                              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-white dark:bg-white/5 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-white/10 hover:border-[#c2a675]/60 hover:text-[#9e7d3b] dark:hover:text-[#dfc493] transition-all active:scale-95 cursor-pointer"
                              aria-label={`Copy address for ${hq.company}`}
                            >
                              {copiedAddressIndex === idx ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-500 animate-in fade-in" />
                                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copy address</span>
                                </>
                              )}
                            </button>

                            <a
                              href={hq.googleMapsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-[#c2a675]/10 dark:bg-[#c2a675]/15 text-[#9e7d3b] dark:text-[#dfc493] border border-[#c2a675]/30 hover:bg-[#c2a675] hover:text-[#0b192c] dark:hover:text-[#0b192c] transition-all"
                            >
                              <span>Open in Maps</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Operating Countries & Practice Focus Areas (lg:col-span-6) */}
                  <div className="lg:col-span-6 flex flex-col space-y-4">
                    <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-[#c2a675] dark:text-[#dfc493] font-semibold mb-1">
                      <Globe2 className="w-4 h-4 text-[#c2a675] dark:text-[#dfc493]" />
                      <span>Scale & Competencies</span>
                    </div>

                    <div className="p-7 sm:p-8 rounded-2xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-xs border border-slate-200/70 dark:border-white/10 space-y-8 shadow-xs">
                      {/* Locations Block */}
                      <div>
                        <div className="text-xs font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 font-semibold mb-4">
                          Global Operating Presence
                        </div>
                        <div className="flex flex-wrap gap-2.5">
                          {aboutData.whoWeAre.operatingCountries.map((c, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-xs md:text-sm font-medium text-slate-800 dark:text-slate-200 shadow-2xs"
                            >
                              <span className="text-base" role="img" aria-label={c.name}>
                                {c.flag}
                              </span>
                              <span>{c.name}</span>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Hairline Divider */}
                      <div className="border-t border-slate-200/60 dark:border-white/10 pt-7">
                        <div className="text-xs font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 font-semibold mb-4">
                          Enterprise Practice Domains
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {aboutData.whoWeAre.focusAreas.map((area, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-xs font-medium text-slate-700 dark:text-slate-300 hover:border-[#c2a675]/50 transition-colors shadow-2xs"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-[#c2a675]" />
                              <span>{area}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ========================================================
                SECTION 3: "Mission" and "Vision"
                ======================================================== */}
            <section
              id="mission-vision"
              className="py-20 sm:py-24 px-6 md:px-12 lg:px-20 border-t border-slate-200/60 dark:border-white/10 transition-colors duration-300"
            >
              <div className="max-w-7xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
                  <span className="font-mono text-xs uppercase tracking-widest text-[#c2a675] dark:text-[#dfc493] font-semibold mb-3 inline-block">
                    {aboutData.missionVision.eyebrow}
                  </span>
                  <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#0b192c] dark:text-white tracking-tight">
                    Our <span className="italic font-normal font-serif text-[#c2a675] dark:text-[#dfc493]">Mission</span> & Vision
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {aboutData.missionVision.cards.map((card) => {
                    const isMission = card.key === 'mission';
                    return (
                      <div
                        key={card.key}
                        className="p-8 md:p-10 rounded-2xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-xs border border-slate-200/70 dark:border-white/10 relative overflow-hidden transition-all duration-300 hover:border-[#c2a675]/60 hover:shadow-[0_4px_28px_rgba(194,166,117,0.12)] flex flex-col justify-between"
                      >
                        <div>
                          {/* Header with Icon and Mono Label */}
                          <div className="flex items-center justify-between mb-6">
                            <div className="w-12 h-12 rounded-xl bg-[#c2a675]/10 dark:bg-[#c2a675]/15 border border-[#c2a675]/30 flex items-center justify-center text-[#9e7d3b] dark:text-[#dfc493]">
                              {isMission ? <Target className="w-6 h-6" /> : <Compass className="w-6 h-6" />}
                            </div>
                            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#9e7d3b] dark:text-[#dfc493] px-3 py-1 rounded-full bg-[#c2a675]/10 dark:bg-[#c2a675]/15 border border-[#c2a675]/30">
                              {card.label}
                            </span>
                          </div>

                          <h3 className="font-serif text-2xl font-bold text-[#0b192c] dark:text-white mb-4">
                            {card.title}
                          </h3>

                          <p className="text-base text-slate-700 dark:text-slate-200 font-medium leading-relaxed mb-6">
                            {card.headline}
                          </p>

                          {card.bullets && card.bullets.length > 0 && (
                            <div className="space-y-2.5 pt-4 border-t border-slate-200/60 dark:border-white/10">
                              <p className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                {card.bulletLead}
                              </p>
                              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                                {card.bullets.map((bullet, bIdx) => (
                                  <li key={bIdx} className="flex items-start space-x-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#c2a675] mt-2 shrink-0" />
                                    <span>{bullet}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        {/* Developer note visible only during development */}
                        {import.meta.env.DEV && (
                          <div className="mt-6 pt-3 border-t border-dashed border-slate-200/60 dark:border-white/10 text-[10px] font-mono text-slate-400">
                            {/* TODO(client): "Mission/Vision statements needed" (recovered verbatim from live site RSC payload) */}
                            Source: Verbatim from live axiakairos.com Next.js RSC payload
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* ========================================================
                SECTION 4: "Our Core Values"
                ======================================================== */}
            <section
              id="core-values"
              className="py-20 sm:py-24 px-6 md:px-12 lg:px-20 border-t border-slate-200/60 dark:border-white/10 transition-colors duration-300"
            >
              <div className="max-w-7xl mx-auto">
                {/* Heading & Lead */}
                <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
                  <span className="font-mono text-xs uppercase tracking-widest text-[#c2a675] dark:text-[#dfc493] font-semibold mb-3 inline-block">
                    {aboutData.coreValues.eyebrow}
                  </span>
                  <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#0b192c] dark:text-white tracking-tight">
                    Our <span className="italic font-normal font-serif text-[#c2a675] dark:text-[#dfc493]">Core</span> Values
                  </h2>
                  <p className="mt-4 text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                    {aboutData.coreValues.lead}
                  </p>
                </div>

                {/* 5 Open Value Panels */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {aboutData.coreValues.values.map((val, idx) => (
                    <div
                      key={val.index}
                      className="p-7 rounded-2xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-xs border border-slate-200/70 dark:border-white/10 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#c2a675]/70 hover:shadow-[0_4px_24px_rgba(194,166,117,0.12)] group flex flex-col justify-between"
                    >
                      <div>
                        {/* Index & Icon */}
                        <div className="flex items-center justify-between mb-5">
                          <span className="font-mono text-xs font-bold tracking-widest text-[#c2a675] dark:text-[#dfc493]">
                            {val.index}
                          </span>
                          <div className="p-2 rounded-lg bg-slate-100/80 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 group-hover:border-[#c2a675]/40 transition-colors">
                            {valueIcons[idx] || <ShieldCheck className="w-5 h-5 text-[#c2a675]" />}
                          </div>
                        </div>

                        {/* Serif Title */}
                        <h3 className="font-serif text-xl font-bold text-[#0b192c] dark:text-white mb-2.5">
                          {val.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          {val.description}
                        </p>
                      </div>

                      {/* Dev-only placeholder for Innovation copy duplicate */}
                      {val.isDuplicateError && import.meta.env.DEV && (
                        <div className="mt-4 p-2 rounded bg-amber-500/10 border border-amber-500/30 text-[11px] font-mono text-amber-700 dark:text-amber-300">
                          {/* TODO(client): "Innovation description duplicates Integrity; client to provide correct text" */}
                          [TODO(client): Innovation copy duplicates Integrity on live site]
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ========================================================
                SECTION 5: "Our Journey & Milestones"
                ======================================================== */}
            <Timeline
              id="journey-milestones"
              data={timelineMilestones}
              eyebrow={aboutData.journeyAndMilestones.eyebrow}
              title={aboutData.journeyAndMilestones.heading}
              description={aboutData.journeyAndMilestones.lead}
              className="bg-transparent dark:bg-transparent border-t border-slate-200/60 dark:border-white/10"
            />

            {/* ========================================================
                SECTION 6: "Why Axia Kairos"
                ======================================================== */}
            <section
              id="why-axia-kairos"
              className="py-20 sm:py-24 px-6 md:px-12 lg:px-20 border-t border-slate-200/60 dark:border-white/10 transition-colors duration-300"
            >
              <div className="max-w-7xl mx-auto">
                {/* Heading & Lead */}
                <div className="max-w-3xl mb-14 sm:mb-16">
                  <span className="font-mono text-xs uppercase tracking-widest text-[#c2a675] dark:text-[#dfc493] font-semibold mb-3 inline-block">
                    {aboutData.whyAxiaKairos.eyebrow}
                  </span>
                  <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#0b192c] dark:text-white tracking-tight leading-[1.15]">
                    Why <span className="italic font-normal font-serif text-[#c2a675] dark:text-[#dfc493]">Axia Kairos</span>
                  </h2>
                  <p className="mt-4 text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {aboutData.whyAxiaKairos.lead}
                  </p>
                </div>

                {/* 5 Open Differentiator Panels */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {aboutData.whyAxiaKairos.points.map((pt, idx) => (
                    <div
                      key={pt.index}
                      className="p-7 rounded-2xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-xs border border-slate-200/70 dark:border-white/10 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#c2a675]/60 hover:shadow-[0_4px_24px_rgba(194,166,117,0.12)] flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-10 h-10 rounded-lg bg-[#c2a675]/10 dark:bg-[#c2a675]/15 border border-[#c2a675]/30 flex items-center justify-center text-[#9e7d3b] dark:text-[#dfc493]">
                            {whyIcons[idx] || <CheckCircle2 className="w-5 h-5 text-[#c2a675]" />}
                          </div>
                          <span className="font-mono text-xs font-bold text-[#c2a675] dark:text-[#dfc493]">
                            0{pt.index}
                          </span>
                        </div>

                        <h3 className="font-serif text-lg font-bold text-[#0b192c] dark:text-white mb-2">
                          {pt.title}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          {pt.description}
                        </p>
                      </div>

                      {/* Dev note for Valvolink consent check */}
                      {pt.index === 5 && import.meta.env.DEV && (
                        <div className="mt-3 text-[10px] font-mono text-slate-400 border-t border-slate-200/60 dark:border-white/10 pt-2">
                          {/* TODO(client): "Confirm client consent to be named" */}
                          [TODO(client): Confirm client consent to be named: Valvolink]
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ========================================================
                SECTION 7: "Partner With Us"
                ======================================================== */}
            <section
              id="partner-with-us"
              className="py-20 sm:py-24 px-6 md:px-12 lg:px-20 border-t border-slate-200/60 dark:border-white/10 bg-white/40 dark:bg-[#070b14]/80 backdrop-blur-md relative overflow-hidden"
            >
              {/* Subtle background ambient glows in warm gold */}
              <div
                className="absolute top-0 right-1/4 w-96 h-96 bg-[#c2a675]/10 rounded-full blur-3xl pointer-events-none"
                aria-hidden="true"
              />
              <div
                className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#c2a675]/5 rounded-full blur-3xl pointer-events-none"
                aria-hidden="true"
              />

              <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                  {/* Left Column: Heading, Paragraph, and Value Proposition (lg:col-span-5) */}
                  <div className="lg:col-span-5 flex flex-col justify-between">
                    <div>
                      <span className="font-mono text-xs uppercase tracking-widest text-[#c2a675] font-semibold mb-3 inline-block">
                        {aboutData.partnerWithUs.eyebrow}
                      </span>
                      <p className="text-sm font-mono text-slate-500 dark:text-slate-300 mb-2">
                        {aboutData.partnerWithUs.question}
                      </p>
                      <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#0b192c] dark:text-white tracking-tight leading-[1.15] mb-6">
                        Partner <span className="italic font-normal font-serif text-[#c2a675]">with Us</span>
                      </h2>
                      <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
                        {aboutData.partnerWithUs.paragraph}
                      </p>
                    </div>

                    {/* Key Partnership Highlights */}
                    <div className="space-y-4 pt-6 border-t border-slate-200/60 dark:border-white/10">
                      <div className="flex items-start space-x-3 text-sm text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-5 h-5 text-[#c2a675] shrink-0 mt-0.5" />
                        <span>Direct access to managing partners & practice leadership</span>
                      </div>
                      <div className="flex items-start space-x-3 text-sm text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-5 h-5 text-[#c2a675] shrink-0 mt-0.5" />
                        <span>Confidential exploratory advisory and transformation scoping</span>
                      </div>
                      <div className="flex items-start space-x-3 text-sm text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-5 h-5 text-[#c2a675] shrink-0 mt-0.5" />
                        <span>Global delivery reach across North America, UAE & India</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Existing Shared Form Component (lg:col-span-7) */}
                  <div className="lg:col-span-7 w-full">
                    <ServiceRequestForm
                      source="about-us-partner"
                      hideServiceSelect={true}
                      theme={isDark ? "navy" : "light"}
                      badge=""
                      title=""
                      subtitle=""
                      messageLabel="Your Message or Partnership Idea"
                      messagePlaceholder="Share details about your enterprise objectives or strategic collaboration idea..."
                      submitButtonText="Send Partner Inquiry"
                      className="w-full max-w-none"
                    />
                  </div>
                </div>
              </div>
            </section>

          </div>
        </div>
      </main>

      {/* Shared Ticket Stub Footer */}
      <Footer />
    </div>
  );
}

export default AboutPage;
