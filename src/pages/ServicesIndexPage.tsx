import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Search, Sparkles, Compass, Cpu, TrendingUp } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { SEO } from '../components/SEO';
import { VelaHeroSection } from '../components/VelaHeroSection';
import { useCMS } from '../lib/cmsStore';
import { servicesData, servicesIndexHero, servicesIndexSeo, caseStudiesData } from '../data/services';
import heroImage from '../assets/hero.webp';

const serviceImageMap: Record<string, string> = {
  'ai-blockchain-and-io-t-integration': '/assets/blogs/io-t-and-ai-driving-the-next-wave-of-intelligent-enterprise-operations.webp',
  'application-managed-it-services': '/assets/blogs/why-managed-it-services-are-vital-for-enterprise-agility.webp',
  'business-process-automation': '/assets/blogs/automation-beyond-efficiency-building-smarter-enterprises-with-ai.webp',
  'cloud-platform-modernization': '/assets/blogs/cloud-modernization-the-foundation-of-scalable-enterprise-growth.webp',
  'data-engineering-and-analytics': '/assets/blogs/data-driven-decisions-how-analytics-transforms-enterprise-strategy.webp',
  'cyber-security-services': '/assets/blogs/the-new-frontier-of-cybersecurity-building-enterprise-resilience.webp',
  'digital-transformation-1': '/assets/blogs/how-digital-transformation-drives-sustainable-business-growth.webp',
  'e-commerce-solutions': '/assets/blogs/redefining-customer-journeys-through-digital-commerce-solutions.webp',
  'management-consulting': '/assets/case-studies/public-sector-data-analytics-automation.webp',
  'mobility-and-app-development': '/assets/case-studies/logistics-sap-automation-integration.webp',
  'sap-implementation-advisory-and-support': '/assets/blogs/top-5-challenges-in-sap-migration-and-how-to-overcome-them.webp',
  'web-development': '/assets/case-studies/cloud-modernization-retail.webp',
};

export function ServicesIndexPage() {
  const cms = useCMS();
  const servicesList = cms.services && cms.services.length >= 12 ? cms.services : servicesData;
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('q') || '');

  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  // Filter services live by title and shortDescription
  const filteredServices = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return servicesList;
    return servicesList.filter(
      (s) => s.title.toLowerCase().includes(q) || s.shortDescription.toLowerCase().includes(q)
    );
  }, [searchQuery, servicesList]);

  // Featured 3 case studies for the bottom strip
  const featuredCaseStudies = useMemo(() => {
    return Object.values(caseStudiesData).slice(0, 3);
  }, []);

  return (
    <div className="min-h-screen w-full bg-white dark:bg-[#05080e] text-slate-900 dark:text-slate-100 flex flex-col selection:bg-axia-slate/20 transition-colors duration-300">
      
      {/* SEO metadata */}
      <SEO
        title={servicesIndexSeo.title}
        description={servicesIndexSeo.description}
        canonicalUrl="https://axiakairos.com/services"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: servicesIndexSeo.title,
            description: servicesIndexSeo.description,
            url: 'https://axiakairos.com/services',
          },
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Axia Kairos Enterprise Services',
            itemListElement: servicesList.map((s, idx) => ({
              '@type': 'ListItem',
              position: idx + 1,
              name: s.title,
              url: `https://axiakairos.com/services/${s.slug}`,
            })),
          },
        ]}
      />

      {/* 1. Header (with integrated SunMoonThemeToggle) */}
      <Header />

      {/* Main Content */}
      <main className="w-full flex-1 flex flex-col">
        
        {/* 1. VELA HERO SECTION */}
        <VelaHeroSection
          pageEyebrow="IT & Digital Transformation Services"
          line2="your enterprise operations"
          caption={
            <>
              At Axia Kairos, we combine management consulting expertise with next-generation<br />
              technologies to help enterprises transform operations and accelerate sustainable business growth.
            </>
          }
          stripHeading={'Engineering Value\nAt Critical Moments'}
          stats={[
            { number: '99.9%', label: 'Mission-critical application continuity' },
            { number: '40%+', label: 'Operational workflow cost reduction' },
            { number: '12', label: 'End-to-end enterprise service domains' },
          ]}
          scrollTargetId="services-list"
        />

        {/* 2. THREE-PILLAR VALUE STRIP */}
        <section className="w-full border-y border-slate-200/80 dark:border-white/10 bg-slate-50/60 dark:bg-[#080e1a]/60 py-8 sm:py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-white/10">
              
              {/* Pillar 1 */}
              <div className="flex items-center gap-4 pt-4 md:pt-0">
                <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0">
                  <Compass className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    Consulting-led advisory
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    Aligning architectural engineering directly with executive business priorities.
                  </p>
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="flex items-center gap-4 pt-4 md:pt-0 md:pl-8">
                <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0">
                  <Cpu className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    Modern enterprise stack
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    Accelerating SAP BTP, cloud modernization, automation, and AI adoption.
                  </p>
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="flex items-center gap-4 pt-4 md:pt-0 md:pl-8">
                <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    Measurable ROI
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    Derisking digital investments through outcome-driven, accountable governance.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Section 2: Editorial Services List */}
        <section
          id="services-list"
          className="w-full py-12 sm:py-16 max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16"
          aria-label="Services List"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-300 dark:border-white/15">
            <span className="text-xs font-mono tracking-widest uppercase text-slate-500 dark:text-slate-400">
              SHOWING {filteredServices.length} OF {servicesData.length} SERVICES
            </span>
            <div className="relative flex items-center w-full max-w-sm h-10 bg-slate-100 dark:bg-slate-800/80 rounded-full px-4 border border-slate-200 dark:border-white/10">
              <Search className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services or capabilities..."
                className="w-full bg-transparent text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-slate-400 hover:text-slate-700 dark:hover:text-white ml-2"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {filteredServices.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center">
              <p className="text-lg text-slate-500 dark:text-slate-400 mb-4">
                No services match your search query &ldquo;{searchQuery}&rdquo;.
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="px-6 py-2 rounded-full border border-slate-300 dark:border-white/20 text-sm font-medium hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              >
                Reset Search Filter
              </button>
            </div>
          ) : (
            <div className="border-t border-slate-300 dark:border-white/15">
              {filteredServices.map((service) => {
                const serviceImage = serviceImageMap[service.slug] || service.intro?.image || '/assets/card_sunset.webp';

                return (
                  <article
                    key={service.slug}
                    className="group border-b border-slate-300/80 dark:border-white/15 py-10 sm:py-12 lg:py-14 transition-colors"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-14 items-start">
                      
                      {/* Left Column: Service Title */}
                      <div className="md:col-span-3 lg:col-span-3">
                        <Link
                          to={`/services/${service.slug}`}
                          className="inline-block"
                        >
                          <h2 className="text-base sm:text-lg font-normal text-slate-800 dark:text-slate-100 tracking-tight group-hover:text-[#c2a675] dark:group-hover:text-[#dfc493] transition-colors leading-snug">
                            {service.title}
                          </h2>
                        </Link>
                      </div>

                      {/* Middle Column: Description & LEARN MORE Link */}
                      <div className="md:col-span-5 lg:col-span-5 flex flex-col justify-between self-stretch">
                        <p className="text-sm sm:text-[15px] leading-relaxed text-slate-700 dark:text-slate-300 font-normal">
                          {service.shortDescription}
                        </p>

                        <div className="mt-8 sm:mt-10 lg:mt-14">
                          <Link
                            to={`/services/${service.slug}`}
                            className="inline-block text-xs font-semibold tracking-widest uppercase text-slate-900 dark:text-white underline underline-offset-8 decoration-1 group-hover:text-[#c2a675] group-hover:decoration-[#c2a675] dark:group-hover:text-[#dfc493] dark:group-hover:decoration-[#dfc493] transition-colors"
                          >
                            LEARN MORE
                          </Link>
                        </div>
                      </div>

                      {/* Right Column: Monochrome Editorial Image */}
                      <div className="md:col-span-4 lg:col-span-4">
                        <Link
                          to={`/services/${service.slug}`}
                          className="block aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-900 shadow-sm"
                        >
                          <img
                            src={serviceImage}
                            alt={service.title}
                            loading="lazy"
                            className="w-full h-full object-cover object-center grayscale contrast-[1.05] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                          />
                        </Link>
                      </div>

                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Featured Case Studies Strip */}
        <section className="w-full py-16 sm:py-20 bg-slate-50 dark:bg-[#070d18] border-t border-slate-200/80 dark:border-white/10">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#c2a675] font-semibold">
                  PROVEN CLIENT IMPACT
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#0b192c] dark:text-white tracking-tight mt-1">
                  Featured Case Studies
                </h3>
              </div>
              <a
                href="/#case-studies"
                className="inline-flex items-center text-sm font-medium text-[#0b192c] dark:text-white hover:text-axia-slate transition-colors"
              >
                <span>View More Case Studies</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {featuredCaseStudies.map((cs) => (
                <div
                  key={cs.slug}
                  className="flex flex-col bg-white dark:bg-[#0c1626] rounded-xl overflow-hidden border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow p-6 sm:p-7 justify-between"
                >
                  <div>
                    <h4 className="text-base font-bold text-[#0b192c] dark:text-white leading-snug mb-2.5">
                      {cs.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      {cs.description}
                    </p>
                  </div>
                  {cs.quote && (
                    <p className="mt-4 pt-4 border-t border-slate-100 dark:border-white/10 text-xs italic text-[#c2a675] dark:text-[#dfc493]">
                      {cs.quote}
                    </p>
                  )}
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* Closing CTA Band */}
        <section className="w-full py-16 sm:py-20 bg-[#0b192c] text-white relative overflow-hidden">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div>
              <span className="text-xs font-mono tracking-widest text-[#c2a675] uppercase font-semibold flex items-center gap-1.5 mb-2">
                <Sparkles className="w-4 h-4 text-[#c2a675]" />
                ACCELERATE YOUR ENTERPRISE
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                Ready to transform your operations with confidence?
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-xl">
                Partner with Axia Kairos to bridge strategic vision and mission-critical execution.
              </p>
            </div>

            <a
              href="/#contact"
              className="inline-flex items-center px-8 py-3.5 rounded-full bg-white text-[#0b192c] hover:bg-slate-100 font-semibold text-sm transition-all shadow-md active:scale-95 shrink-0"
            >
              <span>Talk to Us</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </div>
        </section>

      </main>

      {/* Shared Footer */}
      <Footer />

    </div>
  );
}

export default ServicesIndexPage;
