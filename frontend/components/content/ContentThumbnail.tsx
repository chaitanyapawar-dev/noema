"use client";

// components/content/ContentThumbnail.tsx
// Gradient fallback thumbnail for content without a real thumbnail URL.

import { Play, FileText, ImageIcon, Mic, BookOpen, Code2, HelpCircle } from "lucide-react";
import { getContentGradient } from "@/lib/content/helpers";
import type { ContentSource } from "@/lib/content/types";

const SOURCE_ICONS: Record<ContentSource, React.ElementType> = {
  instagram: Play,
  youtube:   Play,
  pdf:       FileText,
  image:     ImageIcon,
  voice:     Mic,
  article:   BookOpen,
  github:    Code2,
  unknown:   HelpCircle,
};

interface ContentThumbnailProps {
  id: string;
  source: ContentSource;
  thumbnailUrl?: string | null;
  /** Height class, e.g. "h-36" */
  height?: string;
  className?: string;
}

export default function ContentThumbnail({
  id,
  source,
  thumbnailUrl,
  height = "h-36",
  className = "",
}: ContentThumbnailProps) {
  const Icon = SOURCE_ICONS[source];

  if (thumbnailUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={thumbnailUrl}
        alt="Content thumbnail"
        className={`${height} w-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`${height} w-full flex items-center justify-center relative ${className}`}
      style={{ background: getContentGradient(id) }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      <div
        className="relative z-10 h-9 w-9 rounded-full flex items-center justify-center border border-white/15 group-hover:scale-105 transition-all duration-300"
        style={{ background: "rgba(255,255,255,0.10)" }}
      >
        <Icon className="h-4 w-4 text-white/60" strokeWidth={1.75} />
      </div>
    </div>
  );
}
