"use client";

// components/badges/SourceBadge.tsx
// Per-source icon + colour badge.
// Icon names map to Lucide components imported explicitly to keep bundle small.

import {
  Camera, PlayCircle, FileText, ImageIcon, Mic, BookOpen, Code2, HelpCircle,
} from "lucide-react";
import { SOURCE_CONFIG } from "@/lib/content/constants";
import type { ContentSource } from "@/lib/content/types";

const ICONS: Record<ContentSource, React.ElementType> = {
  instagram: Camera,
  youtube:   PlayCircle,
  pdf:       FileText,
  image:     ImageIcon,
  voice:     Mic,
  article:   BookOpen,
  github:    Code2,
  unknown:   HelpCircle,
};

interface SourceBadgeProps {
  source: ContentSource;
  /** "full" shows icon + label; "icon" shows icon only */
  variant?: "full" | "icon";
  className?: string;
}

export default function SourceBadge({
  source,
  variant = "full",
  className = "",
}: SourceBadgeProps) {
  const cfg = SOURCE_CONFIG[source];
  const Icon = ICONS[source];

  if (variant === "icon") {
    return (
      <span
        className={`inline-flex h-6 w-6 items-center justify-center rounded-lg ${cfg.bg} ${cfg.border} border ${className}`}
        title={cfg.label}
        aria-label={cfg.label}
      >
        <Icon className={`h-3 w-3 ${cfg.color}`} strokeWidth={2} />
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${cfg.color} ${cfg.bg} ${cfg.border} ${className}`}
    >
      <Icon className="h-3 w-3" strokeWidth={2} />
      {cfg.label}
    </span>
  );
}
