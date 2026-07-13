// frontend/lib/content/adapters.ts
// The ONLY files that import backend-specific types (Reel, SearchResult, Job).
// Every UI component above this layer consumes Content only.

import type { Reel, SearchResult, Job } from "@/lib/api";
import type { Content, ContentSource, ContentStatus, ContentType } from "./types";
import { detectSourceFromUrl, buildInstagramLabel } from "./helpers";

// ─── Content Type Inference ───────────────────────────────────────────────────

function inferContentType(source: ContentSource, duration: number | null): ContentType {
  switch (source) {
    case "instagram": return "short_video";
    case "youtube":   return (duration !== null && duration > 180) ? "long_video" : "short_video";
    case "pdf":       return "document";
    case "image":     return "image";
    case "voice":     return "audio";
    case "article":   return "article";
    case "github":    return "repository";
    default:          return "unknown";
  }
}

// ─── Reel → Content ──────────────────────────────────────────────────────────

export function mapReelToContent(reel: Reel): Content {
  const source = detectSourceFromUrl(reel.original_url);
  const sourceLabel =
    source === "instagram"
      ? buildInstagramLabel(reel.original_url)
      : source;

  const title =
    reel.instagram_caption?.trim().split("\n")[0] || "";

  const topics = Array.isArray(reel.hashtags) ? reel.hashtags : [];
  const duration = reel.duration ?? null;

  return {
    id: reel.id,
    title,
    source,
    contentType: inferContentType(source, duration),
    sourceUrl: reel.original_url,
    sourceLabel,
    thumbnail: reel.thumbnail_url ?? null,
    summary: reel.visual_captions_preview || reel.instagram_caption || "",
    transcript: reel.transcript_preview || "",
    ocrText: reel.ocr_text_preview || "",
    topics,
    createdAt: reel.timestamp || new Date().toISOString(),
    duration,
    status: "indexed",
    knowledgeScore: 100, // Phase 4: Gemma will compute Importance × Completeness × Connections × Freshness
    metadata: {
      video_filename: reel.video_filename,
      video_path: reel.video_path,
      audio_path: reel.audio_path,
      transcript_path: reel.transcript_path,
      video_exists: reel.video_exists,
      audio_exists: reel.audio_exists,
      transcript_exists: reel.transcript_exists,
      ocr_success: reel.ocr_success,
      ocr_exists: reel.ocr_exists,
      visual_caption_count: reel.visual_caption_count,
      has_visual_understanding: reel.has_visual_understanding,
      has_caption: reel.has_caption,
      caption_length: reel.caption_length,
      instagram_caption: reel.instagram_caption,
    },
  };
}

// ─── SearchResult → Content ───────────────────────────────────────────────────

export function mapSearchResultToContent(result: SearchResult): Content {
  const source = detectSourceFromUrl(result.original_url);
  const sourceLabel =
    source === "instagram"
      ? buildInstagramLabel(result.original_url)
      : source;

  const title =
    result.instagram_caption_preview?.trim().split("\n")[0] || "";

  const topics = Array.isArray(result.hashtags) ? result.hashtags : [];

  return {
    id: result.id,
    title,
    source,
    contentType: inferContentType(source, null),
    sourceUrl: result.original_url,
    sourceLabel,
    thumbnail: null,
    summary: result.llm_reason || result.instagram_caption_preview || result.transcript_preview || "",
    transcript: result.transcript_preview || "",
    ocrText: result.ocr_text_preview || "",
    topics,
    createdAt: new Date().toISOString(),
    duration: null,
    status: "indexed",
    knowledgeScore: 100,
    metadata: {
      similarity_score: result.similarity_score,
      text_score: result.text_score,
      clip_score: result.clip_score,
      has_clip_match: result.has_clip_match,
      video_filename: result.video_filename,
      video_path: result.video_path,
      transcript_length: result.transcript_length,
      ocr_success: result.ocr_success,
      visual_caption_count: result.visual_caption_count,
      has_visual_understanding: result.has_visual_understanding,
      relevance_label: result.relevance_label,
      reranked_position: result.reranked_position,
    },
  };
}

// ─── Job → Content ───────────────────────────────────────────────────────────

function mapJobStatus(job: Job): ContentStatus {
  switch (job.status?.toLowerCase()) {
    case "queued":    return "queued";
    case "running":
    case "processing": return "processing";
    case "embedding": return "embedding";
    case "done":
    case "completed":  return "indexed";
    case "failed":
    case "error":      return "failed";
    default:           return "processing";
  }
}

export function mapJobToContent(job: Job): Content {
  const url = job.url || "";
  const source = detectSourceFromUrl(url);
  const sourceLabel =
    source === "instagram" ? buildInstagramLabel(url) : url || "unknown";

  return {
    id: job.job_id,
    title: url ? `Importing from ${sourceLabel}` : `Job ${job.job_id.substring(0, 8)}`,
    source,
    contentType: inferContentType(source, null),
    sourceUrl: url,
    sourceLabel,
    thumbnail: null,
    summary: job.stage ? `Stage: ${job.stage}` : "",
    transcript: "",
    ocrText: "",
    topics: [],
    createdAt: job.created_at || new Date().toISOString(),
    duration: null,
    status: mapJobStatus(job),
    knowledgeScore: 0, // Not scored until fully indexed
    metadata: {
      job_id: job.job_id,
      stage: job.stage,
      progress: job.progress,
      error: job.error,
      queue_position: job.queue_position,
    },
  };
}
