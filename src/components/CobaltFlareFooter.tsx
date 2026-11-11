import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '@/styles/cobalt-flare-footer.css';

interface CobaltFlareFooterProps {
  className?: string;
  brandName?: string;
  copyrightName?: string;
}

export const CobaltFlareFooter: React.FC<CobaltFlareFooterProps> = ({
  className = '',
  brandName = 'axiakairos',
  copyrightName = 'Axia Kairos Advisory & Technology Group',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      setVideoReady(true);
    };

    video.addEventListener('canplay', handleCanPlay);
    if (video.readyState >= 3) {
      setVideoReady(true);
    }

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, []);

  return (
    <footer className={`cobalt-footer-root ${className}`}>
      {/* Sky subtle gradient above glow on tall screens */}
      <div className="cobalt-footer-sky" aria-hidden="true" />

      {/* Top 558u Aurora Glow Box */}
      <div className="cobalt-glow-box" aria-hidden="true">
        <img
          src="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/4a917d4c-123f-4b68-8125-b201961b7791.jpg"
          alt="Glow plate background"
          className="cobalt-glow-plate"
          loading="lazy"
        />
        <video
          ref={videoRef}
          src="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/a8f60da5-538f-403a-a812-6be0f098e319.mp4"
          autoPlay
          loop
          muted
          playsInline
          className={`cobalt-glow-video ${videoReady ? 'is-ready' : ''}`}
        />
      </div>

      {/* Desktop 1326 × 1186 Reference SVG Geometry */}
      <svg
        className="cobalt-vector-stage"
        viewBox="0 0 1326 1186"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          {/* Arc Gradient (#2A6DFC -> #3FD0FF) */}
          <linearGradient id="cobaltArcGrad" x1="0" y1="143" x2="1326" y2="334" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2A6DFC" />
            <stop offset="100%" stopColor="#3FD0FF" />
          </linearGradient>

          {/* Ring Rim Gradient (Blue bottom-left to Bright Cyan #8AF0FF top-right) */}
          <linearGradient id="cobaltRingRim" x1="720" y1="420" x2="840" y2="280" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2A6DFC" />
            <stop offset="60%" stopColor="#3FD0FF" />
            <stop offset="100%" stopColor="#8AF0FF" />
          </linearGradient>

          {/* Ring Dark Radial Fill */}
          <radialGradient id="cobaltRingFill" cx="780.7" cy="351.5" r="78" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#020d24" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#00071A" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#00071A" stopOpacity="0.2" />
          </radialGradient>

          {/* Vertical Wordmark Gradient (#1DB6FC -> #44F4FD -> #19DAFD) */}
          <linearGradient id="cobaltWordmarkGrad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#1DB6FC" />
            <stop offset="50%" stopColor="#44F4FD" />
            <stop offset="100%" stopColor="#19DAFD" />
          </linearGradient>

          {/* Hairlines Gradient (fade from top) */}
          <linearGradient id="cobaltHairlineGrad" x1="0" y1="460" x2="0" y2="920" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2A74E8" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#2A74E8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#2A74E8" stopOpacity="0.08" />
          </linearGradient>

          {/* Soft 5px Blurred Ring Glow Filter */}
          <filter id="cobaltRingGlow" x="690" y="260" width="180" height="180" filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>

        {/* Thin Arc (1.6px, gradient #2A6DFC -> #3FD0FF) sweeping from (0, 143) down to (816, 386) and up to (1326, 334) */}
        <path
          d="M 0 143 C 380 320, 680 400, 816 386 C 960 372, 1160 344, 1326 334"
          stroke="url(#cobaltArcGrad)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />

        {/* Ring: r = 78 at (780.7, 351.5) */}
        {/* 1. Soft 5px blurred copy of rim underneath */}
        <circle
          cx="780.7"
          cy="351.5"
          r="78"
          stroke="url(#cobaltRingRim)"
          strokeWidth="2.4"
          filter="url(#cobaltRingGlow)"
          opacity="0.8"
        />
        {/* 2. Glass disc with dark inner radial fill */}
        <circle
          cx="780.7"
          cy="351.5"
          r="76.8"
          fill="url(#cobaltRingFill)"
        />
        {/* 3. Disc rim 2.4px */}
        <circle
          cx="780.7"
          cy="351.5"
          r="78"
          stroke="url(#cobaltRingRim)"
          strokeWidth="2.4"
        />

        {/* Two vertical hairlines at x = 473 and 762 fade in from top */}
        <line x1="473" y1="460" x2="473" y2="920" stroke="url(#cobaltHairlineGrad)" strokeWidth="1" />
        <line x1="762" y1="460" x2="762" y2="920" stroke="url(#cobaltHairlineGrad)" strokeWidth="1" />

        {/* Wordmark: "AXIAKAIROS", bold geometric sans (Plus Jakarta Sans 700), reading bottom to top */}
        <text
          x="0"
          y="0"
          transform="translate(635, 901.7) rotate(-90)"
          fontFamily="'Plus Jakarta Sans', Inter, system-ui, sans-serif"
          fontWeight="700"
          fontSize="54"
          letterSpacing="0.04em"
          fill="url(#cobaltWordmarkGrad)"
        >
          {brandName.toUpperCase()}
        </text>

        {/* Full-width dashed rule at y = 964 (color #2A74E8 at 40%) */}
        <line
          x1="0"
          y1="964"
          x2="1326"
          y2="964"
          stroke="#2A74E8"
          strokeOpacity="0.4"
          strokeWidth="1"
          strokeDasharray="6 6"
        />
      </svg>

      {/* Centered Content Structure */}
      <div className="cobalt-content-frame">
        {/* Mobile Wordmark (Visible only on mobile/tablet) */}
        <div className="cobalt-mobile-wordmark">
          {brandName}
        </div>

        {/* Left Block: Headline & Book a Call */}
        <div className="cobalt-left-block">
          <h2 className="cobalt-headline">
            Elevate your brand with
            <br />
            us and experience the
            <br />
            difference.
          </h2>

          <Link to="/contact" className="cobalt-cta-row">
            <div className="cobalt-cta-ring">
              <svg className="cobalt-cta-arrow" viewBox="0 0 24 24" fill="none">
                <path
                  d="M7 17L17 7M17 7H7M17 7V17"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="cobalt-cta-text">Book a call</span>
          </Link>
        </div>

        {/* Right Columns Wrapper (contains Important and Legal) */}
        <div className="cobalt-mobile-links-grid">
          {/* Column 1: Important at x = 859 */}
          <div className="cobalt-col-important">
            <h3 className="cobalt-col-heading">Important</h3>
            <ul className="cobalt-link-list">
              <li className="cobalt-link-item">
                <Link to="/services" className="cobalt-link">Services</Link>
              </li>
              <li className="cobalt-link-item">
                <Link to="/case-studies" className="cobalt-link">Portfolio</Link>
              </li>
              <li className="cobalt-link-item">
                <Link to="/contact" className="cobalt-link">Pricing</Link>
              </li>
              <li className="cobalt-link-item">
                <Link to="/about" className="cobalt-link">About</Link>
              </li>
              <li className="cobalt-link-item">
                <Link to="/blogs" className="cobalt-link">Reviews</Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Legal at x = 1078 */}
          <div className="cobalt-col-legal">
            <h3 className="cobalt-col-heading">Legal</h3>
            <ul className="cobalt-link-list">
              <li className="cobalt-link-item">
                <a href="#terms" className="cobalt-link">Terms &amp; conditions</a>
              </li>
              <li className="cobalt-link-item">
                <a href="#privacy" className="cobalt-link">Privacy policy</a>
              </li>
              <li className="cobalt-link-item">
                <Link to="/contact" className="cobalt-link">Contact us</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Mobile dashed divider */}
        <div className="cobalt-mobile-divider" aria-hidden="true" />

        {/* Bottom Row at y = 1015-1045 */}
        <div className="cobalt-bottom-row">
          <span className="cobalt-follow-label">Follow us</span>

          <div className="cobalt-social-list">
            {/* X / Twitter */}
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="cobalt-social-icon" aria-label="X (Twitter)">
              <svg viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            {/* Instagram */}
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="cobalt-social-icon" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            {/* LinkedIn */}
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="cobalt-social-icon" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.76v8.37H6.46v-8.37M7.84 6.2a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
              </svg>
            </a>
            {/* Dribbble */}
            <a href="https://dribbble.com" target="_blank" rel="noopener noreferrer" className="cobalt-social-icon" aria-label="Dribbble">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94" />
                <path d="M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32" />
                <path d="M8.5 2.5c2.5 4.5 4.5 10.5 4.5 19" />
              </svg>
            </a>
            {/* Behance */}
            <a href="https://behance.net" target="_blank" rel="noopener noreferrer" className="cobalt-social-icon" aria-label="Behance">
              <svg viewBox="0 0 24 24">
                <path d="M8.65 11.23c1.17-.37 1.84-1.28 1.84-2.42 0-2.3-1.85-3.06-4.14-3.06H0v12.5h6.63c2.47 0 4.43-.97 4.43-3.6 0-1.63-.9-2.88-2.41-3.42zM3.1 7.6h2.73c1.12 0 1.93.42 1.93 1.5 0 1.13-.8 1.55-1.93 1.55H3.1V7.6zm3.03 8.78H3.1v-3.5h3.03c1.37 0 2.23.5 2.23 1.76 0 1.25-.86 1.74-2.23 1.74zm11.38-4.3c-2.38 0-4.08 1.67-4.08 4.22 0 2.6 1.66 4.25 4.2 4.25 1.9 0 3.25-.95 3.8-2.52h-2.14c-.3.43-.88.75-1.66.75-1.12 0-1.87-.7-1.97-1.84h5.9c.07-.3.1-.64.1-.98 0-2.38-1.57-3.88-4.15-3.88zm-1.87 3.03c.15-.9.76-1.53 1.82-1.53.97 0 1.63.63 1.77 1.53h-3.59zM15.42 8.5h4.15V7.12h-4.15V8.5z" />
              </svg>
            </a>
          </div>

          <div className="cobalt-copyright">
            Copyright &copy; 2026 {copyrightName} All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default CobaltFlareFooter;
