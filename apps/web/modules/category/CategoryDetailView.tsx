import { notFound } from "next/navigation";
import { categories, categoryThemes } from "@/config/categories";
import { tools } from "@/config/tools";
import Container from "@/components/layout/Container";
import CategoryToolsGrid from "./components/CategoryToolsGrid";
import { Code, FileText, Palette, Calculator, Shield, Wrench, Image as ImageIcon, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CategoryDetailViewProps {
  slug: string;
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

export default function CategoryDetailView({ slug }: CategoryDetailViewProps) {
  const category = categories.find((c) => c.id === slug);

  if (!category) {
    notFound();
  }

  const categoryTools = tools.filter((t) => t.category === slug);
  const IconComponent = iconMap[category.icon] || Code;
  const theme = categoryThemes[slug] || {
    color: "from-primary to-primary/80",
    bgGlow: "",
    iconBg: "bg-primary/10 text-primary",
    iconColor: "text-primary",
    borderHover: "",
    accentColor: "slate",
  };

  return (
    <div className="relative overflow-hidden flex-grow flex flex-col">
      {/* Background Radial Glow Effect */}
      <div className={cn(
        "absolute -top-40 -left-40 w-96 h-96 rounded-full blur-[120px] pointer-events-none opacity-20 dark:opacity-30 bg-gradient-to-r",
        theme.color
      )} />

      <Container className="py-8 flex-grow relative z-10">
        <div className="flex flex-col gap-10 w-full">
          {/* Back Button */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
              Back to Categories
            </Link>
          </div>

          {/* Hero Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-5">
              <span className={cn(
                "flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300 shadow-sm",
                theme.iconBg,
                theme.iconColor
              )}>
                <IconComponent className="h-8 w-8" />
              </span>
              <div>
                <h1 className={cn(
                  "text-3xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r leading-tight",
                  theme.color
                )}>
                  {category.name}
                </h1>
                <p className="text-base md:text-lg text-muted-foreground/80 mt-1 max-w-2xl leading-relaxed">
                  {category.description}
                </p>
              </div>
            </div>
          </div>

          {/* Tools Grid with Search */}
          <CategoryToolsGrid tools={categoryTools} categorySlug={slug} />
        </div>
      </Container>
    </div>
  );
}
