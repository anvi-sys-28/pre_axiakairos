import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, Sparkles, Clock, Calendar, ArrowUpDown, BookOpen } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { SEO } from '../components/SEO';
import { VelaHeroSection } from '../components/VelaHeroSection';
import { useCMS } from '../lib/cmsStore';
import { blogs, blogsIndexHero, blogsIndexSeo, type BlogPost } from '../data/blogs';

const POSTS_PER_PAGE = 9;

export function BlogsIndexPage() {
  const cms = useCMS();
  const blogsList = cms.blogs && cms.blogs.length >= 10 ? cms.blogs : blogs;
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest');
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

  // Filter and sort posts
  const filteredAndSortedPosts = useMemo(() => {
    let result = [...blogsList];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.excerpt.toLowerCase().includes(q)
      );
    }

    // Sort order
    result.sort((a, b) => {
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();
      return sortOrder === 'latest' ? timeB - timeA : timeA - timeB;
    });

    return result;
  }, [searchQuery, sortOrder]);

  const displayedPosts = filteredAndSortedPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredAndSortedPosts.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + POSTS_PER_PAGE);
  };

  return (
    <div className="min-h-screen w-full bg-white dark:bg-[#05080e] text-slate-900 dark:text-slate-100 flex flex-col selection:bg-axia-slate/20 transition-colors duration-300">
      
      {/* SEO Metadata */}
      <SEO
        title={blogsIndexSeo.title}
        description={blogsIndexSeo.description}
        canonicalUrl="https://axiakairos.com/blogs"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: blogsIndexSeo.title,
            description: blogsIndexSeo.description,
            url: 'https://axiakairos.com/blogs',
          },
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Axia Kairos Strategic Insights & Blogs',
            itemListElement: blogs.map((b, idx) => ({
              '@type': 'ListItem',
              position: idx + 1,
              name: b.title,
              url: `https://axiakairos.com/blogs/${b.slug}`,
            })),
          },
        ]}
      />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="w-full flex-1 flex flex-col">

        {/* 1. VELA HERO SECTION */}
        <VelaHeroSection
          pageEyebrow="Thought Leadership & Research"
          line2="the future of enterprise tech"
          caption={
            <>
              Explore expert perspectives, architecture blueprints, and strategic roadmaps from<br />
              Axia Kairos consultants across AI, SAP modernization, cloud platforms, and cyber resilience.
            </>
          }
          stripHeading={'Actionable Perspectives\nFor Industry Leaders'}
          stats={[
            { number: '50+', label: 'Technical architecture & strategy guides' },
            { number: '12+', label: 'Enterprise technology and industry sectors' },
            { number: '10k+', label: 'Enterprise executives and IT readers' },
          ]}
          scrollTargetId="explore-articles"
        />

        {/* 2. THREE-PILLAR VALUE STRIP (Matching Careers Page) */}
        <section className="w-full border-y border-slate-200/80 dark:border-white/10 bg-slate-50/60 dark:bg-[#080e1a]/60 py-8 sm:py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-white/10">
              {/* Pillar 1 */}
              <div className="flex items-center gap-4 pt-4 md:pt-0">
                <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    Autonomous Generative AI
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                    Multi-agent orchestration &amp; private sovereign LLMs
                  </p>
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="flex items-center gap-4 pt-4 md:pt-0 md:pl-8">
                <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    SAP S/4HANA Modernization
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                    Zero-downtime migration &amp; BTP clean-core governance
                  </p>
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="flex items-center gap-4 pt-4 md:pt-0 md:pl-8">
                <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0">
                  <ArrowRight className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    Cloud &amp; Data Platforms
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                    Resilient hybrid infrastructure &amp; real-time telemetry
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Search & Sort Controls Bar */}
        <div id="explore-articles" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
            {/* Search Input */}
            <div className="relative flex-1 w-full max-w-xl flex items-center h-[52px] sm:h-[56px] bg-white/95 dark:bg-[#0c1626]/75 backdrop-blur-md rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.45)] border border-slate-200/90 dark:border-white/15 px-5 sm:px-6 transition-all focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500">
              <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleCount(POSTS_PER_PAGE);
                }}
                placeholder="Search articles by title or keyword..."
                aria-label="Search blogs"
                className="w-full bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-xs uppercase font-mono tracking-wider text-slate-400 hover:text-slate-700 dark:hover:text-white ml-2 py-1 px-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sort Order Dropdown */}
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <div className="relative flex items-center h-[52px] sm:h-[56px] px-5 bg-white/95 dark:bg-[#0c1626]/75 backdrop-blur-md rounded-full border border-slate-200/90 dark:border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.45)] text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200">
                <ArrowUpDown className="w-4 h-4 mr-2 text-slate-400" />
                <span className="text-slate-400 mr-1 font-mono uppercase text-xs">Sort:</span>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as 'latest' | 'oldest')}
                  aria-label="Sort articles"
                  className="bg-transparent text-slate-900 dark:text-white font-medium focus:outline-none cursor-pointer pr-2"
                >
                  <option value="latest" className="dark:bg-[#0c1626]">Latest First</option>
                  <option value="oldest" className="dark:bg-[#0c1626]">Oldest First</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Posts Grid Section */}
        <section className="w-full py-16 sm:py-20 max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16" aria-label="Articles Grid">
          
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200/80 dark:border-white/10">
            <span className="text-xs font-mono tracking-widest uppercase text-slate-500 dark:text-slate-400">
              Showing {displayedPosts.length} of {filteredAndSortedPosts.length} Articles
            </span>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs font-mono uppercase tracking-wider text-[#c2a675] hover:underline"
              >
                Clear Search
              </button>
            )}
          </div>

          {filteredAndSortedPosts.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center bg-slate-50 dark:bg-[#0c1626]/40 rounded-2xl border border-dashed border-slate-300 dark:border-white/15 px-6">
              <BookOpen className="w-12 h-12 text-slate-400 mb-3" />
              <p className="text-lg text-slate-700 dark:text-slate-300 font-medium mb-2">
                No blog posts match &ldquo;{searchQuery}&rdquo;.
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-md">
                Try searching with different keywords or clear your query to view all published articles.
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="px-6 py-2.5 rounded-full bg-[#0b192c] dark:bg-white text-white dark:text-[#0b192c] text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <>
              {/* Responsive 3-Column Grid of Post Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayedPosts.map((post: BlogPost) => (
                  <article
                    key={post.slug}
                    className="group flex flex-col justify-between bg-white dark:bg-[#0c1626] border border-slate-200/80 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                  >
                    <div>
                      {/* Cover Image */}
                      <Link to={`/blogs/${post.slug}`} className="block relative h-52 sm:h-56 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          loading="lazy"
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        />
                      </Link>

                      {/* Card Content */}
                      <div className="p-6 sm:p-7">
                        
                        {/* Meta Row: Date in mono + Reading time */}
                        <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400 mb-3">
                          <span className="flex items-center">
                            <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                            {post.formattedDate}
                          </span>
                          <span className="flex items-center text-[#c2a675] font-semibold">
                            <Clock className="w-3.5 h-3.5 mr-1" />
                            {post.readingTimeMinutes} min read
                          </span>
                        </div>

                        {/* Title (2-line clamp) */}
                        <h2 className="text-xl font-bold font-serif text-[#0b192c] dark:text-white leading-snug tracking-tight mb-3 group-hover:text-axia-slate transition-colors line-clamp-2">
                          <Link to={`/blogs/${post.slug}`} className="hover:underline">
                            {post.title}
                          </Link>
                        </h2>

                        {/* Excerpt (3-line clamp) */}
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                          {post.excerpt}
                        </p>

                      </div>
                    </div>

                    {/* Card Footer: Read More Link */}
                    <div className="p-6 pt-0 border-t border-slate-100 dark:border-white/10 mt-auto">
                      <Link
                        to={`/blogs/${post.slug}`}
                        className="inline-flex items-center pt-4 text-xs font-mono uppercase tracking-wider font-semibold text-[#0b192c] dark:text-white group-hover:text-[#c2a675] transition-colors"
                      >
                        <span>Read More</span>
                        <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="mt-14 text-center">
                  <button
                    type="button"
                    onClick={handleLoadMore}
                    className="inline-flex items-center px-8 py-3.5 rounded-full bg-white dark:bg-[#0c1626] border border-slate-200/90 dark:border-white/15 text-slate-800 dark:text-white text-sm font-semibold hover:border-slate-400 dark:hover:border-white/30 transition-all shadow-sm active:scale-95"
                  >
                    <span>Load More Articles</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              )}
            </>
          )}

        </section>

        {/* Closing CTA Band */}
        <section className="w-full py-16 sm:py-20 bg-[#0b192c] text-white relative overflow-hidden border-t border-slate-800">
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
                Connect directly with our enterprise consultants to explore tailored strategies in SAP, Cloud, Data, and AI.
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

export default BlogsIndexPage;
