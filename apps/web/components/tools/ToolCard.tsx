"use client";

import Link from "next/link";
import { Tool } from "@/types/tool";
import { ArrowRight } from "lucide-react";
import { categoryThemes } from "@/config/categories";
import { cn } from "@/lib/utils";

interface ToolCardProps {
  tool: Tool;
}

const themeColorMap: Record<string, string> = {
  blue: "group-hover:bg-blue-500 group-hover:text-white dark:group-hover:bg-blue-600",
  violet: "group-hover:bg-violet-500 group-hover:text-white dark:group-hover:bg-violet-600",
  emerald: "group-hover:bg-emerald-500 group-hover:text-white dark:group-hover:bg-emerald-600",
  pink: "group-hover:bg-pink-500 group-hover:text-white dark:group-hover:bg-pink-600",
  amber: "group-hover:bg-amber-500 group-hover:text-white dark:group-hover:bg-amber-600",
  red: "group-hover:bg-red-500 group-hover:text-white dark:group-hover:bg-red-600",
  teal: "group-hover:bg-teal-500 group-hover:text-white dark:group-hover:bg-teal-600",
};

const badgeColorMap: Record<string, string> = {
  blue: "bg-blue-500/10 text-blue-500 dark:bg-blue-500/15",
  violet: "bg-violet-500/10 text-violet-500 dark:bg-violet-500/15",
  emerald: "bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/15",
  pink: "bg-pink-500/10 text-pink-500 dark:bg-pink-500/15",
  amber: "bg-amber-500/10 text-amber-500 dark:bg-amber-500/15",
  red: "bg-red-500/10 text-red-500 dark:bg-red-500/15",
  teal: "bg-teal-500/10 text-teal-500 dark:bg-teal-500/15",
};

export default function ToolCard({ tool }: ToolCardProps) {
  const theme = categoryThemes[tool.category] || {
    color: "from-primary to-primary/80",
    bgGlow: "group-hover:shadow-[0_0_20px_rgba(0,0,0,0.05)] hover:border-primary/30",
    iconBg: "bg-muted text-muted-foreground",
    iconColor: "text-muted-foreground",
    borderHover: "group-hover:border-primary/30",
    accentColor: "slate",
  };

  const accent = theme.accentColor || "slate";
  const hoverArrowBg = themeColorMap[accent] || "group-hover:bg-primary group-hover:text-primary-foreground";
  const badgeBg = badgeColorMap[accent] || "bg-primary/10 text-primary";

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className={cn(
        "group relative flex flex-col h-full bg-card border border-border/70 hover:border-border",
        "rounded-2xl p-6 transition-all duration-300 ease-out outline-none",
        "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        "focus-visible:ring-offset-background hover:-translate-y-0.5",
        theme.bgGlow
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-bold text-foreground group-hover:text-foreground/95 transition-colors text-base tracking-tight">
          {tool.title}
        </h3>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground/80 leading-relaxed line-clamp-2 flex-grow mb-5">
        {tool.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-1">
        <div className="flex gap-2">
          {tool.featured && (
            <span className={cn(
              "inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors",
              badgeBg
            )}>
              Featured
            </span>
          )}
        </div>
        <span className={cn(
          "flex h-7 w-7 items-center justify-center rounded-lg bg-muted/65 text-muted-foreground/80",
          "transition-all duration-300 shadow-xs",
          hoverArrowBg
        )}>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </Link>
  );
}
