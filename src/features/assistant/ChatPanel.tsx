import React, { useState, useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MoreHorizontal,
  X,
  Plus,
  ArrowRight,
  Square,
  ArrowDown,
  Trash2,
  Download,
  Headphones,
  Shield,
  FileText,
  AlertCircle,
  Image as ImageIcon,
  Mail,
  Code2,
  Lightbulb,
  Mic,
  ChevronRight,
  Link2,
  Blocks,
  Globe,
  Sparkles,
  RotateCcw,
  Folder,
} from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { HandoffForm } from './HandoffForm';
import { useChat } from './useChat';
import { LiveOrb, WEBGL_COLORS, type LiveOrbVariant } from '@/components/ui/live-orb';
import { IconFolder, DEFAULT_ICONS, DEPARTMENT_ICONS, type FolderIcon } from '@/components/ui/icon-folder';

export interface ChatPanelRef {
  sendMessage: (text: string) => void;
  openHandoff: (reason?: string) => void;
}

export interface ChatPanelProps {
  onClose?: () => void;
  isFloating?: boolean;
  className?: string;
  orbVariant?: LiveOrbVariant;
}

const FOLDERS_CONFIG = [
  {
    id: 'departments',
    title: 'Departments',
    tags: ['Marketing & Sales', 'Finance', 'HR', 'Administrator'],
    icons: DEPARTMENT_ICONS,
    label: 'Enterprise Units',
  },
  {
    id: 'marketing',
    title: 'Marketing & Sales',
    tags: ['Salesforce', 'HubSpot', 'Campaign AI', 'Lead Gen'],
    icons: [
      {
        label: 'Salesforce',
        background: 'linear-gradient(135deg,#00a1e0,#0070d2)',
        node: (
          <svg viewBox="0 0 24 24" width="55%" height="55%" fill="#fff" aria-hidden="true">
            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
          </svg>
        ),
      },
      {
        label: 'HubSpot',
        background: 'linear-gradient(135deg,#ff7a59,#d9532f)',
        node: (
          <svg viewBox="0 0 24 24" width="55%" height="55%" fill="#fff" aria-hidden="true">
            <circle cx="12" cy="12" r="4" fill="#fff" />
            <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        ),
      },
      {
        label: 'Campaign AI',
        background: 'linear-gradient(135deg,#f97316,#ea580c)',
        node: (
          <svg viewBox="0 0 24 24" width="55%" height="55%" fill="#fff" aria-hidden="true">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ),
      },
      {
        label: 'Lead Gen',
        background: 'linear-gradient(135deg,#0284c7,#0369a1)',
        node: (
          <svg viewBox="0 0 24 24" width="55%" height="55%" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
        ),
      },
    ],
    label: 'Growth & Pipeline',
  },
  {
    id: 'finance',
    title: 'Finance',
    tags: ['SAP S/4', 'NetSuite', 'SOX Audit', 'Invoicing AI'],
    icons: [
      {
        label: 'SAP S/4',
        background: 'linear-gradient(135deg,#005494,#002a4a)',
        node: (
          <span className="font-sans font-black text-white text-[13px] tracking-tight">SAP</span>
        ),
      },
      {
        label: 'NetSuite',
        background: 'linear-gradient(135deg,#0073e6,#004b99)',
        node: (
          <span className="font-sans font-black text-white text-[12px] tracking-tight">NET</span>
        ),
      },
      {
        label: 'Stripe',
        background: 'linear-gradient(135deg,#635bff,#4338ca)',
        node: (
          <span className="font-sans font-black text-white text-[13px] tracking-tight">S</span>
        ),
      },
      {
        label: 'SOX Audit',
        background: 'linear-gradient(135deg,#10b981,#047857)',
        node: (
          <svg viewBox="0 0 24 24" width="55%" height="55%" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        ),
      },
    ],
    label: 'ERP & Treasury',
  },
  {
    id: 'hr',
    title: 'HR',
    tags: ['Workday', 'BambooHR', 'Talent Ops', 'Onboarding AI'],
    icons: [
      {
        label: 'Workday',
        background: 'linear-gradient(135deg,#e26a2c,#b44b15)',
        node: (
          <span className="font-sans font-black text-white text-[11px] tracking-tight">WD</span>
        ),
      },
      {
        label: 'BambooHR',
        background: 'linear-gradient(135deg,#2eb82e,#1f801f)',
        node: (
          <span className="font-sans font-black text-white text-[12px] tracking-tight">BHR</span>
        ),
      },
      {
        label: 'Talent Ops',
        background: 'linear-gradient(135deg,#6366f1,#4338ca)',
        node: (
          <svg viewBox="0 0 24 24" width="55%" height="55%" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        ),
      },
      {
        label: 'Onboarding AI',
        background: 'linear-gradient(135deg,#06b6d4,#0891b2)',
        node: (
          <svg viewBox="0 0 24 24" width="55%" height="55%" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="19" y1="8" x2="19" y2="14" />
            <line x1="22" y1="11" x2="16" y2="11" />
          </svg>
        ),
      },
    ],
    label: 'People & Culture',
  },
  {
    id: 'admin',
    title: 'Administrator',
    tags: ['Azure AD', 'ServiceNow', 'RBAC Access', 'Audit Logs'],
    icons: [
      {
        label: 'Azure AD',
        background: 'linear-gradient(135deg,#0078d4,#005a9e)',
        node: (
          <span className="font-sans font-black text-white text-[11px] tracking-tight">AAD</span>
        ),
      },
      {
        label: 'ServiceNow',
        background: 'linear-gradient(135deg,#81b5a1,#293e40)',
        node: (
          <span className="font-sans font-black text-white text-[11px] tracking-tight">NOW</span>
        ),
      },
      {
        label: 'RBAC Access',
        background: 'linear-gradient(135deg,#0ea5e9,#0284c7)',
        node: (
          <svg viewBox="0 0 24 24" width="55%" height="55%" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        ),
      },
      {
        label: 'Audit Logs',
        background: 'linear-gradient(135deg,#475569,#1e293b)',
        node: (
          <svg viewBox="0 0 24 24" width="55%" height="55%" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        ),
      },
    ],
    label: 'Security & Ops',
  },
];

export const ChatPanel = forwardRef<ChatPanelRef, ChatPanelProps>(
  ({ onClose, isFloating = false, className = '', orbVariant = 'webgl' }, ref) => {
    const navigate = useNavigate();
    const {
      messages,
      isStreaming,
      isOnline,
      sendMessage,
      stopStreaming,
      clearConversation,
      openHandoff,
      refreshChips,
    } = useChat();

    useImperativeHandle(ref, () => ({
      sendMessage,
      openHandoff,
    }));

    const [inputText, setInputText] = useState('');
    const selectedModel = 'Opus 4.5 Medium';
    const [showAttachMenu, setShowAttachMenu] = useState(false);
    const [showTopMenu, setShowTopMenu] = useState(false);
    const [showScrollBottom, setShowScrollBottom] = useState(false);
    const [webSearchEnabled, setWebSearchEnabled] = useState(false);
    const [isMicActive, setIsMicActive] = useState(false);
    const [isThinking, setIsThinking] = useState(false);
    const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
    const [attachmentNotice, setAttachmentNotice] = useState<string | null>(null);

    // Interactive Glass Icon Folder states
    const [activeFolderId, setActiveFolderId] = useState<string>('departments');
    const [showFolderModal, setShowFolderModal] = useState(false);

    const [isDark, setIsDark] = useState<boolean>(() => {
      if (typeof document !== 'undefined') {
        return document.documentElement.classList.contains('dark');
      }
      return true;
    });

    useEffect(() => {
      const update = () => setIsDark(document.documentElement.classList.contains('dark'));
      update();
      const obs = new MutationObserver(update);
      obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
      window.addEventListener('themechange', update);
      return () => {
        obs.disconnect();
        window.removeEventListener('themechange', update);
      };
    }, []);

    const currentFolder = FOLDERS_CONFIG.find((f) => f.id === activeFolderId) || FOLDERS_CONFIG[0];

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const orbContainerRef = useRef<HTMLDivElement>(null);

    // Dynamic greeting based on time of day (matching reference screenshot)
    const currentHour = new Date().getHours();
    const timeOfDay = currentHour < 12 ? 'Morning' : currentHour < 18 ? 'Afternoon' : 'Evening';

    // Has the user started an active conversation?
    const hasUserMessages = messages.some((m) => m.role === 'user');

    // Auto-scroll logic
    const scrollToBottom = (smooth = true) => {
      messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
    };

    const handleScroll = () => {
      if (!scrollContainerRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 80;
      setShowScrollBottom(!isAtBottom);
    };

    useEffect(() => {
      if (!showScrollBottom && hasUserMessages) {
        scrollToBottom();
      }
    }, [messages, isStreaming, showScrollBottom, hasUserMessages]);

    // Keep focus in input on mount and after sending
    useEffect(() => {
      inputRef.current?.focus();
    }, []);

    // Stop thinking state when streaming completes
    useEffect(() => {
      if (!isStreaming) {
        setIsThinking(false);
      }
    }, [isStreaming]);

    // ESC to close floating window & focus trap
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          if (showAttachMenu) {
            setShowAttachMenu(false);
            return;
          }
          if (showTopMenu) {
            setShowTopMenu(false);
            return;
          }
          if (onClose) {
            onClose();
          }
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose, showAttachMenu, showTopMenu]);

    // =========================================================================
    // 1. Dynamic Typing Eye-Tracking: Steer Dot's eyes to look down at characters as user types
    // =========================================================================
    const handleTypingEyeTracking = useCallback((text: string) => {
      if (!inputRef.current) return;
      const rect = inputRef.current.getBoundingClientRect();
      if (rect.width <= 0) return;

      // Caret progress across the input box
      const progress = Math.min(1, Math.max(0.08, text.length / 38));
      const clientX = rect.left + 24 + (rect.width - 48) * progress;
      const clientY = rect.top + rect.height * 0.5;

      window.dispatchEvent(
        new PointerEvent('pointermove', {
          clientX,
          clientY,
          bubbles: true,
        })
      );
    }, []);

    // =========================================================================
    // 2. Thinking State: Dot gazes upward thoughtfully and pulses with thinking energy
    // =========================================================================
    useEffect(() => {
      if (!isThinking && !isStreaming) return;
      let animId: number;
      const start = performance.now();

      const thinkLoop = () => {
        const elapsed = (performance.now() - start) / 1000;
        if (orbContainerRef.current) {
          const rect = orbContainerRef.current.getBoundingClientRect();
          const orbCenterX = rect.left + rect.width / 2;
          const orbCenterY = rect.top + rect.height / 2;
          // Contemplative gaze upwards with gentle swaying
          const clientX = orbCenterX + Math.sin(elapsed * 2.4) * 44;
          const clientY = orbCenterY - 140; // Look up into thoughts
          window.dispatchEvent(
            new PointerEvent('pointermove', {
              clientX,
              clientY,
              bubbles: true,
            })
          );
        }
        animId = requestAnimationFrame(thinkLoop);
      };

      animId = requestAnimationFrame(thinkLoop);
      return () => cancelAnimationFrame(animId);
    }, [isThinking, isStreaming]);

    const handleSend = () => {
      if (!inputText.trim() || isStreaming) return;
      const text = inputText.trim();
      setInputText('');
      setAttachmentNotice(null);
      setShowAttachMenu(false);
      setIsThinking(true);

      const prefix = webSearchEnabled ? '[Web Search] ' : '';
      sendMessage(`${prefix}${text}`);

      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    };

    const handleQuickPrompt = (promptType: 'image' | 'email' | 'debug' | 'ideas') => {
      const prompts: Record<string, string> = {
        image: 'Create an enterprise architectural visualization concept for sovereign autonomous AI agent workflows',
        email: 'Draft an executive briefing email proposing autonomous AI agent deployment to enterprise stakeholders',
        debug: 'Analyze and debug latency bottlenecks in our distributed multi-agent DAG pipeline',
        ideas: 'Provide 5 innovative use cases for autonomous generative AI in enterprise operations',
      };
      const query = prompts[promptType];
      if (query) {
        setIsThinking(true);
        sendMessage(query);
      }
    };

    const handleClose = () => {
      if (onClose) {
        onClose();
      } else {
        if (window.history.length > 1) {
          navigate(-1);
        } else {
          navigate('/');
        }
      }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = Array.from(e.target.files || []);
      if (selected.length === 0) return;

      const validFiles: File[] = [];
      for (const f of selected.slice(0, 3)) {
        if (f.size <= 10 * 1024 * 1024) {
          validFiles.push(f);
        }
      }

      setAttachedFiles(validFiles);
      setAttachmentNotice(
        `${validFiles.length} file(s) attached: ${validFiles.map((f) => f.name).join(', ')}`
      );
      setShowAttachMenu(false);
    };

    const handleDownloadTranscript = () => {
      setShowTopMenu(false);
      const transcriptText = messages
        .map((m) => {
          const time = new Date(m.createdAt).toLocaleString();
          const role = m.role === 'user' ? 'You' : 'AXIA Assistant';
          const textParts = m.parts
            .filter((p) => p.type === 'text')
            .map((p) => (p as { type: 'text'; content: string }).content)
            .join(' ');
          return `[${time}] ${role}:\n${textParts}\n`;
        })
        .join('\n');

      const blob = new Blob([transcriptText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `axia-assistant-${Date.now()}.txt`;
      link.click();
      URL.revokeObjectURL(url);
    };

    return (
      <div
        ref={panelRef}
        className={`w-full h-full flex flex-col bg-white dark:bg-[#18181b] rounded-[36px] overflow-hidden relative text-slate-900 dark:text-white select-none ${className}`}
        role="region"
        aria-label="AXIA Assistant Chat"
        onClick={() => {
          if (showAttachMenu) setShowAttachMenu(false);
          if (showTopMenu) setShowTopMenu(false);
        }}
      >
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.json,.csv"
          onChange={handleFileSelect}
          className="sr-only"
          aria-label="Upload documents or images"
        />

        {/* =========================================================================
            HEADER BAR (Clean & Minimal)
            ========================================================================= */}
        <header className="px-5 pt-4 pb-2 flex items-center justify-between shrink-0 relative z-30 select-none">
          <div className="flex items-center gap-2.5">
            {hasUserMessages && (
              <div className="flex items-center gap-2 animate-in fade-in duration-200">
                <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 shadow-sm">
                  <LiveOrb
                    size={32}
                    variant={orbVariant}
                    colors={WEBGL_COLORS}
                    interactive={true}
                    blink={true}
                  />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-800 dark:text-white leading-none">
                    AXIA Assistant
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400">
                    {isStreaming ? (
                      <span className="text-indigo-500 font-semibold animate-pulse">Thinking...</span>
                    ) : (
                      selectedModel
                    )}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Top Right Actions */}
          <div className="flex items-center gap-1.5 ml-auto">
            {/* Tools Folder Toggle Button */}
            <button
              type="button"
              onClick={() => setShowFolderModal((v) => !v)}
              title={showFolderModal ? "Hide tools folder" : "Explore tools folder"}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                showFolderModal
                  ? "bg-[#0c7075]/15 dark:bg-[#2ff59b]/20 text-[#0c7075] dark:text-[#2ff59b] border border-[#0c7075]/30 dark:border-[#2ff59b]/40 shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800"
              }`}
            >
              <Folder className="w-3.5 h-3.5" />
              <span>Tools</span>
            </button>

            {hasUserMessages && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFolderModal(false);
                  clearConversation();
                }}
                title="Start a new chat"
                className="px-2.5 py-1 rounded-full text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>New</span>
              </button>
            )}

            {/* Menu Options Button */}
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTopMenu(!showTopMenu);
                }}
                aria-label="More options"
                aria-expanded={showTopMenu}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>

              {/* Menu Dropdown */}
              {showTopMenu && (
                <div
                  className="absolute right-0 top-9 w-52 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-2xl py-2 z-50 text-left text-xs font-medium animate-in fade-in zoom-in-95 duration-150"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => {
                      clearConversation();
                      setShowTopMenu(false);
                    }}
                    className="w-full px-4 py-2 flex items-center gap-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Clear conversation</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadTranscript}
                    className="w-full px-4 py-2 flex items-center gap-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download transcript (.txt)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowTopMenu(false);
                      openHandoff('Inquiry from options menu');
                    }}
                    className="w-full px-4 py-2 flex items-center gap-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-indigo-500 transition-colors"
                  >
                    <Headphones className="w-4 h-4" />
                    <span>Talk to our advisory team</span>
                  </button>

                  <div className="my-1 border-t border-slate-100 dark:border-zinc-800" />

                  <button
                    type="button"
                    onClick={() => {
                      setShowTopMenu(false);
                      navigate('/privacy-policy');
                    }}
                    className="w-full px-4 py-2 flex items-center gap-2.5 text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors text-[11px]"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Privacy Policy</span>
                  </button>
                </div>
              )}
            </div>

            {/* Close Modal Button */}
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close chat"
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* =========================================================================
            BODY CONTENT AREA:
            Case A: Interactive Icon Folder (Matching media_1794819679889_93154fc8.png)
            Case B: Active Conversation History
            ========================================================================= */}
        <div className="flex-1 overflow-hidden relative flex flex-col justify-between">
          {!hasUserMessages || showFolderModal ? (
            /* =====================================================================
               ICON FOLDER CHAT INTERFACE (Matching media_1794819679889_93154fc8.png)
               ===================================================================== */
            <div className="flex-1 flex flex-col items-center justify-center px-2 sm:px-4 py-2 relative select-none overflow-y-auto overflow-x-hidden">
              {/* Vasnev dot grid canvas background matching user screenshot media_1794819679889_93154fc8.png */}
              <div
                className="absolute inset-0 pointer-events-none opacity-50 dark:opacity-40"
                style={{
                  backgroundColor: isDark ? "#121212" : "#faf8f5",
                  backgroundImage: `radial-gradient(circle, ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)"} 0 1px, transparent 1.4px)`,
                  backgroundSize: "20px 13px",
                  backgroundPosition: "-6px -1px",
                }}
              />

              {/* Top Greeting Badge & Title */}
              <div className="relative z-10 text-center mb-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-100/90 dark:bg-zinc-800/90 border border-slate-200/80 dark:border-zinc-700/80 text-[11px] font-mono uppercase tracking-wider text-[#0c7075] dark:text-[#2ff59b] font-semibold mb-1 shadow-sm">
                  <span>✦ AXIA ASSISTANT ECOSYSTEM</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-800 dark:text-white">
                  What can I help you with?
                </h2>
              </div>

              {/* Symmetrical Category Switcher Tabs */}
              <div className="relative z-10 flex items-center gap-1.5 p-1 rounded-full bg-slate-200/60 dark:bg-zinc-800/90 border border-slate-300/60 dark:border-zinc-700/80 mb-2 shadow-inner overflow-x-auto max-w-full no-scrollbar">
                {FOLDERS_CONFIG.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setActiveFolderId(f.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                      activeFolderId === f.id
                        ? "bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-sm font-semibold scale-102"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {f.title}
                  </button>
                ))}
              </div>

              {/* The Glass Icon Folder (Matching Attached Image) */}
              <div className="relative z-10 w-full flex items-center justify-center my-0.5 scale-[0.88] sm:scale-100 origin-center transition-all duration-300">
                <IconFolder
                  key={`${activeFolderId}-${isDark ? "dark" : "light"}`}
                  theme={isDark ? "dark" : "light"}
                  title={currentFolder.title}
                  tags={currentFolder.tags}
                  icons={currentFolder.icons}
                  spread={66}
                  defaultOpen={false}
                  showPill={true}
                  onSelectTag={(tag) => {
                    setShowFolderModal(false);
                    setIsThinking(true);
                    sendMessage(
                      currentFolder.id === 'departments'
                        ? `Tell me about your ${tag} department solutions and AI workflow capabilities.`
                        : `Tell me about your ${currentFolder.title} capabilities with ${tag} and AI integrations.`
                    );
                  }}
                  onSelectIcon={(icon) => {
                    if (icon.label) {
                      setShowFolderModal(false);
                      setIsThinking(true);
                      sendMessage(`Tell me about your ${icon.label} capabilities and enterprise workflow automations.`);
                    }
                  }}
                />
              </div>

              {/* Micro-hint */}
              <div className="relative z-10 flex items-center gap-2 text-[11px] text-slate-500 dark:text-zinc-400 font-mono mt-1 text-center">
                <span>Hover or tap to fan icons</span>
                <span>•</span>
                <span>Tap any tool to prompt</span>
              </div>
            </div>
          ) : (
            /* =====================================================================
               CONVERSATION VIEW (Smooth Scrolling Message Bubbles)
               ===================================================================== */
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              role="log"
              aria-live="polite"
              className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-3 text-left scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-zinc-800"
            >
              {messages.map((msg, idx) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  isStreaming={isStreaming && idx === messages.length - 1}
                  onSendChip={(q) => {
                    setIsThinking(true);
                    sendMessage(q);
                  }}
                  onRefreshChips={(msgId) => refreshChips(msgId)}
                  onNavigate={isFloating ? onClose : undefined}
                />
              ))}

              {/* Streaming / Thinking Indicator in Thread */}
              {isStreaming && (
                <div className="flex items-center gap-2 py-2 text-xs text-indigo-500 font-mono animate-pulse">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                  <span>Generating intelligent response...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Floating Scroll to Latest Button */}
          {showScrollBottom && (
            <button
              type="button"
              onClick={() => scrollToBottom(true)}
              className="absolute bottom-24 right-6 px-3 py-1.5 rounded-full bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 shadow-md text-xs font-mono text-slate-700 dark:text-slate-200 hover:text-indigo-600 flex items-center gap-1.5 z-30 transition-all"
            >
              <span>Latest</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Attachment Notice Banner */}
        {attachmentNotice && (
          <div className="px-4 py-2 bg-slate-50 dark:bg-zinc-800/80 border-t border-slate-200 dark:border-zinc-700 flex items-center justify-between text-xs text-slate-700 dark:text-slate-200">
            <div className="flex items-center gap-2 truncate">
              <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
              <span className="truncate">{attachedFiles.map((f) => f.name).join(', ')}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setAttachedFiles([]);
                setAttachmentNotice(null);
              }}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* =========================================================================
            BOTTOM INPUT BAR (Matches media_1794658771560_848e4c43.jpg)
            ========================================================================= */}
        <footer className="p-3 sm:p-4 pt-1 bg-white dark:bg-[#18181b] shrink-0 relative select-none">
          <div className="relative">
              {/* --- Attachment Popover Menu (Matching screenshot elevated popup) --- */}
              {showAttachMenu && (
                <div
                  className="absolute bottom-14 left-2 w-64 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 shadow-2xl py-2 z-50 text-left text-xs font-medium animate-in fade-in zoom-in-95 duration-150 select-none"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Option 1: Upload files or images */}
                  <button
                    type="button"
                    onClick={() => {
                      fileInputRef.current?.click();
                      setShowAttachMenu(false);
                    }}
                    className="w-full px-3.5 py-2.5 flex items-center justify-between text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Link2 className="w-4 h-4 text-slate-400" />
                      <span>Upload files or images</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Option 2: Add Connectors */}
                  <button
                    type="button"
                    onClick={() => {
                      setShowAttachMenu(false);
                      openHandoff('Enterprise Connectors Integration inquiry');
                    }}
                    className="w-full px-3.5 py-2.5 flex items-center justify-between text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Blocks className="w-4 h-4 text-slate-400" />
                      <span>Add Connectors</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Option 3: Web Search */}
                  <button
                    type="button"
                    onClick={() => {
                      setWebSearchEnabled(!webSearchEnabled);
                      setShowAttachMenu(false);
                    }}
                    className="w-full px-3.5 py-2.5 flex items-center justify-between text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Globe
                        className={`w-4 h-4 ${
                          webSearchEnabled ? 'text-indigo-500' : 'text-slate-400'
                        }`}
                      />
                      <span>Web Search</span>
                    </div>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        webSearchEnabled
                          ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {webSearchEnabled ? 'ON' : 'OFF'}
                    </span>
                  </button>
                </div>
              )}

              {/* --- Rounded Unified Input Container (Matches Screenshot) --- */}
              <div className="flex flex-col bg-slate-50/90 dark:bg-zinc-900/90 border border-slate-200/90 dark:border-zinc-800 rounded-[24px] sm:rounded-[28px] p-2 sm:p-2.5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/30 focus-within:border-indigo-400 transition-all">
                {/* Active Web Search Pill Badge */}
                {webSearchEnabled && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-[11px] font-mono w-max mb-1">
                    <Globe className="w-3 h-3" />
                    <span>Web Search active</span>
                    <button
                      type="button"
                      onClick={() => setWebSearchEnabled(false)}
                      className="ml-1 hover:text-indigo-900 dark:hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {/* Input Textarea (Steers the Dot's eyes dynamically while typing) */}
                <textarea
                  ref={inputRef}
                  rows={1}
                  maxLength={1200}
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value);
                    handleTypingEyeTracking(e.target.value);
                  }}
                  onKeyDown={handleKeyDown}
                  onFocus={() => handleTypingEyeTracking(inputText)}
                  placeholder="Ask anything..."
                  aria-label="Ask anything"
                  className="w-full bg-transparent border-0 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-0 resize-none px-2 py-1 max-h-24 scrollbar-none"
                />

                {/* Bottom Row of Controls */}
                <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-200/40 dark:border-zinc-800/60">
                  {/* Left: Attachment (+) Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowAttachMenu(!showAttachMenu);
                    }}
                    aria-label="Attach documents, connectors, or web search"
                    className="w-7 h-7 rounded-full bg-slate-200/70 hover:bg-slate-300/80 dark:bg-zinc-800 dark:hover:bg-zinc-700 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-transform active:scale-95 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>

                  {/* Right: Mic + Send Button */}
                  <div className="flex items-center gap-2">
                    {/* Microphone Audio Button */}
                    <button
                      type="button"
                      onClick={() => setIsMicActive(!isMicActive)}
                      aria-label="Voice input"
                      className={`p-1.5 rounded-full transition-colors ${
                        isMicActive
                          ? 'bg-red-50 text-red-500 animate-pulse'
                          : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <Mic className="w-4 h-4" />
                    </button>

                    {/* Circular Blue Send Button (Exact Match to Screenshot) */}
                    {isStreaming ? (
                      <button
                        type="button"
                        onClick={stopStreaming}
                        aria-label="Stop generation"
                        className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-900 text-white flex items-center justify-center transition-transform active:scale-95 shrink-0 shadow-sm"
                      >
                        <Square className="w-3 h-3 fill-current" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSend}
                        disabled={!inputText.trim()}
                        aria-label="Send message"
                        className="w-7 h-7 rounded-full bg-blue-500 hover:bg-blue-600 active:scale-95 text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0 shadow-sm"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
        </footer>
      </div>
    );
  }
);

ChatPanel.displayName = 'ChatPanel';
