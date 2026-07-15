"use client";

import { useState } from "react";
import { Tool } from "@/types/tool";
import ToolCard from "@/components/tools/ToolCard";
import { Search } from "lucide-react";
import { categoryThemes } from "@/config/categories";
import { cn } from "@/lib/utils";

interface Props {
  tools: Tool[];
  categorySlug?: string;
}

const focusRingColorMap: Record<string, string> = {
  blue: "focus-within:border-blue-500/50 focus-within:ring-blue-500/10",
  violet: "focus-within:border-violet-500/50 focus-within:ring-violet-500/10",
  emerald: "focus-within:border-emerald-500/50 focus-within:ring-emerald-500/10",
  pink: "focus-within:border-pink-500/50 focus-within:ring-pink-500/10",
  amber: "focus-within:border-amber-500/50 focus-within:ring-amber-500/10",
  red: "focus-within:border-red-500/50 focus-within:ring-red-500/10",
  teal: "focus-within:border-teal-500/50 focus-within:ring-teal-500/10",
};

const textGlowColorMap: Record<string, string> = {
  blue: "group-focus-within:text-blue-500",
  violet: "group-focus-within:text-violet-500",
  emerald: "group-focus-within:text-emerald-500",
  pink: "group-focus-within:text-pink-500",
  amber: "group-focus-within:text-amber-500",
  red: "group-focus-within:text-red-500",
  teal: "group-focus-within:text-teal-500",
};

export default function CategoryToolsGrid({ tools, categorySlug }: Props) {
  const [searchQuery, setSearchQuery] = useState("");

  const theme = categoryThemes[categorySlug || tools[0]?.category || ""] || {
    accentColor: "slate",
  };

  const accent = theme.accentColor || "slate";
  const focusRing = focusRingColorMap[accent] || "focus-within:border-primary/50 focus-within:ring-primary/10";
  const iconFocusGlow = textGlowColorMap[accent] || "group-focus-within:text-primary";

  const filteredTools = tools.filter(
    (tool) =>
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header and Search area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/40">
        <div className="flex items-center gap-2.5">
          <h2 className="text-xl font-extrabold tracking-tight text-foreground">
            Available Utilities
          </h2>
          <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-bold">
            {tools.length}
          </span>
        </div>

        {/* Premium search input with themed focus styles */}
        {tools.length > 0 && (
          <div className={cn(
            "group relative flex items-center bg-card/60 border border-border/80 rounded-2xl shadow-xs transition-all duration-300 w-full md:w-80",
            focusRing
          )}>
            <Search className={cn("absolute left-4 h-4.5 w-4.5 text-muted-foreground transition-colors duration-200", iconFocusGlow)} />
            <input
              type="text"
              placeholder="Search tools in this category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-11 pr-10 bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground/60 rounded-2xl"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 text-xs font-semibold bg-muted hover:bg-muted-foreground/15 text-muted-foreground px-1.5 py-0.5 rounded-md transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        )}
      </div>

      {/* Grid Content */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      ) : (
        /* Empty State with premium illustration details */
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-dashed border-border/60 rounded-3xl bg-muted/5 max-w-xl mx-auto w-full">
          <div className="h-14 w-14 bg-muted/80 rounded-2xl flex items-center justify-center mb-4 text-muted-foreground">
            <Search className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-1">
            No utilities found
          </h3>
          <p className="text-sm text-muted-foreground max-w-xs mb-6 leading-relaxed">
            {tools.length === 0 
              ? "We don't have any tools listed in this category yet. Stay tuned!"
              : `We couldn't find any tools matching "${searchQuery}". Try editing your query.`}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="px-4 py-2 bg-foreground text-background dark:bg-foreground dark:text-background rounded-xl text-sm font-semibold hover:bg-foreground/90 transition-all active:scale-[0.98] shadow-sm"
            >
              Clear Search
            </button>
          )}
        </div>
      )}
    </div>
  );
}
