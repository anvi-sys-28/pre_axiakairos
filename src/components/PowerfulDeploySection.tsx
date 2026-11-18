"use client";

import React from "react";
import { Link } from "react-router-dom";
import {
  Link2,
  Bot,
  Network,
  Boxes,
  Cpu,
  Share2,
  Rocket,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface PowerfulDeploySectionProps {
  isDark?: boolean;
  className?: string;
}

interface FeatureGridItem {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
}

const FEATURE_ITEMS: FeatureGridItem[] = [
  {
    id: "logic-apps",
    icon: Link2,
    title: "SAP & Azure Integration",
    description:
      "Create automated enterprise workflows with over 1,400 certified connectors across SAP S/4HANA, Azure, and legacy systems.",
  },
  {
    id: "hosted-agents",
    icon: Bot,
    title: "Hosted SAP Agents",
    description:
      "Deploy autonomous AI agents in sovereign private clouds with enterprise-grade scaling, compliance, and governance.",
  },
  {
    id: "multi-agent",
    icon: Network,
    title: "Multi-Agent Workflows",
    description:
      "Orchestrate collaborative AI agents across complex SAP procurement, financial closing, and supply chain logistics.",
  },
  {
    id: "builtin-tools",
    icon: Boxes,
    title: "Built-In ERP Tools",
    description:
      "Add ready-to-use accelerators for enterprise needs across SAP BTP, Microsoft Fabric, Salesforce, and real-time telemetry.",
  },
  {
    id: "mcp",
    icon: Cpu,
    title: "Model Context Protocol",
    description:
      "Connect enterprise LLMs directly to SAP Datasphere and core APIs via MCP for secure, token-governed interoperability.",
  },
  {
    id: "memory",
    icon: Share2,
    title: "Built-In Enterprise Memory",
    description:
      "Extend institutional knowledge and user context securely across every SAP transaction and cross-system interaction.",
  },
  {
    id: "deployment",
    icon: Rocket,
    title: "One-Click Deployment",
    description:
      "Deploy validated SAP workloads instantly to Microsoft Teams, Copilot, and cloud clusters with automated rollback safeguards.",
  },
  {
    id: "guardrails",
    icon: ShieldCheck,
    title: "Observability & Guardrails",
    description:
      "Monitor transaction health, latency, cost, and security with live telemetry dashboards, SOX compliance tracing, and built-in guardrails.",
  },
];

export const PowerfulDeploySection: React.FC<PowerfulDeploySectionProps> = ({
  isDark = true,
  className,
}) => {
  const row1 = FEATURE_ITEMS.slice(0, 4);
  const row2 = FEATURE_ITEMS.slice(4, 8);

  const renderCell = (item: FeatureGridItem, index: number, isBottomRow: boolean) => {
    const Icon = item.icon;
    const isColEndDesktop = (index + 1) % 4 === 0;
    const isColEndTablet = (index + 1) % 2 === 0;

    return (
      <div
        key={item.id}
        className={cn(
          "group relative p-6 sm:p-8 flex flex-col justify-start transition-all duration-200",
          // Hover state
          isDark ? "hover:bg-white/[0.035]" : "hover:bg-zinc-50/80",
          // Mobile separator: border-b between stacked cards on small screens
          !isBottomRow && "border-b border-white/10 dark:border-white/10 border-zinc-200 md:border-b-0",
          // Vertical dashed dividing lines between columns
          !isColEndDesktop && "lg:border-r lg:border-dashed",
          !isColEndTablet && "md:border-r md:border-dashed lg:border-r-0",
          isColEndTablet && !isColEndDesktop && "lg:border-r lg:border-dashed",
          isDark
            ? "lg:border-white/15 md:border-white/15"
            : "lg:border-zinc-300/80 md:border-zinc-300/80"
        )}
      >
        {/* Icon & Title Row */}
        <div className="flex items-center gap-3 mb-3.5">
          <span
            className={cn(
              "flex size-7 items-center justify-center rounded-md shrink-0 transition-transform duration-200 group-hover:scale-110",
              isDark
                ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                : "text-emerald-700 bg-emerald-50 border border-emerald-200"
            )}
          >
            <Icon className="size-4" />
          </span>
          <h3
            className={cn(
              "text-[15px] sm:text-base font-semibold tracking-tight transition-colors duration-200",
              isDark ? "text-white group-hover:text-emerald-300" : "text-zinc-900 group-hover:text-emerald-800"
            )}
          >
            {item.title}
          </h3>
        </div>

        {/* Description */}
        <p
          className={cn(
            "text-[13px] sm:text-[13.5px] leading-relaxed font-normal transition-colors duration-200",
            isDark ? "text-zinc-400 group-hover:text-zinc-300" : "text-zinc-600 group-hover:text-zinc-700"
          )}
        >
          {item.description}
        </p>
      </div>
    );
  };

  return (
    <section
      id="powerfulScaleSection"
      aria-label="Powerful to deploy, ready to scale"
      className={cn(
        "relative w-full py-20 sm:py-24 lg:py-28 overflow-hidden transition-colors duration-500 z-20",
        isDark
          ? "bg-[#0c0e12] text-white"
          : "bg-[#faf8f5] text-zinc-900 border-t border-[#e2e8f0]",
        className
      )}
    >
      {/* Subtle Ambient Radial Glows */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40 transition-opacity duration-500"
        style={{
          background: isDark
            ? "radial-gradient(circle at 18% 20%, rgba(16, 185, 129, 0.08), transparent 45%), radial-gradient(circle at 82% 80%, rgba(45, 212, 191, 0.05), transparent 50%)"
            : "radial-gradient(circle at 18% 20%, rgba(12, 112, 117, 0.06), transparent 45%), radial-gradient(circle at 82% 80%, rgba(16, 185, 129, 0.05), transparent 50%)",
        }}
        aria-hidden="true"
      />

      {/* ================================================================= */}
      {/* Top Header Block (Contained within max-w-7xl)                     */}
      {/* ================================================================= */}
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 mb-14 sm:mb-16">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-bold tracking-tight leading-[1.12]">
              Powerful to deploy,{" "}
              <span
                className={cn(
                  "font-normal transition-colors duration-300",
                  isDark ? "text-zinc-400" : "text-zinc-500"
                )}
              >
                ready to scale
              </span>
            </h2>
            <p
              className={cn(
                "mt-4 text-[15px] sm:text-base lg:text-[17px] leading-relaxed max-w-2xl font-normal transition-colors duration-300",
                isDark ? "text-zinc-400" : "text-zinc-600"
              )}
            >
              Empower your enterprise with end-to-end SAP solutions, intelligent workflows,
              and mission-critical cloud integrations. Memory, state, security, and automated
              reasoning are built in so you can focus on business outcomes, not complexity.
            </p>
          </div>

          <div className="shrink-0 lg:pb-1">
            <Link
              to="/services"
              className={cn(
                "inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-200 shadow-md",
                isDark
                  ? "bg-[#0c7075] text-white hover:bg-[#073b3a] shadow-emerald-500/20 hover:shadow-emerald-500/35 hover:scale-[1.02]"
                  : "bg-[#073b3a] text-white hover:bg-[#0c7075] shadow-teal-900/15 hover:scale-[1.02]"
              )}
            >
              <span>Explore SAP solutions</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* 4x2 Grid Matrix with 100% Full-Width Edge-to-Edge Horizontal Lines */}
      {/* ================================================================= */}
      <div
        className={cn(
          "relative w-full border-t border-b transition-colors duration-300",
          isDark ? "border-white/10" : "border-zinc-200"
        )}
      >
        {/* Row 1: Full-width container with edge-to-edge bottom divider */}
        <div
          className={cn(
            "w-full border-b transition-colors duration-300",
            isDark ? "border-white/10" : "border-zinc-200"
          )}
        >
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {row1.map((item, index) => renderCell(item, index, false))}
          </div>
        </div>

        {/* Row 2: Full-width container */}
        <div className="w-full">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {row2.map((item, index) => renderCell(item, index + 4, true))}
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* Secondary Strip: Edge-to-edge dashed top line + Contained content */}
      {/* ================================================================= */}
      <div
        className={cn(
          "w-full border-t border-dashed mt-20 sm:mt-24 pt-10 sm:pt-14 transition-colors duration-300",
          isDark ? "border-white/10" : "border-zinc-200"
        )}
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight leading-snug">
              Trusted to operate,{" "}
              <span
                className={cn(
                  "font-normal transition-colors duration-300",
                  isDark ? "text-zinc-400" : "text-zinc-500"
                )}
              >
                developer-first control
              </span>
            </h3>
            <p
              className={cn(
                "mt-2 text-sm sm:text-base leading-relaxed font-normal transition-colors duration-300",
                isDark ? "text-zinc-400" : "text-zinc-600"
              )}
            >
              Ship confidently with enterprise-grade built-in security, compliance, and
              guardrails to keep your mission-critical operations safe and performant.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/contact"
              className={cn(
                "inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 shadow-md",
                isDark
                  ? "bg-[#0c7075] text-white hover:bg-[#073b3a] shadow-emerald-500/20 hover:scale-[1.02]"
                  : "bg-[#073b3a] text-white hover:bg-[#0c7075] shadow-teal-900/15 hover:scale-[1.02]"
              )}
            >
              <span>Explore enterprise capabilities</span>
            </Link>
            <Link
              to="/case-studies"
              className={cn(
                "inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 border",
                isDark
                  ? "border-white/20 text-white hover:bg-white/10 hover:border-white/30"
                  : "border-zinc-300 text-zinc-800 hover:bg-zinc-100"
              )}
            >
              <span>View SAP solution templates</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PowerfulDeploySection;
