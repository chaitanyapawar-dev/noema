// frontend/lib/content/helpers.ts
// Pure utility functions that operate on Content objects.
// No backend types — import from types.ts only.

import type { Content, ContentSource } from "./types";

// ─── Gradient ────────────────────────────────────────────────────────────────

const GRADIENTS = [
  "linear-gradient(135deg, #0d1230, #1a1b4b)",
  "linear-gradient(135deg, #0d2015, #113825)",
  "linear-gradient(135deg, #2a0d0d, #4a1515)",
  "linear-gradient(135deg, #0d1020, #171b38)",
  "linear-gradient(135deg, #2a1a0d, #422712)",
  "linear-gradient(135deg, #1a0d2a, #2f124d)",
];

/** Deterministic gradient from a content ID (stable across renders) */
export function getContentGradient(id: string): string {
  let sum = 0;
  for (let i = 0; i < id.length; i++) sum += id.charCodeAt(i);
  return GRADIENTS[sum % GRADIENTS.length];
}

// ─── Title ───────────────────────────────────────────────────────────────────

/**
 * Returns the best available display title for a content item.
 * Falls back gracefully: title field → summary excerpt → id-based label.
 */
export function getContentTitle(content: Content, maxLen = 60): string {
  if (content.title) {
    const t = content.title.trim().split("\n")[0];
    return t.length > maxLen ? t.substring(0, maxLen) + "…" : t;
  }
  if (content.summary) {
    const s = content.summary.trim().split("\n")[0];
    return s.length > maxLen ? s.substring(0, maxLen) + "…" : s;
  }
  return `Content #${content.id.substring(0, 6)}`;
}

// ─── Source Label ─────────────────────────────────────────────────────────────

/** Human-friendly source label, e.g. "instagram/ABC123" or "youtube.com" */
export function getSourceLabel(content: Content): string {
  return content.sourceLabel || content.source;
}

// ─── Detect source from URL ───────────────────────────────────────────────────

export function detectSourceFromUrl(url: string): ContentSource {
  try {
    const { hostname } = new URL(url);
    if (hostname.includes("instagram.com")) return "instagram";
    if (hostname.includes("youtube.com") || hostname.includes("youtu.be")) return "youtube";
    if (hostname.includes("github.com")) return "github";
  } catch {
    // not a valid URL — local file
  }
  return "unknown";
}

/** Build a short label from an Instagram URL, e.g. "instagram/ABC123" */
export function buildInstagramLabel(url: string): string {
  try {
    const parts = new URL(url).pathname.split("/");
    const pIdx = parts.indexOf("p");
    const rIdx = parts.indexOf("reel");
    if (pIdx !== -1 && parts[pIdx + 1]) return `instagram/${parts[pIdx + 1]}`;
    if (rIdx !== -1 && parts[rIdx + 1]) return `instagram/${parts[rIdx + 1]}`;
    return "instagram.com";
  } catch {
    return "instagram";
  }
}

// ─── Date Formatting ─────────────────────────────────────────────────────────

/** Returns "2d ago", "1h ago", "just now" etc. */
export function timeAgo(isoString: string): string {
  try {
    const diff = Date.now() - new Date(isoString).getTime();
    const s = Math.floor(diff / 1000);
    if (s < 60) return "just now";
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    return `${d}d ago`;
  } catch {
    return "";
  }
}

/** Format ISO date as "Jul 13, 2026" */
export function formatDate(isoString: string): string {
  try {
    return new Date(isoString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}
