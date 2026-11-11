import React, { useState, useEffect, forwardRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { ArrowUpRight, Sun, Moon } from 'lucide-react';
import { siteContent } from '../content/site';
import '@/styles/halden.css';

export interface HeaderProps {
  onCtaClick?: () => void;
}

export const Header = forwardRef<HTMLElement, HeaderProps>(({ onCtaClick }, ref) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { navLinks } = siteContent.header;

  // Live dynamic Date & Time for Header (e.g. "Saturday", "18:51 · 7 NOVEMBER 2026")
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const dayOfWeek = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
  const timeFormatted = currentDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const dayNum = currentDate.getDate();
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long' }).toUpperCase();
  const yearNum = currentDate.getFullYear();
  const dateFormatted = `${timeFormatted} · ${dayNum} ${monthName} ${yearNum}`;

  // Theme management with full light/dark synchronization
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof document !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored === 'dark' || stored === 'light') return stored === 'dark';
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  const toggleTheme = () => {
    const nextDark = !document.documentElement.classList.contains('dark');
    setIsDark(nextDark);
    document.documentElement.classList.toggle('dark', nextDark);
    if (document.body) document.body.classList.toggle('dark', nextDark);
    try {
      localStorage.setItem('theme', nextDark ? 'dark' : 'light');
    } catch {}
    window.dispatchEvent(
      new CustomEvent('themechange', { detail: { theme: nextDark ? 'dark' : 'light' } })
    );
  };

  useEffect(() => {
    const updateTheme = () => {
      const dark = document.documentElement.classList.contains('dark');
      setIsDark(dark);
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

  // Listen to scroll to update scrolled state
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleCta = () => {
    setMobileOpen(false);
    if (onCtaClick) {
      onCtaClick();
    } else {
      navigate('/contact');
    }
  };

  // Helper to determine whether a link is currently active
  const isLinkActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    if (href === '/about') {
      return location.pathname === '/about' || location.pathname === '/about-us';
    }
    if (href === '/services') {
      return location.pathname === '/services' || location.pathname.startsWith('/services');
    }
    if (href === '/case-studies') {
      return location.pathname === '/case-studies' || location.pathname.startsWith('/case-studies');
    }
    if (href === '/careers') {
      return location.pathname === '/careers' || location.pathname.startsWith('/careers');
    }
    if (href === '/blogs') {
      return location.pathname === '/blogs' || location.pathname.startsWith('/blogs');
    }
    if (href === '/contact') {
      return location.pathname === '/contact' || location.pathname === '/contact-us';
    }
    return location.pathname === href;
  };

  return (
    <>
      <header
        ref={ref}
        className={`halden-nav ${isScrolled ? 'scrolled' : ''}`}
        id="nav"
        role="banner"
      >
        {/* Left: Box-like navigation bar with white bar and black buttons */}
        <div className="nav-box-island" role="navigation" aria-label="Main Navigation">
          <Link
            to="/"
            className={`nav-box-item ${isLinkActive('/') ? 'active-pill' : 'text-link'}`}
          >
            Home
          </Link>
          {navLinks.map((link) => {
            const isInternal = link.href.startsWith('/') && !link.href.startsWith('/#');
            const isActive = isLinkActive(link.href);
            return isInternal ? (
              <Link
                key={link.label}
                to={link.href}
                className={`nav-box-item ${isActive ? 'active-pill' : 'text-link'}`}
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className={`nav-box-item ${isActive ? 'active-pill' : 'text-link'}`}
              >
                {link.label}
              </a>
            );
          })}
        </div>

        {/* Right: Date & Time, Contact Us Button, and Theme Switcher */}
        <div className="nav-right-cluster">
          {/* Live Date & Time Stacked */}
          <div className="nav-datetime-widget">
            <span className="nav-datetime-day">{dayOfWeek}</span>
            <span className="nav-datetime-date">{dateFormatted}</span>
          </div>

          {/* Contact Us black button with ↗ arrow */}
          {onCtaClick ? (
            <button
              type="button"
              onClick={handleCta}
              className="nav-contact-box-btn"
            >
              <span>Contact Us</span>
              <ArrowUpRight className="h-4 w-4" />
            </button>
          ) : (
            <Link to="/contact" className="nav-contact-box-btn">
              <span>Contact Us</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          )}

          {/* Auxiliary Controls (Theme Switcher) */}
          <div className="nav-aux-controls">
            <button
              type="button"
              onClick={toggleTheme}
              className="halden-theme-btn"
              aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
              title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {isDark ? (
                <Sun className="h-4 w-4 text-[#f5c518]" />
              ) : (
                <Moon className="h-4 w-4 text-[#0b1d3a]" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Controls */}
        <div className="halden-nav-mobile">
          <button
            type="button"
            onClick={toggleTheme}
            className="halden-theme-btn"
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {isDark ? (
              <Sun className="h-4 w-4 text-[#f5c518]" />
            ) : (
              <Moon className="h-4 w-4 text-[#0b1d3a]" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="halden-burger-btn"
            aria-expanded={mobileOpen}
            aria-label="Toggle Navigation"
          >
            <span className="burger-line" />
            <span className="burger-line" />
            <span className="burger-line" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="halden-mobile-drawer" role="dialog" aria-modal="true">
          <nav className="halden-mobile-nav">
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className={`halden-mobile-link ${isLinkActive('/') ? 'active' : ''}`}
            >
              Home
            </Link>
            {navLinks.map((link) => {
              const isInternal = link.href.startsWith('/') && !link.href.startsWith('/#');
              const isActive = isLinkActive(link.href);
              return isInternal ? (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`halden-mobile-link ${isActive ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`halden-mobile-link ${isActive ? 'active' : ''}`}
                >
                  {link.label}
                </a>
              );
            })}
            {onCtaClick ? (
              <button
                type="button"
                onClick={handleCta}
                className="halden-mobile-cta w-full flex items-center justify-center gap-1.5"
              >
                <span>Contact Us</span>
                <ArrowUpRight className="h-4 w-4" />
              </button>
            ) : (
              <Link
                to="/contact"
                onClick={() => setMobileOpen(false)}
                className="halden-mobile-cta"
              >
                <span>Contact Us ↗</span>
              </Link>
            )}
          </nav>
        </div>
      )}
    </>
  );
});

Header.displayName = 'Header';
export default Header;
