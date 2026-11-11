import React, { Suspense, lazy, useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import { ScrollToTop } from './components/ScrollToTop';
import { Preloader } from './components/Preloader';
import { syncCMSFromServer } from './lib/cmsStore';
import './styles/index.css';
import './styles/halden.css';

// Instant Eager Page Imports for zero-latency route transitions
import AboutPage from './pages/AboutPage';
import ServicesIndexPage from './pages/ServicesIndexPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import CaseStudiesIndexPage from './pages/CaseStudiesIndexPage';
import CaseStudyDetailPage from './pages/CaseStudyDetailPage';
import BlogsIndexPage from './pages/BlogsIndexPage';
import BlogPostDetailPage from './pages/BlogPostDetailPage';
import CareersLandingPage from './pages/CareersLandingPage';
import JobDetailPage from './pages/JobDetailPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';

// Lazy-load secondary admin & standalone assistant routes
const AssistantPage = lazy(() => import('./features/assistant/AssistantPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));

// Force clean any legacy stale CMS cache so users immediately get fresh Axia Kairos content
if (typeof window !== 'undefined') {
  try {
    ['axia_cms_content_v1', 'axia_cms_content_v2', 'halden_cms_content_v1'].forEach((k) => {
      localStorage.removeItem(k);
    });
  } catch {}
}

// Sync latest published content from backend on launch (non-blocking)
syncCMSFromServer().catch(() => {});

// Lazy-load AXIA Assistant chatbot launcher so it initializes only after primary UI is idle
const AssistantLauncher = lazy(() =>
  import('./features/assistant/AssistantLauncher').then((m) => ({ default: m.AssistantLauncher }))
);

const DeferredAssistantLauncher = () => {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if ('requestIdleCallback' in window) {
      const handle = (window as Window & { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback(
        () => setShouldLoad(true),
        { timeout: 3500 }
      );
      return () => {
        (window as Window & { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(handle);
      };
    } else {
      const timer = setTimeout(() => setShouldLoad(true), 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!shouldLoad) return null;

  return (
    <Suspense fallback={null}>
      <AssistantLauncher />
    </Suspense>
  );
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Preloader />
      <ScrollToTop />
      <DeferredAssistantLauncher />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/about-us" element={<AboutPage />} />
          <Route path="/services" element={<ServicesIndexPage />} />
          <Route path="/service" element={<ServicesIndexPage />} />
          <Route path="/services/:slug" element={<ServiceDetailPage />} />
          <Route path="/service/:slug" element={<ServiceDetailPage />} />
          <Route path="/case-studies" element={<CaseStudiesIndexPage />} />
          <Route path="/case-study" element={<CaseStudiesIndexPage />} />
          <Route path="/case-studies/:slug" element={<CaseStudyDetailPage />} />
          <Route path="/case-study/:slug" element={<CaseStudyDetailPage />} />
          <Route path="/blogs" element={<BlogsIndexPage />} />
          <Route path="/blog" element={<BlogsIndexPage />} />
          <Route path="/blogs/:slug" element={<BlogPostDetailPage />} />
          <Route path="/blog/:slug" element={<BlogPostDetailPage />} />
          <Route path="/careers" element={<CareersLandingPage />} />
          <Route path="/career" element={<CareersLandingPage />} />
          <Route path="/careers/:slug" element={<JobDetailPage />} />
          <Route path="/career/:slug" element={<JobDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/contact-us" element={<ContactPage />} />
          <Route path="/assistant" element={<AssistantPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </React.StrictMode>,
);
