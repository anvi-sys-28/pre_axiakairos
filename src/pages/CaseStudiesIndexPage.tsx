import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Search, Sparkles, Filter, Calendar, Tag, Globe, ShieldCheck, BarChart3 } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { SEO } from '../components/SEO';
import { VelaHeroSection } from '../components/VelaHeroSection';
import { useCMS } from '../lib/cmsStore';
import {
  caseStudies,
  caseStudiesIndexHero,
  caseStudiesIndexSeo,
  caseStudyIndustries,
  type CaseStudyIndustry,
} from '../data/caseStudies';
import heroSlide3Image from '../assets/hero-slide-3.webp';

export function CaseStudiesIndexPage() {
  const cms = useCMS();
  const caseStudiesList = cms.caseStudies && cms.caseStudies.length >= 10 ? cms.caseStudies : caseStudies;
  const [searchParams, setSearchParams] = useSearchParams();
  const activeIndustryParam = searchParams.get('industry') || 'All';
  const [searchQuery, setSearchQuery] = useState('');

  const activeIndustry: CaseStudyIndustry = (caseStudyIndustries as readonly string[]).includes(activeIndustryParam)
    ? (activeIndustryParam as CaseStudyIndustry)
    : 'All';

  const handleSelectIndustry = (industry: CaseStudyIndustry) => {
    if (industry === 'All') {
      searchParams.delete('industry');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ industry });
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    searchParams.delete('industry');
    setSearchParams(searchParams);
  };

  // Filter case studies by activeIndustry and search query
  const filteredCaseStudies = useMemo(() => {
    return caseStudiesList.filter((cs) => {
      // Industry filter
      const matchesIndustry = activeIndustry === 'All' || cs.industry === activeIndustry;
      if (!matchesIndustry) return false;

      // Text query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        cs.title.toLowerCase().includes(q) ||
        cs.summary.toLowerCase().includes(q) ||
        cs.industry.toLowerCase().includes(q) ||
        cs.technologies.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [activeIndustry, searchQuery]);

  return (
    <div className="min-h-screen w-full bg-white dark:bg-[#05080e] text-slate-900 dark:text-slate-100 flex flex-col selection:bg-axia-slate/20 transition-colors duration-300">
      
      {/* SEO Metadata */}
      <SEO
        title={caseStudiesIndexSeo.title}
        description={caseStudiesIndexSeo.description}
        canonicalUrl="https://axiakairos.com/case-studies"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: caseStudiesIndexSeo.title,
            description: caseStudiesIndexSeo.description,
            url: 'https://axiakairos.com/case-studies',
          },
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Axia Kairos Enterprise Case Studies',
            itemListElement: caseStudies.map((cs, idx) => ({
              '@type': 'ListItem',
              position: idx + 1,
              name: cs.title,
              url: `https://axiakairos.com/case-studies/${cs.slug}`,
            })),
          },
        ]}
      />

      {/* 1. Header */}
      <Header />

      {/* Main Content */}
      <main className="w-full flex-1 flex flex-col">

        {/* 1. VELA HERO SECTION */}
        <VelaHeroSection
          pageEyebrow="SAP & Cloud Transformation Case Studies"
          line2="real enterprise outcomes"
          caption={
            <>
              Explore how forward-thinking enterprises partner with Axia Kairos to migrate to<br />
              SAP S/4HANA, modernize multi-cloud infrastructure, and automate mission-critical operations.
            </>
          }
          stripHeading={'Measurable Impact\nValidated Globally'}
          stats={[
            { number: '100%', label: 'On-schedule enterprise project delivery' },
            { number: '3x', label: 'Faster reporting & executive decision cycles' },
            { number: '10+', label: 'Global and regulated industries transformed' },
          ]}
          scrollTargetId="case-studies-grid"
        />

        {/* 2. THREE-PILLAR VALUE STRIP */}
        <section className="w-full border-y border-slate-200/80 dark:border-white/10 bg-slate-50/60 dark:bg-[#080e1a]/60 py-8 sm:py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-white/10">
              
              {/* Pillar 1 */}
              <div className="flex items-center gap-4 pt-4 md:pt-0">
                <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0">
                  <Globe className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    Global enterprise footprint
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    Deploying complex cross-border architectures across North America, EMEA, and APAC.
                  </p>
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="flex items-center gap-4 pt-4 md:pt-0 md:pl-8">
                <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    Zero-disruption delivery
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    Safeguarding continuity during mission-critical SAP migrations and cloud cutovers.
                  </p>
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="flex items-center gap-4 pt-4 md:pt-0 md:pl-8">
                <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0">
                  <BarChart3 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    Quantifiable outcomes
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    Delivering measurable operational efficiency, cost compression, and execution velocity.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Editorial Case Studies Section */}
        <section id="case-studies-grid" className="w-full py-14 sm:py-16 max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16" aria-label="Case Studies List">
          
          {/* Industry Filter Chips & Status Bar */}
          <div className="mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-white/10">
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              <div className="flex items-center text-xs font-mono uppercase text-slate-500 dark:text-slate-400 mr-1 tracking-wider">
                <Filter className="w-3.5 h-3.5 mr-1 text-teal-600 dark:text-teal-400" />
                Industry:
              </div>
              {caseStudyIndustries.map((industry) => {
                const isActive = activeIndustry === industry;
                return (
                  <button
                    key={industry}
                    type="button"
                    onClick={() => handleSelectIndustry(industry)}
                    className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-teal-600 text-white shadow-sm font-semibold'
                        : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                    }`}
                  >
                    {industry}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono tracking-widest uppercase text-slate-500 dark:text-slate-400">
              <div className="relative flex items-center w-full sm:w-64 h-9 bg-slate-100 dark:bg-slate-800/80 rounded-full px-3.5 border border-slate-200 dark:border-white/10">
                <Search className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter case studies..."
                  className="w-full bg-transparent text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-[10px] text-slate-400 hover:text-slate-700 dark:hover:text-white ml-1"
                  >
                    Clear
                  </button>
                )}
              </div>

              <span>
                {filteredCaseStudies.length} of {caseStudies.length} Stories
              </span>
              {(activeIndustry !== 'All' || searchQuery) && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="text-teal-600 dark:text-teal-400 hover:underline font-semibold"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {filteredCaseStudies.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center bg-slate-50 dark:bg-[#0c1626]/40 rounded-2xl border border-dashed border-slate-300 dark:border-white/15 px-6">
              <p className="text-lg text-slate-700 dark:text-slate-300 font-medium mb-2">
                No case studies match your active filter criteria.
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-md">
                Try selecting a different industry or clearing your search term to browse all enterprise transformations.
              </p>
              <button
                type="button"
                onClick={handleClearFilters}
                className="px-6 py-2.5 rounded-full bg-[#0b192c] dark:bg-white text-white dark:text-[#0b192c] text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="space-y-12 sm:space-y-16">
              {filteredCaseStudies.map((cs, idx) => {
                // Alternating editorial layout on desktop: even image left, odd image right
                const isEven = idx % 2 === 0;

                return (
                  <article
                    key={cs.slug}
                    className="group relative bg-white dark:bg-[#0c1626] border border-slate-200/80 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                  >
                    <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-stretch`}>
                      
                      {/* Image Block */}
                      <div className="w-full lg:w-1/2 relative min-h-[260px] sm:min-h-[340px] lg:min-h-[420px] overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                        <img
                          src={cs.image}
                          alt={cs.title}
                          loading="lazy"
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent lg:hidden" />
                      </div>

                      {/* Content Block */}
                      <div className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-10 xl:p-12 flex flex-col justify-between">
                        <div>
                          
                          {/* Metadata row: Industry + Date */}
                          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-500 dark:text-slate-400 mb-4">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 font-semibold tracking-wider uppercase text-[11px]">
                              <Tag className="w-3 h-3 mr-1 text-[#c2a675]" />
                              {cs.industry}
                            </span>
                            <span className="inline-flex items-center">
                              <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                              {cs.publishedOn}
                            </span>
                          </div>

                          {/* Title */}
                          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold font-serif text-[#0b192c] dark:text-white leading-snug tracking-tight mb-4 group-hover:text-axia-slate transition-colors">
                            <Link to={`/case-studies/${cs.slug}`} className="hover:underline">
                              {cs.title}
                            </Link>
                          </h2>

                          {/* Summary */}
                          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6 line-clamp-3">
                            {cs.summary}
                          </p>

                          {/* Pull Quote */}
                          {cs.pullQuote && (
                            <blockquote className="border-l-2 border-[#c2a675] pl-4 py-1 mb-6 text-xs sm:text-sm italic text-slate-700 dark:text-slate-300 bg-slate-50/70 dark:bg-white/[0.03] rounded-r">
                              &ldquo;{cs.pullQuote}&rdquo;
                            </blockquote>
                          )}

                          {/* Key Technologies Tags */}
                          <div className="flex flex-wrap gap-1.5 mb-8">
                            {cs.technologies.slice(0, 4).map((tech) => (
                              <span
                                key={tech}
                                className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 text-[11px] font-mono text-slate-600 dark:text-slate-400"
                              >
                                {tech}
                              </span>
                            ))}
                            {cs.technologies.length > 4 && (
                              <span className="px-2 py-0.5 text-[11px] font-mono text-slate-400 self-center">
                                +{cs.technologies.length - 4} more
                              </span>
                            )}
                          </div>

                        </div>

                        {/* Card Footer: View More Link */}
                        <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                          <Link
                            to={`/case-studies/${cs.slug}`}
                            className="inline-flex items-center text-sm font-semibold text-[#0b192c] dark:text-white group-hover:text-[#c2a675] transition-colors"
                          >
                            <span>Read Full Case Study</span>
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Link>

                          {cs.results.items[0]?.metric && (
                            <div className="text-right">
                              <span className="text-xl sm:text-2xl font-serif font-bold text-[#c2a675] tracking-tight">
                                {cs.results.items[0].metric}
                              </span>
                              <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-400">
                                {cs.results.items[0].title}
                              </span>
                            </div>
                          )}
                        </div>

                      </div>

                    </div>
                  </article>
                );
              })}
            </div>
          )}

        </section>

        {/* Shared Closing CTA Band */}
        <section className="w-full py-16 sm:py-20 bg-[#0b192c] text-white relative overflow-hidden border-t border-slate-800">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div>
              <span className="text-xs font-mono tracking-widest text-[#c2a675] uppercase font-semibold flex items-center gap-1.5 mb-2">
                <Sparkles className="w-4 h-4 text-[#c2a675]" />
                ENTERPRISE PARTNERSHIP
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                Ready to drive measurable impact? Let&rsquo;s talk.
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-xl">
                Partner with Axia Kairos to bridge strategic vision and mission-critical execution with verified enterprise outcomes.
              </p>
            </div>

            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-3.5 rounded-full bg-white text-[#0b192c] hover:bg-slate-100 font-semibold text-sm transition-all shadow-md active:scale-95 shrink-0"
            >
              <span>Connect with Our Advisors</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </section>

      </main>

      {/* Shared Footer */}
      <Footer />

    </div>
  );
}

export default CaseStudiesIndexPage;
