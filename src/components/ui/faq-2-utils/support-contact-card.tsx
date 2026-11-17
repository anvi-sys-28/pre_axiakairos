import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export type SupportAvatar = {
  src: string;
  alt: string;
  fallback: string;
  className?: string;
};

export interface SupportContactCardProps {
  title?: string;
  description?: string;
  buttonText?: string;
  onContactClick?: () => void;
  contactHref?: string;
  supportAvatars?: ReadonlyArray<SupportAvatar>;
  className?: string;
  isDark?: boolean;
}

export function SupportContactCard({
  title = "Still have questions?",
  description = "Can't find the answer you're looking for? Please chat to our friendly team.",
  buttonText = "Get in touch",
  contactHref = "#contact",
  onContactClick,
  supportAvatars = [],
  className,
  isDark = true,
}: SupportContactCardProps) {
  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-between gap-6 rounded-2xl p-6 sm:p-8 md:flex-row transition-colors duration-300 shadow-xl backdrop-blur-md",
        isDark
          ? "border border-white/10 bg-[#141518]/90 text-white"
          : "border border-[#e2e8f0] bg-white/95 text-[#0f172a] shadow-sm",
        className
      )}
    >
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
        {supportAvatars.length > 0 && (
          <div className="flex -space-x-3 overflow-hidden p-1">
            {supportAvatars.map((avatar, i) => (
              <Avatar
                key={i}
                className={cn(
                  "size-11 border-2 shadow-md",
                  isDark ? "border-[#141518]" : "border-white",
                  avatar.className
                )}
              >
                <AvatarImage src={avatar.src} alt={avatar.alt} />
                <AvatarFallback>{avatar.fallback}</AvatarFallback>
              </Avatar>
            ))}
          </div>
        )}
        <div>
          <h3 className={cn("text-base font-semibold tracking-tight sm:text-lg", isDark ? "text-white" : "text-[#0f172a]")}>
            {title}
          </h3>
          <p className={cn("mt-1 text-sm max-w-md", isDark ? "text-zinc-400" : "text-[#64748b]")}>
            {description}
          </p>
        </div>
      </div>

      <div className="shrink-0">
        <a
          href={contactHref}
          onClick={onContactClick}
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all shadow-md",
            isDark
              ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-emerald-500/20"
              : "bg-[#0c7075] text-white hover:bg-[#073b3a] shadow-[#0c7075]/20"
          )}
        >
          <span>{buttonText}</span>
          <ArrowRight className="size-4" />
        </a>
      </div>
    </div>
  );
}

export default SupportContactCard;
