// frontend/lib/content/constants.ts
// Per-source display configuration.
// Import SOURCE_CONFIG[source] to get icon, color, and label for any ContentSource.

import type { ContentSource, ContentStatus } from "./types";

// ─── Source Badge Config ──────────────────────────────────────────────────────

export interface SourceConfig {
  label: string;
  /** Lucide icon name — imported by SourceBadge component */
  icon: string;
  /** Tailwind text color class */
  color: string;
  /** Tailwind bg color class (transparent tint) */
  bg: string;
  /** Tailwind border color class */
  border: string;
  /** Whether this source is currently active/available */
  active: boolean;
}

export const SOURCE_CONFIG: Record<ContentSource, SourceConfig> = {
  instagram: {
    label: "Instagram",
    icon: "Camera",
    color: "text-rose-400",
    bg: "bg-rose-400/10",
    border: "border-rose-400/25",
    active: true,
  },
  youtube: {
    label: "YouTube",
    icon: "PlayCircle",
    color: "text-red-500",
    bg: "bg-red-500/10",
    border: "border-red-500/25",
    active: false,
  },
  pdf: {
    label: "PDF",
    icon: "FileText",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/25",
    active: false,
  },
  image: {
    label: "Image",
    icon: "ImageIcon",
    color: "text-sky-400",
    bg: "bg-sky-400/10",
    border: "border-sky-400/25",
    active: false,
  },
  voice: {
    label: "Voice",
    icon: "Mic",
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
    border: "border-cyan-400/25",
    active: false,
  },
  article: {
    label: "Article",
    icon: "BookOpen",
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    border: "border-violet-400/25",
    active: false,
  },
  github: {
    label: "GitHub",
    icon: "Code2",
    color: "text-slate-400",
    bg: "bg-slate-400/10",
    border: "border-slate-400/25",
    active: false,
  },
  unknown: {
    label: "Unknown",
    icon: "HelpCircle",
    color: "text-white/40",
    bg: "bg-white/5",
    border: "border-white/10",
    active: false,
  },
};

// ─── Status Badge Config ──────────────────────────────────────────────────────

export interface StatusConfig {
  label: string;
  color: string;
  bg: string;
  border: string;
  dotColor: string;
}

export const STATUS_CONFIG: Record<ContentStatus, StatusConfig> = {
  queued: {
    label: "Queued",
    color: "text-blue-300",
    bg: "bg-blue-400/10",
    border: "border-blue-400/25",
    dotColor: "bg-blue-400",
  },
  processing: {
    label: "Processing",
    color: "text-amber-300",
    bg: "bg-amber-400/10",
    border: "border-amber-400/25",
    dotColor: "bg-amber-400",
  },
  embedding: {
    label: "Embedding",
    color: "text-violet-300",
    bg: "bg-violet-400/10",
    border: "border-violet-400/25",
    dotColor: "bg-violet-400",
  },
  indexed: {
    label: "Indexed",
    color: "text-emerald-300",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/25",
    dotColor: "bg-emerald-400",
  },
  failed: {
    label: "Failed",
    color: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/25",
    dotColor: "bg-red-400",
  },
};

// ─── Filter Sources (ordered for the source filter bar) ─────────────────────

export const FILTER_SOURCES: ContentSource[] = [
  "instagram",
  "youtube",
  "pdf",
  "voice",
  "github",
  "image",
  "article",
];
