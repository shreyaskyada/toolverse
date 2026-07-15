import { categories } from "@/config/categories";
import { Metadata } from "next";
import CategoryDetailView from "@/modules/category/CategoryDetailView";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = categories.find((c) => c.id === slug);
  if (!category) return {};

  return {
    title: `${category.name} Tools - Toolverse`,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  return <CategoryDetailView slug={slug} />;
}
