"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { categories } from "@/config/categories";
import { tools } from "@/config/tools";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";

export default function Subheader() {
  const pathname = usePathname();

  // Do not show on home page
  if (pathname === "/") return null;

  const pathParts = pathname.split("/").filter(Boolean);
  
  const breadcrumbs: { label: string; href: string }[] = [];
  
  if (pathParts[0] === "categories") {
    breadcrumbs.push({ label: "Categories", href: "/categories" });
  } else if (pathParts[0] === "category" && pathParts[1]) {
    const catSlug = pathParts[1];
    const cat = categories.find(c => c.id === catSlug);
    breadcrumbs.push({ label: cat ? cat.name : "Category", href: `/category/${catSlug}` });
  } else if (pathParts[0] === "tools" && pathParts[1]) {
    const toolSlug = pathParts[1];
    const tool = tools.find(t => t.slug === toolSlug);
    if (tool) {
      const cat = categories.find(c => c.id === tool.category);
      if (cat) {
        breadcrumbs.push({ label: cat.name, href: `/category/${cat.id}` });
      }
      breadcrumbs.push({ label: tool.title, href: `/tools/${tool.slug}` });
    }
  }

  return (
    <div className="w-full border-b border-border bg-card/50 backdrop-blur-md sticky top-16 z-40 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/" className="flex items-center gap-1.5"><Home className="h-3.5 w-3.5" /> Home</Link>} />
            </BreadcrumbItem>
            
            {breadcrumbs.map((crumb, idx) => (
              <div key={crumb.href} className="flex items-center gap-2">
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {idx === breadcrumbs.length - 1 ? (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink render={<Link href={crumb.href} />}>
                      {crumb.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
}
