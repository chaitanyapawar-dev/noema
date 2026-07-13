// frontend/lib/content/types.ts
// Universal Content model — the single type consumed by all UI components.
// Backend-specific types (Reel, SearchResult, Job) are transformed into
// Content via adapter functions in adapters.ts.

// ─── Source ──────────────────────────────────────────────────────────────────
export type ContentSource =
  | "instagram"
  | "youtube"
  | "pdf"
  | "image"
  | "voice"
  | "article"
  | "github"
  | "unknown";

// ─── Content Type ─────────────────────────────────────────────────────────────
// Granular format type within a source.
// e.g. YouTube can be: long_video | short_video (Shorts) | playlist
// Currently unused — populated automatically in Phase 3 extractors.
export type ContentType =
  | "short_video"   // < 3 min — Instagram Reels, YouTube Shorts
  | "long_video"    // > 3 min — YouTube, Lectures
  | "document"      // PDF, DOCX
  | "image"         // Standalone image/screenshot
  | "audio"         // Voice note, podcast
  | "article"       // Blog post, web page
  | "repository"    // GitHub repo
  | "unknown";

// ─── Status ──────────────────────────────────────────────────────────────────
export type ContentStatus =
  | "queued"
  | "processing"
  | "embedding"
  | "indexed"
  | "failed";

// ─── Content ─────────────────────────────────────────────────────────────────
export interface Content {
  /** Stable unique identifier (maps from Reel.id / Job.job_id) */
  id: string;

  /** Human-readable title derived from caption or fallback */
  title: string;

  /** Which platform/source this content originated from */
  source: ContentSource;

  /**
   * Granular format within the source.
   * Currently set to "short_video" for Reels; Phase 3 extractors will populate.
   */
  contentType: ContentType;

  /** Original URL of the source content */
  sourceUrl: string;

  /** Short human-readable source label, e.g. "instagram/ABC123" */
  sourceLabel: string;

  /** Absolute thumbnail URL or null (UI falls back to gradient) */
  thumbnail: string | null;

  /** Best available summary: visual caption → instagram caption → transcript excerpt */
  summary: string;

  /** Full or preview transcript (Whisper output) */
  transcript: string;

  /** OCR extracted text from video frames */
  ocrText: string;

  /**
   * AI topic labels.
   * Currently populated from hashtags; in Phase 4 Gemma generates these.
   */
  topics: string[];

  /** ISO timestamp of when this item was ingested */
  createdAt: string;

  /** Duration in seconds if known */
  duration: number | null;

  /** Current processing/indexing status */
  status: ContentStatus;

  /**
   * Knowledge Score (0–100).
   * Initially 100. Phase 4: Gemma computes from Importance + Completeness + Connections + Freshness.
   * Powers recommendations, timeline ranking, insights, and roadmap generation.
   */
  knowledgeScore: number;

  /**
   * Source-specific metadata preserved for the detail drawer.
   * Keys vary by source; consumers should access defensively.
   */
  metadata: Record<string, unknown>;
}
