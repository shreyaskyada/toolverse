"use client";

import { useState } from "react";
import { Tool } from "@/types/tool";
import ToolCard from "@/components/tools/ToolCard";
import { Search } from "lucide-react";

interface Props {
  tools: Tool[];
}

export default function CategoryToolsGrid({ tools }: Props) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTools = tools.filter(
    (tool) =>
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 text-muted-foreground">
          <h2 className="text-xl font-bold text-foreground">
            Tools in this category
          </h2>
          <span className="text-sm">({tools.length})</span>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search in category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
      </div>

      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center border border-dashed border-border/60 rounded-3xl bg-muted/10 text-muted-foreground">
          <p>No tools found matching "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
}
