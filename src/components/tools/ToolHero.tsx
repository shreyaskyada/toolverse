import { Badge } from "@/components/ui/badge";

interface ToolHeroProps {
  title: string;
  description: string;
  categoryName: string;
  categorySlug: string;
}

export default function ToolHero({
  title,
  description,
  categoryName,
  categorySlug,
}: ToolHeroProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-border pb-8">


      {/* Header Info */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="capitalize">
            {categoryName}
          </Badge>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent">
          {title}
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
