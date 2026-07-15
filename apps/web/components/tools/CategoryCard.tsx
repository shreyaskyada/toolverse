import Link from "next/link";
import { Category, categoryThemes } from "@/config/categories";
import { Code, FileText, Palette, Calculator, Shield, Wrench, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  category: Category;
  toolCount: number;
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

export default function CategoryCard({ category, toolCount }: CategoryCardProps) {
  const IconComponent = iconMap[category.icon] || Code;
  const theme = categoryThemes[category.id] || {
    color: "from-primary to-primary/80",
    bgGlow: "group-hover:shadow-[0_0_20px_rgba(0,0,0,0.05)] hover:border-primary/30",
    iconBg: "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary",
    iconColor: "text-muted-foreground",
    borderHover: "group-hover:border-primary/30",
    accentColor: "slate",
  };

  return (
    <Link
      href={`/category/${category.id}`}
      className={cn(
        "group flex flex-col h-full bg-card/45 backdrop-blur-xs border border-border/50",
        "rounded-2xl p-6 transition-all duration-300 ease-out outline-none",
        "focus-visible:ring-2 focus-visible:ring-primary shadow-sm hover:-translate-y-0.5",
        theme.bgGlow
      )}
    >
      <div className="flex items-center gap-4 mb-4">
        <span className={cn(
          "flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300",
          theme.iconBg,
          theme.iconColor
        )}>
          <IconComponent className="h-6 w-6" />
        </span>
        <div>
          <h3 className="font-bold text-foreground text-lg tracking-tight group-hover:text-foreground/95 transition-colors">
            {category.name}
          </h3>
          <p className="text-xs font-semibold text-muted-foreground mt-0.5">
            {toolCount} {toolCount === 1 ? "tool" : "tools"}
          </p>
        </div>
      </div>
      <p className="text-sm text-muted-foreground/80 leading-relaxed line-clamp-2">
        {category.description}
      </p>
    </Link>
  );
}

