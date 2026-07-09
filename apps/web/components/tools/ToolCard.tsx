"use client";

import Link from "next/link";
import { Tool } from "@/types/tool";
import { ArrowRight } from "lucide-react";

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group relative flex flex-col h-full bg-card border border-border hover:border-primary/50 hover:shadow-sm hover:shadow-primary/5 rounded-2xl p-5 transition-all duration-300 ease-out outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors text-base tracking-tight">
          {tool.title}
        </h3>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 flex-grow mb-4">
        {tool.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-2">
        <div className="flex gap-2">
          {tool.featured && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-medium uppercase tracking-wider">
              Featured
            </span>
          )}
        </div>
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted/50 text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm">
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </Link>
  );
}
