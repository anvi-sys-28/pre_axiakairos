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
  ChevronDown,
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
import { IconFolder, DEFAULT_ICONS, type FolderIcon } from '@/components/ui/icon-folder';

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

const AVAILABLE_MODELS = [
  { id: 'opus-4-5', name: 'Opus 4.5 Medium', provider: 'Anthropic Claude' },
  { id: 'sonnet-3-7', name: 'Claude 3.7 Sonnet', provider: 'Anthropic Claude' },
  { id: 'kairos-3-0', name: 'Axia Kairos 3.0 Pro', provider: 'Sovereign Swarm' },
  { id: 'gpt-4o', name: 'GPT-4o Enterprise', provider: 'OpenAI Omni' },
];

const FOLDERS_CONFIG = [
  {
    id: 'design',
    title: 'Design',
    tags: ['Figma', 'Higgsfield', 'Hotjar', 'After Effects'],
    icons: DEFAULT_ICONS.slice(0, 4),
    label: 'Creative & UI/UX',
  },
  {
    id: 'automation',
    title: 'Automation',
    tags: ['SAP S/4', 'n8n', 'Python', 'OpenAI'],
    icons: [
      {
        label: 'SAP S/4',
        background: 'linear-gradient(135deg,#005494,#002a4a)',
        node: (
          <span className="font-sans font-black text-white text-[13px] tracking-tight">SAP</span>
        ),
      },
      {
        label: 'n8n',
        background: 'linear-gradient(135deg,#ea4b71,#b81440)',
        node: (
          <svg viewBox="0 0 24 24" width="55%" height="55%" fill="#fff" aria-hidden="true">
            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 14.5h-2v-5h2zm0-7h-2V7h2z" />
          </svg>
        ),
      },
      {
        label: 'Python',
        background: 'linear-gradient(135deg,#3776ab,#ffd43b)',
        node: (
          <svg viewBox="0 0 24 24" width="55%" height="55%" fill="#fff" aria-hidden="true">
            <path d="M11.9 2c-3.6 0-3.4 1.6-3.4 1.6l.04 1.64h3.46v.5H7.1s-2.3.26-2.3 3.38c0 3.13 2 3.06 2 3.06h1.2v-1.7s-.06-2 1.98-2h3.42s1.92.03 1.92-1.88V4.76S15.65 2 11.9 2zM10.2 3.5a.6.6 0 1 1 0 1.2.6.6 0 0 1 0-1.2zm1.9 18.5c3.6 0 3.4-1.6 3.4-1.6l-.04-1.64h-3.46v-.5h4.9s2.3-.26 2.3-3.38c0-3.13-2-3.06-2-3.06h-1.2v1.7s.06 2-1.98 2h-3.42s-1.92-.03-1.92 1.88v1.84s-.33 2.76 3.42 2.76zm1.7-1.5a.6.6 0 1 1 0-1.2.6.6 0 0 1 0 1.2z" />
          </svg>
        ),
      },
      {
        label: 'OpenAI',
        background: 'linear-gradient(135deg,#10a37f,#0b6e55)',
        node: (
          <svg viewBox="0 0 24 24" width="55%" height="55%" fill="#fff" aria-hidden="true">
            <path d="M22.28 9.87a5.98 5.98 0 0 0-.52-4.92 6.05 6.05 0 0 0-6.62-2.73 6.01 6.01 0 0 0-4.63-2.07 6.07 6.07 0 0 0-5.77 4.19 6.02 6.02 0 0 0-3.95 2.87 6.05 6.05 0 0 0 .74 7.15 6 6 0 0 0 .52 4.91 6.05 6.05 0 0 0 6.62 2.74 6.04 6.04 0 0 0 4.63 2.06 6.07 6.07 0 0 0 5.77-4.18 6.02 6.02 0 0 0 3.95-2.88 6.05 6.05 0 0 0-.74-7.14z" />
          </svg>
        ),
      },
    ],
    label: 'Enterprise Logic',
  },
  {
    id: 'analytics',
    title: 'Analytics',
    tags: ['Mixpanel', 'Maze', 'Databricks', 'BigQuery'],
    icons: [
      DEFAULT_ICONS[5], // Mixpanel
      DEFAULT_ICONS[4], // Maze
      {
        label: 'Databricks',
        background: 'linear-gradient(135deg,#ff3621,#c22413)',
        node: (
          <span className="font-mono font-black text-white text-[12px]">DBX</span>
        ),
      },
      {
        label: 'BigQuery',
        background: 'linear-gradient(135deg,#4285f4,#1a73e8)',
        node: (
          <span className="font-mono font-black text-white text-[12px]">GBQ</span>
        ),
      },
    ],
    label: 'Data & Telemetry',
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
    const [selectedModel, setSelectedModel] = useState('Opus 4.5 Medium');
    const [showModelMenu, setShowModelMenu] = useState(false);
    const [showAttachMenu, setShowAttachMenu] = useState(false);
    const [showTopMenu, setShowTopMenu] = useState(false);
    const [showScrollBottom, setShowScrollBottom] = useState(false);
    const [webSearchEnabled, setWebSearchEnabled] = useState(false);
    const [isMicActive, setIsMicActive] = useState(false);
    const [isThinking, setIsThinking] = useState(false);
    const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
    const [attachmentNotice, setAttachmentNotice] = useState<string | null>(null);

    // Interactive Glass Icon Folder states
    const [activeFolderId, setActiveFolderId] = useState<'design' | 'automation' | 'analytics'>('design');
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
          if (showModelMenu) {
            setShowModelMenu(false);
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
    }, [onClose, showAttachMenu, showModelMenu, showTopMenu]);

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
      setShowModelMenu(false);
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
          if (showModelMenu) setShowModelMenu(false);
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
              <div className="relative z-10 flex items-center gap-1.5 p-1 rounded-full bg-slate-200/60 dark:bg-zinc-800/90 border border-slate-300/60 dark:border-zinc-700/80 mb-2 shadow-inner">
                {FOLDERS_CONFIG.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setActiveFolderId(f.id as any)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
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
                    sendMessage(`Tell me about your ${currentFolder.title} capabilities with ${tag} and AI integrations.`);
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

              {/* --- Model Selector Popover Dropdown --- */}
              {showModelMenu && (
                <div
                  className="absolute bottom-14 right-16 w-56 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 shadow-2xl py-2 z-50 text-left text-xs font-medium animate-in fade-in zoom-in-95 duration-150 select-none"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    Reasoning Engine
                  </div>
                  {AVAILABLE_MODELS.map((model) => (
                    <button
                      key={model.id}
                      type="button"
                      onClick={() => {
                        setSelectedModel(model.name);
                        setShowModelMenu(false);
                      }}
                      className={`w-full px-3.5 py-2 flex items-center justify-between transition-colors ${
                        selectedModel === model.name
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <div>
                        <div>{model.name}</div>
                        <div className="text-[10px] text-slate-400 font-normal">
                          {model.provider}
                        </div>
                      </div>
                      {selectedModel === model.name && (
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      )}
                    </button>
                  ))}
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
                      setShowModelMenu(false);
                    }}
                    aria-label="Attach documents, connectors, or web search"
                    className="w-7 h-7 rounded-full bg-slate-200/70 hover:bg-slate-300/80 dark:bg-zinc-800 dark:hover:bg-zinc-700 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-transform active:scale-95 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>

                  {/* Right: Model Selector + Mic + Send Button */}
                  <div className="flex items-center gap-2">
                    {/* Model Selector Pill */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowModelMenu(!showModelMenu);
                        setShowAttachMenu(false);
                      }}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-transparent hover:bg-slate-200/60 dark:hover:bg-zinc-800 text-xs font-medium text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                    >
                      <span>{selectedModel}</span>
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    </button>

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
