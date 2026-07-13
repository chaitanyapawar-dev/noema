"use client";

// components/content/KnowledgeDrawer.tsx
// Global right-side slide-in drawer for knowledge item details.
// Tabs: Overview | Transcript | Extracted Text | AI Analysis | Metadata.
// Mounted once in platform layout.tsx, controlled by ContentContext.

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X, ExternalLink,
  Mic, ScanText, Brain, Info,
  Sparkles, Eye, FileText, Tag, Hash, BookOpen, Clock,
} from "lucide-react";
import { useContent } from "@/components/contexts/ContentContext";
import SourceBadge from "@/components/badges/SourceBadge";
import StatusBadge from "@/components/badges/StatusBadge";
import TopicBadge from "@/components/badges/TopicBadge";
import ContentThumbnail from "./ContentThumbnail";
import { getContentTitle, getSourceLabel } from "@/lib/content/helpers";
import { API_BASE } from "@/lib/api";

type Tab = "overview" | "transcript" | "ocr" | "ai" | "metadata";

// ─── Derived AI Metadata ──────────────────────────────────────────────────────
// Computed from existing fields. Phase 4: Gemma replaces these heuristics.

function deriveKeywords(content: { transcript: string; ocrText: string; topics: string[] }): string[] {
  // Merge topics with first words from transcript — simple frequency proxy
  const fromTopics = content.topics.slice(0, 5);
  const words = content.transcript
    .split(/\s+/)
    .map((w) => w.replace(/[^a-zA-Z]/g, "").toLowerCase())
    .filter((w) => w.length > 5);
  const freq: Record<string, number> = {};
  words.forEach((w) => { freq[w] = (freq[w] || 0) + 1; });
  const topWords = Object.entries(freq)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([w]) => w);
  return Array.from(new Set([...fromTopics, ...topWords])).slice(0, 8);
}

function deriveReadingTime(transcript: string, ocrText: string): string {
  const wordCount = (transcript + " " + ocrText).split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(wordCount / 200)); // avg reading speed
  return `~${minutes} min`;
}

function deriveDifficulty(topics: string[], transcriptLen: number): { label: string; color: string } {
  const techTerms = ["machine learning", "neural", "algorithm", "architecture", "api", "inference", "embedding", "vector", "gradient", "optimization"];
  const techCount = topics.filter((t) =>
    techTerms.some((term) => t.toLowerCase().includes(term))
  ).length;
  const lengthFactor = transcriptLen > 1000 ? 1 : 0;
  const score = techCount + lengthFactor;
  if (score >= 2) return { label: "Advanced", color: "text-rose-400" };
  if (score === 1) return { label: "Intermediate", color: "text-amber-400" };
  return { label: "Beginner", color: "text-emerald-400" };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function KnowledgeDrawer() {
  const { selectedContent, isDrawerOpen, closeDrawer } = useContent();
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    if (isDrawerOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  // Reset tab when content changes
  useEffect(() => {
    if (selectedContent) setActiveTab("overview");
  }, [selectedContent?.id]);

  if (!selectedContent) return null;

  const title = getContentTitle(selectedContent);
  const metadata = selectedContent.metadata || {};

  // OCR lines
  const ocrLines = selectedContent.ocrText
    ? selectedContent.ocrText.split("\n").map((l) => l.trim()).filter(Boolean)
    : [];

  // Pipeline signals
  const hasAudio = !!selectedContent.transcript;
  const hasVision = !!metadata.has_visual_understanding;
  const hasOcr = !!selectedContent.ocrText || !!metadata.ocr_success;
  const hasCaption = !!metadata.has_caption || !!selectedContent.title;

  // AI metadata (heuristic — Phase 4: Gemma)
  const keywords = deriveKeywords(selectedContent);
  const readingTime = deriveReadingTime(selectedContent.transcript, selectedContent.ocrText);
  const difficulty = deriveDifficulty(selectedContent.topics, selectedContent.transcript.length);
  const knowledgeScore = selectedContent.knowledgeScore ?? 100;

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Mobile backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm xl:hidden"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 230 }}
            className="fixed right-0 top-0 bottom-0 z-50 flex flex-col w-full md:max-w-[480px] bg-[#050816]/95 border-l border-white/10 shadow-2xl backdrop-blur-2xl"
            role="dialog"
            aria-modal="true"
            aria-label={`Details: ${title}`}
          >
            {/* Top reflection */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

            {/* ─── Header ───────────────────────────────────────────────────── */}
            <div className="flex items-start justify-between p-5 pb-4 border-b border-white/5">
              <div className="space-y-1.5 min-w-0 pr-4">
                <div className="flex flex-wrap items-center gap-2">
                  <SourceBadge source={selectedContent.source} />
                  <StatusBadge status={selectedContent.status} />
                  {/* Knowledge Score badge */}
                  <span
                    className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold"
                    style={{
                      color: "rgba(52,211,113,0.9)",
                      background: "rgba(52,211,113,0.08)",
                      borderColor: "rgba(52,211,113,0.2)",
                    }}
                    title="Knowledge Score (Phase 4: Gemma-computed)"
                  >
                    <Sparkles className="h-2.5 w-2.5" />
                    {knowledgeScore}
                  </span>
                </div>
                <h2 className="text-base font-bold text-white leading-snug line-clamp-2" title={title}>
                  {title}
                </h2>
                <p className="text-xs text-white/40">{getSourceLabel(selectedContent)}</p>
              </div>
              <button
                onClick={closeDrawer}
                className="h-8 w-8 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 border border-white/10 transition-all shrink-0"
                aria-label="Close details"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* ─── Tabs ─────────────────────────────────────────────────────── */}
            <div className="flex border-b border-white/5 px-2 bg-white/[0.01]">
              {([
                { id: "overview",    label: "Overview",       icon: Info },
                { id: "transcript",  label: "Transcript",     icon: Mic },
                { id: "ocr",         label: "Extracted Text", icon: ScanText },
                { id: "ai",          label: "AI Analysis",    icon: Brain },
                { id: "metadata",    label: "Metadata",       icon: FileText },
              ] as const).map((t) => {
                const Icon = t.icon;
                const active = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-medium transition-all relative ${
                      active ? "text-[#5B8CFF]" : "text-white/40 hover:text-white/60"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{t.label}</span>
                    {active && (
                      <motion.div
                        layoutId="knowledge-drawer-tab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5B8CFF]"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* ─── Body ─────────────────────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-none">

              {/* Tab: Overview */}
              {activeTab === "overview" && (
                <div className="space-y-5 animate-fade-in">
                  {/* Media */}
                  <div className="rounded-xl overflow-hidden aspect-video border border-white/10 relative bg-black">
                    {selectedContent.source === "instagram" && metadata.video_exists ? (
                      <video
                        src={`${API_BASE}/downloads/${metadata.video_filename}`}
                        controls
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <ContentThumbnail
                        id={selectedContent.id}
                        source={selectedContent.source}
                        thumbnailUrl={selectedContent.thumbnail}
                        height="h-full"
                        className="aspect-video"
                      />
                    )}
                  </div>

                  {/* Summary */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider">Summary</h3>
                    <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
                      {selectedContent.summary || "No description or summary available."}
                    </p>
                  </div>

                  {/* Topics */}
                  {selectedContent.topics.length > 0 && (
                    <div className="space-y-2.5">
                      <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider">Topics</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedContent.topics.map((topic, i) => (
                          <TopicBadge key={topic} topic={topic} intensity={0.08 + i * 0.02} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab: Transcript */}
              {activeTab === "transcript" && (
                <div className="space-y-3 animate-fade-in">
                  <div className="flex items-center gap-1.5 text-xs text-white/50 uppercase tracking-wider">
                    <Mic className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Whisper Audio Transcript</span>
                  </div>
                  <div className="rounded-xl p-4 bg-white/[0.02] border border-white/5 text-sm text-white/75 leading-relaxed font-mono whitespace-pre-wrap max-h-[320px] overflow-y-auto scrollbar-none">
                    {selectedContent.transcript || "No transcription data extracted."}
                  </div>
                </div>
              )}

              {/* Tab: Extracted Text (OCR) */}
              {activeTab === "ocr" && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center gap-1.5 text-xs text-white/50 uppercase tracking-wider">
                    <ScanText className="h-3.5 w-3.5 text-violet-300" />
                    <span>OCR Overlay Extracted Text</span>
                  </div>
                  <div className="space-y-2 max-h-[320px] overflow-y-auto scrollbar-none">
                    {ocrLines.length > 0 ? (
                      ocrLines.map((line, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 p-2.5 rounded-xl border"
                          style={{
                            background: "rgba(123, 97, 255, 0.05)",
                            borderColor: "rgba(123, 97, 255, 0.15)",
                          }}
                        >
                          <span className="text-[9px] font-bold text-violet-400 tracking-wider shrink-0 mt-0.5">T{i + 1}</span>
                          <span className="text-xs text-white/80 leading-snug">{line}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-white/30 italic py-4 text-center">
                        No text overlays detected in this content.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab: AI Analysis */}
              {activeTab === "ai" && (
                <div className="space-y-6 animate-fade-in">

                  {/* Quick Metrics Row */}
                  <div className="grid grid-cols-3 gap-2">
                    {/* Reading Time */}
                    <div className="rounded-xl p-3 text-center space-y-1 bg-white/[0.03] border border-white/6">
                      <Clock className="h-4 w-4 text-cyan-400 mx-auto" />
                      <p className="text-xs font-bold text-white/80">{readingTime}</p>
                      <p className="text-[10px] text-white/35">Read Time</p>
                    </div>
                    {/* Difficulty */}
                    <div className="rounded-xl p-3 text-center space-y-1 bg-white/[0.03] border border-white/6">
                      <BookOpen className={`h-4 w-4 mx-auto ${difficulty.color}`} />
                      <p className={`text-xs font-bold ${difficulty.color}`}>{difficulty.label}</p>
                      <p className="text-[10px] text-white/35">Difficulty</p>
                    </div>
                    {/* Knowledge Score */}
                    <div className="rounded-xl p-3 text-center space-y-1 bg-white/[0.03] border border-white/6">
                      <Sparkles className="h-4 w-4 text-emerald-400 mx-auto" />
                      <p className="text-xs font-bold text-emerald-400">{knowledgeScore}/100</p>
                      <p className="text-[10px] text-white/35">KS Score</p>
                    </div>
                  </div>

                  {/* Keywords */}
                  {keywords.length > 0 && (
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-1.5 text-xs text-white/50 uppercase tracking-wider">
                        <Hash className="h-3.5 w-3.5 text-[#5B8CFF]" />
                        <span>Extracted Keywords</span>
                        <span className="text-[9px] text-white/20 normal-case tracking-normal font-normal">· heuristic · Phase 4: Gemma</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {keywords.map((kw) => (
                          <span
                            key={kw}
                            className="text-[11px] px-2.5 py-1 rounded-lg font-medium text-[#5B8CFF]/80"
                            style={{ background: "rgba(91,140,255,0.08)", border: "1px solid rgba(91,140,255,0.18)" }}
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Entities (from topics for now) */}
                  {selectedContent.topics.length > 0 && (
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-1.5 text-xs text-white/50 uppercase tracking-wider">
                        <Tag className="h-3.5 w-3.5 text-violet-400" />
                        <span>Entities &amp; Concepts</span>
                        <span className="text-[9px] text-white/20 normal-case tracking-normal font-normal">· from hashtags · Phase 4: NER</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedContent.topics.map((t, i) => (
                          <TopicBadge key={t} topic={t} intensity={0.07 + i * 0.015} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pipeline Signal Integrity */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider">Pipeline Signal Integrity</h3>
                    {[
                      { label: "Audio (Whisper)", value: hasAudio ? 0.98 : 0, color: "from-cyan-500 to-blue-500" },
                      { label: "Vision (CLIP)", value: hasVision ? 0.92 : 0, color: "from-emerald-500 to-teal-500" },
                      { label: "OCR Overlay", value: hasOcr ? 0.85 : 0, color: "from-violet-500 to-purple-500" },
                      { label: "Metadata & Tags", value: hasCaption ? 0.90 : 0, color: "from-rose-500 to-pink-500" },
                    ].map((sig) => (
                      <div key={sig.label} className="space-y-1.5">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-white/45">{sig.label}</span>
                          <span className="text-white/70 font-semibold">{Math.round(sig.value * 100)}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full bg-gradient-to-r ${sig.color}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${sig.value * 100}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Gemma Deep Analysis Placeholder */}
                  <div className="rounded-xl p-4 bg-gradient-to-r from-violet-500/5 to-[#5B8CFF]/5 border border-violet-500/10 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs text-violet-300 font-semibold uppercase tracking-wider">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Advanced Gemma Insights</span>
                    </div>
                    <p className="text-xs text-white/40 leading-relaxed">
                      Deep entity extraction, knowledge graph connections, semantic summaries, and cross-source relationships arrive in Phase 4.
                    </p>
                  </div>
                </div>
              )}

              {/* Tab: Metadata */}
              {activeTab === "metadata" && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider">File & Source Metadata</h3>
                  <div className="rounded-xl border border-white/5 overflow-hidden text-xs">
                    {[
                      { label: "Content ID",     value: selectedContent.id },
                      { label: "Source",         value: selectedContent.source.toUpperCase() },
                      { label: "Content Type",   value: selectedContent.contentType },
                      { label: "Created At",     value: selectedContent.createdAt },
                      { label: "Duration",       value: selectedContent.duration ? `${selectedContent.duration}s` : "Unknown" },
                      { label: "Filename",       value: (metadata.video_filename as string) || "N/A" },
                      { label: "Stored Locally", value: metadata.video_exists ? "Yes" : "No" },
                      { label: "Knowledge Score",value: `${knowledgeScore}/100` },
                    ].map((row, i) => (
                      <div
                        key={row.label}
                        className={`flex justify-between p-3 ${i % 2 === 0 ? "bg-white/[0.02]" : "bg-transparent"} border-b border-white/[0.04] last:border-0`}
                      >
                        <span className="text-white/40">{row.label}</span>
                        <span className="text-white/70 font-mono select-all truncate max-w-[200px]" title={row.value}>
                          {row.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Content — always visible below tabs */}
              <div className="border-t border-white/5 pt-5 space-y-3">
                <div className="flex items-center gap-1.5 text-xs text-white/50 uppercase tracking-wider">
                  <Eye className="h-3.5 w-3.5 text-cyan-300" />
                  <span>Related Content</span>
                </div>
                <div className="rounded-xl p-4 bg-white/[0.01] border border-white/5 text-center">
                  <p className="text-xs font-semibold text-white/60">Coming in Phase 4</p>
                  <p className="text-[11px] text-white/35 mt-1">
                    We're building a semantic similarity graph to surface connected knowledge.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            {selectedContent.sourceUrl && (
              <div className="p-4 border-t border-white/5 bg-[#050816] flex justify-end">
                <a
                  href={selectedContent.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#5B8CFF] hover:text-[#5B8CFF]/80 font-medium transition-colors"
                >
                  <span>Open Original Source</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
