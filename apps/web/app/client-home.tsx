"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Tool } from "@/types/tool";
import { Category, categoryThemes } from "@/config/categories";
import {
  Search,
  Sparkles,
  Grid,
  Zap,
  Code,
  FileText,
  Palette,
  Calculator,
  Shield,
  Wrench,
  Image as ImageIcon,
  ArrowRight,
} from "lucide-react";
import ToolCard from "@/components/tools/ToolCard";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ClientHomeProps {
  tools: Tool[];
  categories: Category[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code,
  FileText,
  Palette,
  Calculator,
  Shield,
  Wrench,
  Image: ImageIcon,
};

const pillActiveStyles: Record<string, string> = {
  "all": "bg-foreground text-background border-foreground dark:bg-foreground dark:text-background dark:border-foreground",
  "developer-tools": "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 dark:bg-blue-500/15 shadow-[0_0_15px_rgba(59,130,246,0.12)]",
  "text-content": "border-violet-500 bg-violet-500/10 text-violet-600 dark:text-violet-400 dark:bg-violet-500/15 shadow-[0_0_15px_rgba(139,92,246,0.12)]",
  "image-tools": "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 dark:bg-emerald-500/15 shadow-[0_0_15px_rgba(16,185,129,0.12)]",
  "design-color": "border-pink-500 bg-pink-500/10 text-pink-600 dark:text-pink-400 dark:bg-pink-500/15 shadow-[0_0_15px_rgba(244,63,94,0.12)]",
  "math-calc": "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 dark:bg-amber-500/15 shadow-[0_0_15px_rgba(245,158,11,0.12)]",
  "security-tools": "border-red-500 bg-red-500/10 text-red-600 dark:text-red-400 dark:bg-red-500/15 shadow-[0_0_15px_rgba(239,68,68,0.12)]",
  "utility-tools": "border-teal-500 bg-teal-500/10 text-teal-600 dark:text-teal-400 dark:bg-teal-500/15 shadow-[0_0_15px_rgba(20,184,166,0.12)]",
};

// Extracted Search Input Component
function AnimatedSearchInput({
  searchQuery,
  setSearchQuery,
  inputRef,
}: {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  const placeholders = useMemo(
    () => [
      "Search 'JSON formatter'...",
      "Search 'Image compressor'...",
      "Search 'UUID generator'...",
      "Search 'JWT decoder'...",
      "Search 'Color converter'...",
    ],
    [],
  );

  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentString = placeholders[placeholderIndex];
    if (!currentString) return;

    if (isDeleting) {
      timer = setTimeout(() => {
        setDisplayText((prev) => prev.slice(0, -1));
        if (displayText.length <= 1) {
          setIsDeleting(false);
          setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
        }
      }, 30);
    } else {
      timer = setTimeout(() => {
        setDisplayText(currentString.slice(0, displayText.length + 1));
        if (displayText.length >= currentString.length) {
          timer = setTimeout(() => setIsDeleting(true), 2000);
        }
      }, 70);
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, placeholderIndex, placeholders]);

  return (
    <div className="relative w-full max-w-2xl mt-6 group">
      <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-3xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
      <div className="relative flex items-center bg-card border-2 border-border/60 hover:border-border focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 rounded-2xl shadow-sm transition-all duration-300">
        <Search className="absolute left-5 h-6 w-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={searchQuery ? "" : displayText}
          className="w-full h-16 pl-14 pr-16 bg-transparent border-none outline-none text-lg text-foreground placeholder:text-muted-foreground/60 rounded-2xl"
        />
        <div className="absolute right-4 flex items-center gap-1 opacity-50">
          <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded border bg-muted px-2 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-4 text-xs font-semibold bg-muted text-muted-foreground px-2 py-1 rounded-md hover:bg-muted-foreground/20 transition-colors"
          >
            ESC
          </button>
        )}
      </div>
    </div>
  );
}

export default function ClientHome({ tools, categories }: ClientHomeProps) {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync search query if URL changes
  useEffect(() => {
    setSearchQuery(searchParams.get("q") || "");
  }, [searchParams]);

  // Keyboard shortcut to focus search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      // 1. Filter by category first if a specific one is selected
      if (activeCategory !== "all" && tool.category !== activeCategory) {
        return false;
      }
      // 2. Filter by search query
      const query = searchQuery.toLowerCase();
      return (
        tool.title.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.category.toLowerCase().includes(query)
      );
    });
  }, [tools, searchQuery, activeCategory]);

  const getToolsByCategory = (categoryId: string) => {
    return tools.filter((t) => t.category === categoryId);
  };

  const handleSuggestionClick = (query: string) => {
    setSearchQuery(query);
    inputRef.current?.focus();
  };

  const activeTheme = categoryThemes[activeCategory] || null;

  return (
    <div className="flex flex-col gap-14 pb-10">
      {/* Hero Search Section */}
      <div className="flex flex-col items-center text-center gap-6 max-w-4xl mx-auto pt-6 md:pt-14 px-4 w-full relative">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50 text-sm font-medium text-muted-foreground mb-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span>Your all-in-one workspace</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70 leading-tight">
          100+ Developer & Content Tools,
          <br /> All In One Place.
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
          Format JSON, convert images, generate UUIDs, and more—instantly,
          securely, and completely in your browser.
        </p>

        <AnimatedSearchInput 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          inputRef={inputRef}
        />

        {/* Suggestion Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-2 max-w-2xl">
          <span className="text-sm text-muted-foreground font-medium mr-2 hidden sm:inline-block">
            Popular:
          </span>
          <button
            onClick={() => handleSuggestionClick("JSON Formatter")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border hover:border-primary/50 text-xs font-medium text-foreground transition-all shadow-sm hover:shadow-md"
          >
            <Zap className="h-3 w-3 text-yellow-500" />
            JSON Formatter
          </button>
          <button
            onClick={() => handleSuggestionClick("Base64")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border hover:border-primary/50 text-xs font-medium text-foreground transition-all shadow-sm hover:shadow-md"
          >
            Base64 Converter
          </button>
          <button
            onClick={() => handleSuggestionClick("JWT Decoder")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border hover:border-primary/50 text-xs font-medium text-foreground transition-all shadow-sm hover:shadow-md"
          >
            JWT Decoder
          </button>
        </div>
      </div>

      {/* Interactive Category Tabs Filter */}
      <div className="w-full border-y border-border/40 py-5 bg-muted/5 flex items-center justify-center">
        <div className="flex flex-wrap items-center justify-center gap-2 px-4 max-w-7xl w-full">
          {/* All Tools Pill */}
          <button
            onClick={() => {
              setActiveCategory("all");
            }}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-border/70 bg-card hover:bg-muted/50 transition-all duration-300 shadow-2xs cursor-pointer",
              activeCategory === "all" ? pillActiveStyles["all"] : "text-muted-foreground"
            )}
          >
            <Grid className="h-4 w-4" />
            All Tools
            <span className={cn(
              "inline-flex items-center justify-center px-1.5 py-0.5 rounded-md text-[10px] font-bold",
              activeCategory === "all" ? "bg-background/25 text-foreground" : "bg-muted text-muted-foreground"
            )}>
              {tools.length}
            </span>
          </button>

          {/* Individual Category Pills */}
          {categories.map((category) => {
            const IconComponent = iconMap[category.icon] || Code;
            const count = getToolsByCategory(category.id).length;
            const isActive = activeCategory === category.id;

            return (
              <button
                key={category.id}
                onClick={() => {
                  setActiveCategory(category.id);
                }}
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-border/70 bg-card hover:bg-muted/50 transition-all duration-300 shadow-2xs cursor-pointer",
                  isActive ? pillActiveStyles[category.id] : "text-muted-foreground"
                )}
              >
                <IconComponent className="h-4 w-4" />
                {category.name}
                <span className={cn(
                  "inline-flex items-center justify-center px-1.5 py-0.5 rounded-md text-[10px] font-bold",
                  isActive 
                    ? "bg-foreground/10 dark:bg-foreground/15 text-current" 
                    : "bg-muted text-muted-foreground"
                )}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area - Always displays matching tools in category grid */}
      <div className="flex flex-col gap-6 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/30">
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-extrabold tracking-tight text-foreground">
              {activeCategory === "all" 
                ? "All Tools" 
                : categories.find(c => c.id === activeCategory)?.name || "Tools"}
            </h2>
            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-bold">
              {filteredTools.length}
            </span>
          </div>

          {/* Link to Dedicated Category Page */}
          {activeCategory !== "all" && (
            <Link
              href={`/category/${activeCategory}`}
              className={cn(
                "inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-all group",
                activeTheme ? `hover:${activeTheme.iconColor}` : ""
              )}
            >
              View Category Page
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}
        </div>

        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-dashed border-border/60 rounded-3xl bg-muted/5 max-w-xl mx-auto w-full">
            <div className="h-14 w-14 bg-muted/80 rounded-2xl flex items-center justify-center mb-4 text-muted-foreground">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-1">
              No tools found
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs mb-6 leading-relaxed">
              We couldn't find any utilities matching "{searchQuery}" under this filter. Try clearing the search or category filter.
            </p>
            <div className="flex gap-3">
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="px-4 py-2 bg-foreground text-background dark:bg-foreground dark:text-background rounded-xl text-sm font-semibold hover:bg-foreground/90 transition-all shadow-sm"
                >
                  Clear Search
                </button>
              )}
              {activeCategory !== "all" && (
                <button
                  onClick={() => setActiveCategory("all")}
                  className="px-4 py-2 border border-border/80 bg-card text-foreground rounded-xl text-sm font-semibold hover:bg-muted/50 transition-all shadow-sm"
                >
                  All Categories
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
