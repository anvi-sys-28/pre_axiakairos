import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import '@/styles/industries-serve.css';

export interface IndustryCardItem {
  id: string;
  gradClass: string;
  clientName: string;
  outcome: string;
  monogramType:
    | 'factory'
    | 'bank'
    | 'airplane'
    | 'cart'
    | 'education'
    | 'government'
    | 'energy'
    | 'heart'
    | 'credit-card'
    | 'fuel'
    | 'pill'
    | 'telecom'
    | 'mountain';
  stat1Number: string;
  stat1Label: string;
  stat2Number: string;
  stat2Label: string;
  photoUrl: string;
  photoAlt: string;
}

export const ALL_INDUSTRIES: IndustryCardItem[] = [
  {
    id: 'ind-auto',
    gradClass: 'elo-grad-burnt-ember',
    clientName: 'Automotive & Manufacturing',
    outcome: 'Autonomous shop-floor intelligence & zero-downtime SAP S/4HANA',
    monogramType: 'factory',
    stat1Number: '+663%',
    stat1Label: 'digital enterprise leads',
    stat2Number: '+32%',
    stat2Label: 'faster ERP cycle velocity',
    photoUrl: '/assets/case-studies/manufacturing-automation-sap-btp.webp',
    photoAlt: 'Automated automotive assembly and industrial robotics',
  },
  {
    id: 'ind-bfsi',
    gradClass: 'elo-grad-bright-tangerine',
    clientName: 'Banking & Financial Services',
    outcome: 'Real-time risk scoring, fraud telemetry & regulatory compliance',
    monogramType: 'bank',
    stat1Number: '+340%',
    stat1Label: 'faster fraud detection',
    stat2Number: '99.99%',
    stat2Label: 'STP transaction accuracy',
    photoUrl: '/assets/case-studies/sap-s4hana-migration-bfsi.webp',
    photoAlt: 'Financial trading and enterprise core banking infrastructure',
  },
  {
    id: 'ind-aero',
    gradClass: 'elo-grad-deep-rust',
    clientName: 'Aviation & Aerospace',
    outcome: 'Flight operations optimization & predictive fleet telemetry',
    monogramType: 'airplane',
    stat1Number: '+48%',
    stat1Label: 'fleet turnaround velocity',
    stat2Number: '-36%',
    stat2Label: 'unplanned maintenance events',
    photoUrl: '/assets/card_sunset.jpg',
    photoAlt: 'Commercial aviation operations at sunset',
  },
  {
    id: 'ind-retail',
    gradClass: 'elo-grad-warm-amber',
    clientName: 'E-commerce & Retail',
    outcome: 'Omnichannel inventory orchestration & customer personalization',
    monogramType: 'cart',
    stat1Number: '+280%',
    stat1Label: 'online checkout conversion',
    stat2Number: '-42%',
    stat2Label: 'stockout replenishment lag',
    photoUrl: '/assets/case-studies/cloud-modernization-retail.webp',
    photoAlt: 'Modern retail logistics fulfillment center',
  },
  {
    id: 'ind-edu',
    gradClass: 'elo-grad-rich-terracotta',
    clientName: 'Education & Learning',
    outcome: 'Campus-wide adaptive AI tutors & sovereign student portals',
    monogramType: 'education',
    stat1Number: '+190%',
    stat1Label: 'student engagement rate',
    stat2Number: '75k+',
    stat2Label: 'active credential verifications',
    photoUrl: 'https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/d469e4d7-94ba-4457-ad51-b589766069f0.webp',
    photoAlt: 'University campus architecture and modern study center',
  },
  {
    id: 'ind-gov',
    gradClass: 'elo-grad-burnt-sienna',
    clientName: 'E-Governance & Public Sector',
    outcome: 'Sovereign citizen services, zero-trust cloud & high-capacity portals',
    monogramType: 'government',
    stat1Number: '+450%',
    stat1Label: 'citizen service throughput',
    stat2Number: '100%',
    stat2Label: 'sovereign data governance',
    photoUrl: '/assets/case-studies/public-sector-data-analytics-automation.webp',
    photoAlt: 'Public sector digital operations center',
  },
  {
    id: 'ind-energy',
    gradClass: 'elo-grad-molten-copper',
    clientName: 'Energy & Utilities',
    outcome: 'Smart grid telemetry, sovereign IoT & predictive dispatch',
    monogramType: 'energy',
    stat1Number: '+410%',
    stat1Label: 'grid sensor telemetry',
    stat2Number: '-28%',
    stat2Label: 'transmission outage frequency',
    photoUrl: '/assets/case-studies/sap-s-4-hana-migration-and-data-governance-modernization-for-a-global-energy-and-utilities-enterprise.webp',
    photoAlt: 'Renewable and electrical grid infrastructure',
  },
  {
    id: 'ind-health',
    gradClass: 'elo-grad-sunset-coral',
    clientName: 'Healthcare & Life Sciences',
    outcome: 'HIPAA-compliant private clinical RAG & EHR automation',
    monogramType: 'heart',
    stat1Number: '+362%',
    stat1Label: 'clinical workflow capacity',
    stat2Number: '+75%',
    stat2Label: 'automated direct bookings',
    photoUrl: '/assets/case-studies/healthcare-data-integration-sap-btp.webp',
    photoAlt: 'Advanced clinical treatment suite and diagnostics',
  },
  {
    id: 'ind-fintech',
    gradClass: 'elo-grad-cinnabar',
    clientName: 'Lending & FinTech',
    outcome: 'Sub-second underwriting, decentralized identity & smart ledger',
    monogramType: 'credit-card',
    stat1Number: '+520%',
    stat1Label: 'loan origination velocity',
    stat2Number: '-64%',
    stat2Label: 'manual verification overhead',
    photoUrl: 'https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/e791074d-795e-4b42-ad94-a6b113ecb72d.webp',
    photoAlt: 'Fintech executive operations and wealth suite',
  },
  {
    id: 'ind-oil',
    gradClass: 'elo-grad-burnt-ember',
    clientName: 'Oil & Gas',
    outcome: 'Upstream pipeline surveillance & generative asset maintenance',
    monogramType: 'fuel',
    stat1Number: '+195%',
    stat1Label: 'asset operational visibility',
    stat2Number: '0',
    stat2Label: 'unplanned refinery shutdowns',
    photoUrl: 'https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/c42a7f3d-d802-4377-8cc6-9c209cdfad5f.webp',
    photoAlt: 'Industrial refinery terminal at sunset',
  },
  {
    id: 'ind-pharma',
    gradClass: 'elo-grad-bright-tangerine',
    clientName: 'Pharmaceuticals & Biotech',
    outcome: 'GxP data integrity, drug discovery pipeline & batch release',
    monogramType: 'pill',
    stat1Number: '+82%',
    stat1Label: 'faster batch validation',
    stat2Number: '100%',
    stat2Label: 'FDA audit trail compliance',
    photoUrl: '/assets/case-studies/pharma-data-compliance-automation.webp',
    photoAlt: 'Biotech laboratory and pharmaceutical production',
  },
  {
    id: 'ind-telecom',
    gradClass: 'elo-grad-deep-rust',
    clientName: 'Telecommunications & Media',
    outcome: '5G network slice orchestration & automated service provisioning',
    monogramType: 'telecom',
    stat1Number: '+310%',
    stat1Label: 'network rollout velocity',
    stat2Number: '-50%',
    stat2Label: 'customer ticket escalations',
    photoUrl: '/assets/case-studies/cloud-modernization-telecom.webp',
    photoAlt: 'Telecommunications satellite and fiber network',
  },
  {
    id: 'ind-maritime',
    gradClass: 'elo-grad-golden-ember',
    clientName: 'Maritime Logistics & Ports',
    outcome: 'Regional visibility & autonomous berth clearance',
    monogramType: 'mountain',
    stat1Number: '+240%',
    stat1Label: 'vessel throughput capacity',
    stat2Number: '+180%',
    stat2Label: 'direct automated clearances',
    photoUrl: '/assets/case-studies/logistics-sap-automation-integration.webp',
    photoAlt: 'Automated deep-water container terminal',
  },
];

const HEADLINE_WORDS = [
  'How', 'businesses', 'achieved', 'measurable', 'results', 'with', 'Axia', 'Kairos'
];

function renderMonogram(type: IndustryCardItem['monogramType']) {
  switch (type) {
    case 'factory':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
          <path d="M2 20h20v-8l-5 4v-4l-5 4V8l-5 4v4H2v4z" />
        </svg>
      );
    case 'bank':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
          <path d="M4 10h16M2 10l10-7 10 7M6 10v8m4-8v8m4-8v8m4-8v8M3 21h18" />
        </svg>
      );
    case 'airplane':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
          <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21 4 20 3c-1-1-3-1-4.5.5L12 7 3.8 5.2 2 7l7 4-3 3-2.5-.5L2 15l3.5 2 2 3.5 1.5-1.5-.5-2.5 3-3 4 7 1.8-1.8z" />
        </svg>
      );
    case 'cart':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
          <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
      );
    case 'education':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      );
    case 'government':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
          <path d="M3 21h18M5 21V11M19 21V11M9 21V11m6 10V11M12 3a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z" />
        </svg>
      );
    case 'energy':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    case 'heart':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      );
    case 'credit-card':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
          <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
      );
    case 'fuel':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
          <path d="M3 22h12V4a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v18zm12-9h3a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2 2 2 0 0 0 2-2V9.5a2.5 2.5 0 0 0-5 0V13" />
          <line x1="6" y1="7" x2="12" y2="7" />
        </svg>
      );
    case 'pill':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
          <line x1="8.5" y1="8.5" x2="15.5" y2="15.5" />
          <path d="M10.5 20.5l10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7z" />
        </svg>
      );
    case 'telecom':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
          <path d="M12 20v-8" />
          <circle cx="12" cy="4" r="2" />
          <path d="M7.05 8.05a7 7 0 0 0 0 9.9m9.9-9.9a7 7 0 0 1 0 9.9M4.22 5.22a11 11 0 0 0 0 15.56m15.56-15.56a11 11 0 0 1 0 15.56" />
        </svg>
      );
    case 'mountain':
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
          <path d="M8 3l4 8 5-5 5 15H2L8 3z" />
        </svg>
      );
  }
}

export const IndustriesWeServeSection: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  // Manual nudge left / right
  const handleNudge = (direction: 'left' | 'right') => {
    if (trackRef.current) {
      const offset = direction === 'left' ? -320 : 320;
      trackRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Seamless looping duplicate set
  const displayedCards = [...ALL_INDUSTRIES, ...ALL_INDUSTRIES];

  return (
    <section className="elo-results-section" id="industries" aria-label="Industries We Serve">
      <div className="elo-frame">
        {/* Eyebrow */}
        <div className="elo-eyebrow">
          <span>INDUSTRIES WE SERVE</span>
        </div>

        {/* Headline with word-by-word staggered entrance */}
        <h2 className="elo-headline">
          {HEADLINE_WORDS.map((word, i) => (
            <span
              key={word + i}
              className="elo-word"
              style={{ animationDelay: `${0.08 * i}s` }}
            >
              {word}&nbsp;
            </span>
          ))}
        </h2>

        {/* Lead */}
        <p className="elo-lead">
          Our clients come from very different industries, but the goal is always the same:
          measurable results. Explore how Axia Kairos accelerates mission-critical enterprise transformations across global sectors.
        </p>

        {/* Thin Drawing Rule */}
        <div className="elo-draw-rule" aria-hidden="true" />
      </div>

      {/* Full-Bleed Horizontal Conveyor Carousel */}
      <div
        className="elo-carousel-stage"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <div
          ref={trackRef}
          className={`elo-carousel-track ${isPaused ? 'is-paused' : ''}`}
        >
          {displayedCards.map((card, idx) => (
            <div
              key={`${card.id}-${idx}`}
              className={`elo-card ${card.gradClass}`}
            >
              {/* Card Top Row */}
              <div className="elo-card-top">
                <div className="elo-card-header">
                  <h3 className="elo-client-name">{card.clientName}</h3>
                  <p className="elo-card-outcome">{card.outcome}</p>
                </div>

                {/* SVG Monogram */}
                <div className="elo-monogram" aria-hidden="true">
                  {renderMonogram(card.monogramType)}
                </div>
              </div>

              {/* Stats Row */}
              <div className="elo-stats-row">
                <div className="elo-stat-box">
                  <span className="elo-stat-number">{card.stat1Number}</span>
                  <span className="elo-stat-label">{card.stat1Label}</span>
                </div>
                <div className="elo-stat-divider" aria-hidden="true" />
                <div className="elo-stat-box">
                  <span className="elo-stat-number">{card.stat2Number}</span>
                  <span className="elo-stat-label">{card.stat2Label}</span>
                </div>
              </div>

              {/* Lower Section: Offset Paper Layers & Cover Photo */}
              <div className="elo-photo-stage">
                <div className="elo-paper-layer elo-paper-1" aria-hidden="true" />
                <div className="elo-paper-layer elo-paper-2" aria-hidden="true" />
                <div className="elo-photo-frame">
                  <img
                    src={card.photoUrl}
                    alt={card.photoAlt}
                    className="elo-photo-img"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar: Manual Arrows & View More CTA */}
      <div className="elo-frame">
        <div className="elo-bottom-bar">
          <button
            type="button"
            className="elo-nav-btn"
            onClick={() => handleNudge('left')}
            aria-label="Scroll left"
            title="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <Link to="/case-studies" className="elo-btn">
            <span>View all industry projects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            className="elo-nav-btn"
            onClick={() => handleNudge('right')}
            aria-label="Scroll right"
            title="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default IndustriesWeServeSection;
