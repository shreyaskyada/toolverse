export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon component name as a string reference
}

export const categories: Category[] = [
  {
    id: "developer-tools",
    name: "Developer Tools",
    description: "Formatters, generators, converters, and other developer utilities.",
    icon: "Code",
  },
  {
    id: "text-content",
    name: "Text & Content",
    description: "Utilities to manipulate, analyze, and format text data.",
    icon: "FileText",
  },
  {
    id: "image-tools",
    name: "Image Tools",
    description: "Compress, resize, and convert image formats client-side instantly.",
    icon: "Image",
  },
  {
    id: "design-color",
    name: "Design & Color",
    description: "Color converters, generators, and styling tools.",
    icon: "Palette",
  },
  {
    id: "math-calc",
    name: "Math & Calculation",
    description: "Calculators and mathematical utility tools.",
    icon: "Calculator",
  },
  {
    id: "security-tools",
    name: "Security Tools",
    description: "Password generators and other security utilities.",
    icon: "Shield",
  },
  {
    id: "utility-tools",
    name: "Utility Tools",
    description: "Handy generators and conversion utilities for everyday tasks.",
    icon: "Wrench",
  },
];

export interface CategoryTheme {
  color: string;
  bgGlow: string;
  iconBg: string;
  iconColor: string;
  borderHover: string;
  accentColor: string;
}

export const categoryThemes: Record<string, CategoryTheme> = {
  "developer-tools": {
    color: "from-blue-500 to-cyan-500",
    bgGlow: "group-hover:shadow-[0_0_30px_rgba(59,130,246,0.08)] hover:border-blue-500/30",
    iconBg: "bg-blue-500/10 dark:bg-blue-500/15 group-hover:bg-blue-500/20",
    iconColor: "text-blue-500",
    borderHover: "group-hover:border-blue-500/30",
    accentColor: "blue"
  },
  "text-content": {
    color: "from-violet-500 to-purple-500",
    bgGlow: "group-hover:shadow-[0_0_30px_rgba(139,92,246,0.08)] hover:border-violet-500/30",
    iconBg: "bg-violet-500/10 dark:bg-violet-500/15 group-hover:bg-violet-500/20",
    iconColor: "text-violet-500",
    borderHover: "group-hover:border-violet-500/30",
    accentColor: "violet"
  },
  "image-tools": {
    color: "from-emerald-500 to-teal-500",
    bgGlow: "group-hover:shadow-[0_0_30px_rgba(16,185,129,0.08)] hover:border-emerald-500/30",
    iconBg: "bg-emerald-500/10 dark:bg-emerald-500/15 group-hover:bg-emerald-500/20",
    iconColor: "text-emerald-500",
    borderHover: "group-hover:border-emerald-500/30",
    accentColor: "emerald"
  },
  "design-color": {
    color: "from-pink-500 to-rose-500",
    bgGlow: "group-hover:shadow-[0_0_30px_rgba(244,63,94,0.08)] hover:border-pink-500/30",
    iconBg: "bg-pink-500/10 dark:bg-pink-500/15 group-hover:bg-pink-500/20",
    iconColor: "text-pink-500",
    borderHover: "group-hover:border-pink-500/30",
    accentColor: "pink"
  },
  "math-calc": {
    color: "from-amber-500 to-orange-500",
    bgGlow: "group-hover:shadow-[0_0_30px_rgba(245,158,11,0.08)] hover:border-amber-500/30",
    iconBg: "bg-amber-500/10 dark:bg-amber-500/15 group-hover:bg-amber-500/20",
    iconColor: "text-amber-500",
    borderHover: "group-hover:border-amber-500/30",
    accentColor: "amber"
  },
  "security-tools": {
    color: "from-red-500 to-rose-600",
    bgGlow: "group-hover:shadow-[0_0_30px_rgba(239,68,68,0.08)] hover:border-red-500/30",
    iconBg: "bg-red-500/10 dark:bg-red-500/15 group-hover:bg-red-500/20",
    iconColor: "text-red-500",
    borderHover: "group-hover:border-red-500/30",
    accentColor: "red"
  },
  "utility-tools": {
    color: "from-teal-500 to-indigo-500",
    bgGlow: "group-hover:shadow-[0_0_30px_rgba(20,184,166,0.08)] hover:border-teal-500/30",
    iconBg: "bg-teal-500/10 dark:bg-teal-500/15 group-hover:bg-teal-500/20",
    iconColor: "text-teal-500",
    borderHover: "group-hover:border-teal-500/30",
    accentColor: "teal"
  }
};

