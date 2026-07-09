import Link from "next/link";
import { Category } from "@/config/categories";
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

  return (
    <Link
      href={`/category/${category.id}`}
      className="group flex flex-col h-full bg-card/50 border border-border/60 hover:bg-card hover:border-primary/50 rounded-2xl p-5 transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-sm hover:shadow-md"
    >
      <div className="flex items-center gap-4 mb-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
          <IconComponent className="h-6 w-6" />
        </span>
        <div>
          <h3 className="font-semibold text-foreground text-lg tracking-tight group-hover:text-primary transition-colors">
            {category.name}
          </h3>
          <p className="text-sm font-medium text-muted-foreground">
            {toolCount} {toolCount === 1 ? "tool" : "tools"}
          </p>
        </div>
      </div>
      <p className="text-sm text-muted-foreground/80 leading-relaxed mt-2 line-clamp-2">
        {category.description}
      </p>
    </Link>
  );
}
