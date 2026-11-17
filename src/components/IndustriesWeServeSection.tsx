import React, { useEffect, useRef, useState } from 'react';
import '@/styles/industries-serve.css';

export interface CategoryItem {
  name: string;
  video: string;
}

export const CATEGORIES: CategoryItem[] = [
  {
    name: 'face',
    video: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260518_203023_87a26602-2898-4acc-a396-c7a2b5ad84fd.mp4',
  },
  {
    name: 'beauty tools',
    video: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260518_203415_b86e3f19-2aec-46cd-9a86-b64c40118e38.mp4',
  },
  {
    name: 'body',
    video: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260518_203051_85fee398-ea01-4aa0-972b-137a74213be5.mp4',
  },
];

export function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  return { ref, isVisible };
}

export const CategoriesSection: React.FC = () => {
  const { ref, isVisible } = useInView(0.1);

  return (
    <section
      id="industries"
      className="w-full bg-white text-white min-h-screen flex flex-col justify-center p-0"
    >
      <div
        ref={ref}
        className={`grid grid-cols-1 md:grid-cols-3 w-full transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}
      >
        {CATEGORIES.map((item, index) => (
          <div
            key={item.name}
            className="relative flex flex-col justify-between items-start p-6 sm:p-8 md:p-12 min-h-[400px] sm:min-h-[500px] md:min-h-[750px] overflow-hidden group"
            style={{ transitionDelay: `${index * 150}ms` }}
          >
            {/* Background Video */}
            <video
              src={item.video}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-500" />

            {/* Category Name (vertical text) */}
            <h2
              className="relative z-10 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium transition-transform duration-500 group-hover:-translate-y-2 select-none"
              style={{
                writingMode: 'vertical-lr',
                transform: 'rotate(180deg)',
              }}
            >
              {item.name}
            </h2>

            {/* Shop Button */}
            <button
              type="button"
              className="btn-primary relative z-10 mt-auto px-8 py-3 bg-white text-black rounded-full text-sm font-medium"
            >
              shop {item.name}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export const IndustriesWeServeSection = CategoriesSection;
export default CategoriesSection;
