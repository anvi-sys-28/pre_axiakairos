import type { Message, HandoffPayload, CardItem, SourceItem } from './types';

function getApiBase(): string {
  if (typeof window !== 'undefined') {
    const custom = localStorage.getItem('axia_backend_url');
    if (custom) return custom;
  }
  return (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
}

export interface HealthResponse {
  status: 'ok' | 'offline';
  timestamp?: string;
  kbChunks?: number;
  aiModel?: string;
}

export async function checkHealth(): Promise<HealthResponse> {
  try {
    const res = await fetch(`${getApiBase()}/api/health`);
    if (!res.ok) return { status: 'offline' };
    return await res.json();
  } catch {
    return { status: 'offline' };
  }
}

export async function fetchSuggestedChips(): Promise<string[]> {
  try {
    const res = await fetch(`${getApiBase()}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ intent: 'suggest' }),
    });
    if (!res.ok) throw new Error('Failed to fetch chips');
    const data = await res.json();
    return data.chips || [
      'Tell me about SAP services',
      'Show case studies',
      'How do you work with clients?',
    ];
  } catch {
    return [
      'What services do you offer?',
      'Show recent case studies',
      'Explore careers at Axia Kairos',
    ];
  }
}

export interface StreamChatHandlers {
  onToken: (token: string) => void;
  onCards: (cards: CardItem[]) => void;
  onChips: (chips: string[]) => void;
  onSources: (sources: SourceItem[]) => void;
  onForm: (formData: any) => void;
  onError: (errorMsg: string) => void;
  onDone: () => void;
}

async function simulateIntelligentResponse(
  message: string,
  handlers: StreamChatHandlers,
  signal?: AbortSignal
): Promise<void> {
  const lower = message.toLowerCase();
  let responseText = '';
  let chips: string[] = [];

  if (lower.includes('image') || lower.includes('create')) {
    responseText = "Here is a conceptual architecture for sovereign enterprise AI agents:\n\n1. **Autonomous DAG Planner**: Decomposes complex executive goals into auditable task vectors.\n2. **Private Vector Store**: Indexes ERP records, documentation, and operational logs with zero-data retention.\n3. **Human-in-the-Loop Governance Gate**: Enforces policy gates before transactions execute.\n\nWould you like me to tailor this for your ERP or Cloud infrastructure?";
    chips = ['Explore SAP S/4HANA integration', 'View Agentic DAG Blueprint', 'Connect with our team'];
  } else if (lower.includes('email') || lower.includes('draft')) {
    responseText = "Here is a drafted executive briefing email:\n\n**Subject: Enhancing Enterprise Efficiency with Axia Kairos Sovereign AI Agents**\n\nDear Leadership Team,\n\nWe are evaluating the deployment of sovereign, mathematically auditable AI copilots to connect our core business systems with autonomous workflows. Key benefits include:\n- **78% Reduction** in exception handling latency across supply chain ops.\n- **Zero-trust enterprise security** with isolated VPC guardrails.\n\nLet's schedule a 20-minute briefing with the Axia Kairos engineering team this week.\n\nBest regards,\n[Your Name]";
    chips = ['Schedule executive briefing', 'Review security guardrails', 'See client case studies'];
  } else if (lower.includes('debug') || lower.includes('code')) {
    responseText = "Let's diagnose your distributed DAG workflow bottlenecks:\n\n- **Check Node Concurrency**: Ensure node parallelization does not exceed Redis / Postgres pool limits.\n- **Verify Schema Contracts**: Validate typed inputs at each agent boundary to prevent silent fallback loops.\n- **Measure Step Latencies**: Pinpoint P99 latency spikes on embedding lookups.\n\nWould you like me to inspect a specific code snippet or trace log?";
    chips = ['Analyze latency benchmark', 'Inspect microservice topology', 'Talk to an AI engineer'];
  } else if (lower.includes('ideas') || lower.includes('use case')) {
    responseText = "Here are 5 high-impact enterprise AI agent opportunities:\n\n1. **Autonomous Invoice & Customs Reconciliation**: Cognitive vision agents that reconcile multi-lingual bills of lading in under 2 seconds.\n2. **Predictive Port & Logistics Disruption**: Early-warning simulations anticipating supply chain bottlenecks before they occur.\n3. **Continuous SAP Core Audit**: Agentic crawlers tracking SAP BTP clean core extensions and transactions.\n4. **Algorithmic Liquidity & Treasury Sweeps**: Real-time cash forecasting and automated hedging proposals.\n5. **Self-Healing Infrastructure Mesh**: Autonomous remediation of Kubernetes clusters and telemetry anomalies.";
    chips = ['Explore Supply Chain AI', 'See FinTech & Treasury cases', 'Talk to our team'];
  } else {
    responseText = `Thank you for your question regarding **"${message.replace(/\[.*?\]\s*/g, '')}"**.\n\nAt Axia Kairos, we build and deploy sovereign, mathematically auditable AI copilots and agentic mesh architectures. Our enterprise solutions seamlessly unite your core systems—including SAP S/4HANA, cloud data lakes, and real-time operational streams—into autonomous, high-reliability intelligence.\n\nHow would you like to proceed?`;
    chips = ['Explore Our Services', 'View Case Studies', 'Connect with our principal advisors'];
  }

  const words = responseText.split(' ');
  for (let i = 0; i < words.length; i++) {
    if (signal?.aborted) return;
    const token = (i === 0 ? '' : ' ') + words[i];
    handlers.onToken(token);
    await new Promise((r) => setTimeout(r, 22));
  }

  handlers.onChips(chips);
  handlers.onDone();
}

export async function streamChat(
  message: string,
  history: Message[],
  handlers: StreamChatHandlers,
  signal?: AbortSignal
): Promise<void> {
  try {
    const formattedHistory = history
      .filter((m) => m.parts.some((p) => p.type === 'text'))
      .map((m) => {
        const textPart = m.parts.find((p) => p.type === 'text');
        return {
          role: m.role,
          content: textPart ? (textPart as { type: 'text'; content: string }).content : '',
        };
      })
      .slice(-10);

    const res = await fetch(`${getApiBase()}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
      },
      body: JSON.stringify({
        message,
        history: formattedHistory,
      }),
      signal,
    });

    if (!res.ok) {
      throw new Error(`Server returned status ${res.status}`);
    }

    const reader = res.body?.getReader();
    if (!reader) {
      throw new Error('ReadableStream not supported');
    }

    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n\n');
      buffer = lines.pop() || '';

      for (const chunk of lines) {
        const trimmed = chunk.trim();
        if (!trimmed) continue;

        const eventMatch = trimmed.match(/^event:\s*(.+)$/m);
        const dataMatch = trimmed.match(/^data:\s*(.+)$/m);

        if (eventMatch && dataMatch) {
          const eventName = eventMatch[1].trim();
          try {
            const parsedData = JSON.parse(dataMatch[1].trim());

            switch (eventName) {
              case 'token':
                handlers.onToken(typeof parsedData === 'string' ? parsedData : String(parsedData));
                break;
              case 'cards':
                handlers.onCards(parsedData);
                break;
              case 'chips':
                handlers.onChips(parsedData);
                break;
              case 'sources':
                handlers.onSources(parsedData);
                break;
              case 'form':
                handlers.onForm(parsedData);
                break;
              case 'error':
                handlers.onError(parsedData.message || 'An error occurred.');
                break;
              case 'done':
                handlers.onDone();
                break;
            }
          } catch (e) {
            console.error('Failed to parse SSE payload:', dataMatch[1], e);
          }
        }
      }
    }

    handlers.onDone();
  } catch (err: any) {
    if (signal?.aborted) return;
    // Graceful offline fallback with intelligent simulation
    await simulateIntelligentResponse(message, handlers, signal);
  }
}

export async function submitHandoff(payload: HandoffPayload): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${getApiBase()}/api/handoff`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => '');
    throw new Error(errorText || `Handoff submission failed with status ${res.status}`);
  }

  return await res.json();
}

export async function sendFeedback(payload: {
  rating: 'up' | 'down';
  question: string;
  answerSnippet?: string;
  usedChunks?: string[];
}): Promise<void> {
  try {
    await fetch(`${getApiBase()}/api/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.warn('Feedback send failed:', err);
  }
}
