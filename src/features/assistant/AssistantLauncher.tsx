import React, { useState, useRef, useEffect, useCallback, Suspense, lazy } from 'react';
import { useLocation } from 'react-router-dom';
import { Layers, FileText, Users, ArrowRight } from 'lucide-react';
import { LiveOrb, WEBGL_COLORS } from '@/components/ui/live-orb';
// Robot chatbot avatar from public/c.webp
import type { ChatPanelRef } from './ChatPanel';

const ChatPanel = lazy(() =>
  import('./ChatPanel').then((module) => ({ default: module.ChatPanel }))
);

export const AssistantLauncher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const launcherButtonRef = useRef<HTMLButtonElement>(null);
  const modalContainerRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<ChatPanelRef>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  // Hidden on /assistant page and /admin portal
  const isHiddenPage = location.pathname === '/assistant' || location.pathname.startsWith('/admin');

  const [selectedVariant, setSelectedVariant] = useState<'auto' | 'custom' | 'webgl'>('webgl');

  const handleOpen = () => {
    previouslyFocusedElement.current = document.activeElement as HTMLElement;
    setIsOpen(true);
  };

  const handleOpenWithVariant = (variant: 'auto' | 'custom' | 'webgl') => {
    setSelectedVariant(variant);
    previouslyFocusedElement.current = document.activeElement as HTMLElement;
    setIsOpen(true);
  };

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => {
      launcherButtonRef.current?.focus();
    }, 50);
  }, []);

  const handleAction = (type: 'services' | 'insights' | 'handoff') => {
    if (type === 'services') {
      chatRef.current?.sendMessage('What services do you offer?');
    } else if (type === 'insights') {
      chatRef.current?.sendMessage('Show me your case studies and insights');
    } else if (type === 'handoff') {
      chatRef.current?.openHandoff('Direct inquiry from Assistant modal');
    }
  };

  // Trap focus & ESC key handler
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
        return;
      }

      if (e.key === 'Tab' && modalContainerRef.current) {
        const focusableElements = modalContainerRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), textarea:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  if (isHiddenPage) {
    return null;
  }

  return (
    <>
      <style>{`
        @keyframes orbWaveBounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
      `}</style>

      {/* Floating launcher trigger: Unified clickable pill capsule with 3 Live Orbs bouncing in a wave */}
      {!isOpen && (
        <aside
          aria-label="AI Assistant Launcher"
          className="fixed right-4 sm:right-6 bottom-4 sm:bottom-6 z-50 select-none animate-in fade-in duration-300"
        >
          <button
            ref={launcherButtonRef}
            type="button"
            onClick={handleOpen}
            aria-expanded={isOpen}
            aria-haspopup="dialog"
            aria-label="Open AXIA AI Assistant"
            className="flex items-center gap-2 sm:gap-2.5 p-1.5 sm:p-2 rounded-full bg-slate-900/90 dark:bg-[#0c121e]/95 backdrop-blur-xl border border-white/20 shadow-[0_12px_36px_rgba(0,0,0,0.5)] hover:shadow-[0_16px_42px_rgba(47,245,155,0.35)] hover:border-[#2ff59b]/50 hover:scale-105 active:scale-95 transition-all duration-300 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2ff59b]"
          >
            {/* 1. White Orb */}
            <div
              style={{ animation: 'orbWaveBounce 1.5s ease-in-out infinite 0s' }}
              className="relative p-0.5 pointer-events-none select-none transition-transform duration-200 group-hover:scale-105"
            >
              <LiveOrb size={44} variant="white" interactive={true} blink={true} />
            </div>

            {/* 2. Custom Violet Orb */}
            <div
              style={{ animation: 'orbWaveBounce 1.5s ease-in-out infinite 0.22s' }}
              className="relative p-0.5 pointer-events-none select-none transition-transform duration-200 group-hover:scale-105"
            >
              <LiveOrb
                variant="custom"
                color="#7C5CFF"
                eyeColor="#FAFAFA"
                size={44}
                interactive={true}
                blink={true}
              />
            </div>

            {/* 3. WebGL Marble Iridescent Orb */}
            <div
              style={{ animation: 'orbWaveBounce 1.5s ease-in-out infinite 0.44s' }}
              className="relative p-0.5 pointer-events-none select-none transition-transform duration-200 group-hover:scale-105"
            >
              <LiveOrb
                variant="webgl"
                colors={WEBGL_COLORS}
                size={46}
                interactive={true}
                blink={true}
              />
            </div>
          </button>
        </aside>
      )}

      {/* Docked Right-Side Assistant Widget (Opened in right side like regular chatbots) */}
      {isOpen && (
        <>
          {/* Subtle mobile backdrop dismiss for small screens */}
          <div
            className="sm:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
            onClick={handleClose}
            aria-hidden="true"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-label="AXIA Assistant Chat"
            ref={modalContainerRef}
            className="fixed bottom-3 right-3 sm:bottom-5 sm:right-6 z-50 w-[calc(100vw-24px)] sm:w-[420px] md:w-[440px] h-[85vh] max-h-[720px] rounded-[28px] sm:rounded-[32px] shadow-[0_24px_70px_rgba(0,0,0,0.35)] border border-slate-200/90 dark:border-white/15 overflow-hidden flex flex-col bg-white dark:bg-[#18181b] animate-in slide-in-from-bottom-6 sm:slide-in-from-right-6 duration-300 select-none"
          >
            <Suspense
              fallback={
                <div className="w-full h-full bg-white dark:bg-[#18181b] flex flex-col items-center justify-center p-6 text-slate-500">
                  <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mb-3" />
                  <span className="text-xs font-mono">Initializing AXIA Assistant...</span>
                </div>
              }
            >
              <ChatPanel
                ref={chatRef}
                onClose={handleClose}
                isFloating={true}
                orbVariant={selectedVariant}
                className="w-full h-full rounded-[28px] sm:rounded-[32px] border-0 shadow-none"
              />
            </Suspense>
          </div>
        </>
      )}
    </>
  );
};

export default AssistantLauncher;
