import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  MapPin,
  Calendar,
  ArrowRight,
  Users,
  TrendingUp,
  ChevronRight,
  Inbox,
  BookOpen,
} from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { SEO } from '../components/SEO';
import { VelaHeroSection } from '../components/VelaHeroSection';
import { useCMS } from '../lib/cmsStore';
import {
  careersLandingData,
  jobs,
  DEPARTMENTS,
  type Department,
} from '../data/jobs';

function formatPublishDate(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return 'Recent';
  }
}

export const CareersLandingPage: React.FC = () => {
  const cms = useCMS();
  const jobsList = cms.careers && cms.careers.length >= 5 ? cms.careers : jobs;
  const navigate = useNavigate();
  const [selectedDept, setSelectedDept] = useState<Department>('All Departments');

  // Compute counts per department
  const deptCounts = useMemo(() => {
    const counts: Record<string, number> = {
      'All Departments': jobsList.filter((j) => j.status === 'open').length,
    };
    DEPARTMENTS.forEach((dept) => {
      if (dept !== 'All Departments') {
        counts[dept] = jobsList.filter(
          (j) => j.status === 'open' && j.department.toLowerCase() === dept.toLowerCase()
        ).length;
      }
    });
    return counts;
  }, [jobsList]);

  // Filter jobs
  const filteredJobs = useMemo(() => {
    if (selectedDept === 'All Departments') {
      return jobsList.filter((j) => j.status === 'open');
    }
    return jobsList.filter(
      (j) => j.status === 'open' && j.department.toLowerCase() === selectedDept.toLowerCase()
    );
  }, [selectedDept, jobsList]);

  const scrollToOpenings = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    e.preventDefault();
    const el = document.getElementById('open-positions');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen w-full bg-white dark:bg-[#05080e] text-axia-navy dark:text-slate-100 flex flex-col selection:bg-cyan-500/20 overflow-x-clip transition-colors duration-300">
      <SEO
        title={careersLandingData.seo.title}
        description={careersLandingData.seo.description}
        canonicalUrl={careersLandingData.seo.canonicalUrl}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: careersLandingData.seo.title,
            description: careersLandingData.seo.description,
            url: careersLandingData.seo.canonicalUrl,
          },
          {
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
                name: 'Careers',
                item: 'https://axiakairos.com/careers',
              },
            ],
          },
        ]}
      />

      {/* Header */}
      <Header onCtaClick={() => navigate('/contact')} />

      <main className="w-full flex-1">
        {/* 1. VELA HERO SECTION */}
        <VelaHeroSection
          pageEyebrow="Careers at Axia Kairos"
          line2="your career with purpose"
          caption={
            <>
              Join a global team of architects, SAP consultants, data engineers, and digital<br />
              transformation leaders shaping enterprise innovation across Canada, the US, UAE, and India.
            </>
          }
          stripHeading={'Where Deep Expertise\nMeets Real Impact'}
          stats={[
            { number: '4', label: 'Global delivery hubs (Canada, USA, UAE, India)' },
            { number: '100%', label: 'Merit, innovation & growth-focused culture' },
            { number: '4.9★', label: 'Global employee experience and trust' },
          ]}
          scrollTargetId="open-positions"
        />

        {/* 2. THREE-PILLAR VALUE STRIP */}
        <section className="w-full border-y border-slate-200/80 dark:border-white/10 bg-slate-50/60 dark:bg-[#080e1a]/60 py-8 sm:py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-white/10">
              
              {/* Pillar 1 */}
              <div className="flex items-center gap-4 pt-4 md:pt-0">
                <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    Learn continuously
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    Grow your skills with real opportunities and continuous learning.
                  </p>
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="flex items-center gap-4 pt-4 md:pt-0 md:pl-8">
                <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    Build together
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    Work with talented, supportive and diverse teams.
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
                    Make an impact
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    Solve meaningful problems for enterprises around the world.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 3. OPEN POSITIONS / OPPORTUNITIES */}
        <section id="open-positions" className="py-16 sm:py-24 scroll-mt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-slate-200/80 dark:border-white/10 gap-4">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-slate-400 font-semibold">
                  OPPORTUNITIES
                </span>
                <div className="flex items-center gap-4 mt-2">
                  <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Find your place here.
                  </h2>
                  <div className="hidden sm:block w-12 h-[1px] bg-slate-300 dark:bg-white/20 mt-2" />
                </div>
              </div>
              <a
                href="#open-positions"
                className="inline-flex items-center text-sm font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 transition-colors"
              >
                <span>Explore teams</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </a>
            </div>

            {/* Department Filter Chips */}
            <div className="flex flex-wrap items-center gap-2 pb-6 border-b border-slate-200/80 dark:border-white/10 mb-8" role="tablist" aria-label="Department filters">
              {DEPARTMENTS.map((dept) => {
                const count = deptCounts[dept] || 0;
                const isSelected = selectedDept === dept;
                return (
                  <button
                    key={dept}
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setSelectedDept(dept)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono tracking-wide transition-all ${
                      isSelected
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold shadow-sm'
                        : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10'
                    }`}
                  >
                    <span>{dept}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                        isSelected
                          ? 'bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900'
                          : 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Job Listings Grid / Empty State */}
            {filteredJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.map((job) => (
                  <article
                    key={job.slug}
                    className="rounded-2xl p-6 bg-white dark:bg-[#0c1424] border border-slate-200/90 dark:border-white/10 shadow-sm hover:shadow-md hover:border-cyan-500/40 dark:hover:border-cyan-500/30 transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div className="space-y-4">
                      {/* Department & Experience Badges */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                          {job.department}
                        </span>
                        {job.experience && (
                          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                            {job.experience}
                          </span>
                        )}
                      </div>

                      {/* Job Title */}
                      <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors leading-snug">
                        <Link to={`/careers/${job.slug}`}>{job.title}</Link>
                      </h3>

                      {/* Meta: Location & Type & Date */}
                      <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 pt-1">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{job.employmentType}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>Job Published: {formatPublishDate(job.publishedOn)}</span>
                        </div>
                      </div>

                      {/* One-Line Summary */}
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed pt-2">
                        {job.summary}
                      </p>
                    </div>

                    {/* Apply Now CTA */}
                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                      <Link
                        to={`/careers/${job.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-mono uppercase font-semibold tracking-wider text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors"
                      >
                        <span>Apply Now</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              /* Empty State for Departments with No Openings */
              <div className="rounded-2xl border border-dashed border-slate-300 dark:border-white/15 p-12 text-center max-w-lg mx-auto space-y-4 my-8">
                <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400">
                  <Inbox className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white">
                  No Openings Right Now in {selectedDept}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  No openings right now, check back soon or send us your profile for future talent pools.
                </p>
                <div className="pt-2">
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-colors shadow-sm"
                  >
                    <span>Send Us Your Profile</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Shared Footer */}
      <Footer />
    </div>
  );
};

export default CareersLandingPage;
