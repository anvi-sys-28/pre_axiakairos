import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export type BlockTone = "auto" | "light" | "dark" | "brand";

export interface BlockLink {
  label: string;
  href: string;
  target?: string;
  rel?: string;
}

export const blockFrame = "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8";

export function blockToneProps(tone: BlockTone = "auto") {
  return {
    "data-tone": tone,
    className: tone === "dark" ? "dark" : tone === "light" ? "light" : "",
  };
}

export function useBlockReducedMotion(): boolean {
  const shouldReduce = useReducedMotion();
  return Boolean(shouldReduce);
}

export function CtaLink({
  link,
  variant = "secondary",
  arrow = false,
  className,
}: {
  link: BlockLink;
  variant?: "primary" | "secondary" | "ghost";
  arrow?: boolean;
  className?: string;
}) {
  return (
    <a
      href={link.href}
      target={link.target}
      rel={link.rel}
      className={cn(
        "group/cta inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[14px] font-medium transition-all duration-200 outline-none",
        variant === "secondary" &&
          "border border-[color:var(--bjork-border)] bg-[var(--bjork-surface)] text-[color:var(--bjork-text)] hover:border-[color:var(--bjork-border-strong)] hover:bg-[var(--bjork-surface-hover)] shadow-sm",
        variant === "primary" &&
          "bg-[color:var(--bjork-accent)] text-[color:var(--bjork-accent-foreground)] hover:bg-[color:var(--bjork-accent-hover)]",
        className
      )}
    >
      <span>{link.label}</span>
      {arrow && (
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          className="size-3.5 transition-transform duration-200 group-hover/cta:translate-x-0.5"
        >
          <path d="M3.333 8h9.334M8.667 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </a>
  );
}

export function Reveal({
  as: Component = "div",
  delay = 0,
  className,
  children,
}: {
  as?: React.ElementType;
  delay?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const reduce = useBlockReducedMotion();

  if (reduce) {
    const Tag = (Component || "div") as any;
    return <Tag className={className}>{children}</Tag>;
  }

  const MotionTag = motion[Component as keyof typeof motion] || motion.div;

  return (
    <MotionTag
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.45,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}

export function SectionHeader({
  id,
  eyebrow,
  title,
  className,
}: {
  id?: string;
  eyebrow?: string;
  title: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-start gap-3", className)}>
      {eyebrow && (
        <span className="inline-flex items-center rounded-full bg-[var(--bjork-accent-soft)] px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-[color:var(--bjork-accent)] border border-[color:var(--bjork-accent-muted)]">
          {eyebrow}
        </span>
      )}
      <h2
        id={id}
        className="font-bjork-display text-[32px] sm:text-[42px] lg:text-[48px] font-bold tracking-tight text-[color:var(--bjork-text)] leading-[1.1]"
      >
        {title}
      </h2>
    </div>
  );
}
