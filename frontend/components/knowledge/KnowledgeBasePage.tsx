"use client";

// components/knowledge/KnowledgeBasePage.tsx
// Core container for the redesigned Knowledge Base page.
// Displays title, statistics strip, search bar, source filters, and ContentCards.
// Synchronizes drawer state with the Next.js router for clean deep links (/library/[id]).

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useBackend } from "@/components/app/BackendProvider";
import { useContent } from "@/components/contexts/ContentContext";
import { fetchLibrary } from "@/lib/api";
import { mapReelToContent } from "@/lib/content/adapters";
import type { Content, ContentSource } from "@/lib/content/types";
import { formatDate } from "@/lib/content/helpers";
import ContentHeader from "@/components/content/ContentHeader";
import ContentGrid from "@/components/content/ContentGrid";
import ContentCard from "@/components/content/ContentCard";
import SearchInput from "@/components/shared/SearchInput";
import EmptyState from "@/components/shared/EmptyState";
import LoadingCard from "@/components/shared/LoadingCard";
import { FILTER_SOURCES, SOURCE_CONFIG } from "@/lib/content/constants";
import { AlertCircle, Plus, Sparkles } from "lucide-react";

export default function KnowledgeBasePage() {
  const params = useParams();
  const router = useRouter();
  const { status } = useBackend();
  const { selectedContent, isDrawerOpen, openDrawer } = useContent();

  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"All" | ContentSource>("All");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const id = typeof params?.id === "string" ? params.id : "";

  const loadLibrary = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchLibrary(100);
      if (res.success) {
        const mapped = (res.reels || []).map(mapReelToContent);
        setContents(mapped);
      } else {
        setError("Failed to fetch library.");
      }
    } catch (e: any) {
      setError(e.message || "Failed to load library.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLibrary();
  }, []);

  // 1. Sync URL -> Drawer: Auto-open if id in URL changes and matches a loaded item
  useEffect(() => {
    if (id && contents.length > 0) {
      const match = contents.find((c) => c.id === id);
      if (match) {
        openDrawer(match);
      }
    }
  }, [id, contents, openDrawer]);

  // 2. Sync Drawer -> URL: Update URL when drawer is opened or closed
  useEffect(() => {
    if (isDrawerOpen && selectedContent) {
      if (window.location.pathname.startsWith("/library")) {
        const targetPath = `/library/${selectedContent.id}`;
        if (window.location.pathname !== targetPath) {
          router.push(targetPath);
        }
      }
    } else if (!isDrawerOpen) {
      if (window.location.pathname.startsWith("/library/") && window.location.pathname !== "/library") {
        router.push("/library");
      }
    }
  }, [isDrawerOpen, selectedContent, router]);

  // Show a "Coming Soon" toast message when inactive sources are clicked
  const handleSourceClick = (source: "All" | ContentSource) => {
    if (source === "All" || source === "instagram") {
      setActiveFilter(source);
    } else {
      const label = SOURCE_CONFIG[source]?.label || source;
      setToastMessage(`${label} integration is coming in Phase 3!`);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  // Filter content locally based on active source filter and search text
  const filteredContents = contents.filter((content) => {
    const matchesSource = activeFilter === "All" || content.source === activeFilter;
    
    if (!matchesSource) return false;

    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;

    return (
      content.title.toLowerCase().includes(query) ||
      content.summary.toLowerCase().includes(query) ||
      content.transcript.toLowerCase().includes(query) ||
      content.ocrText.toLowerCase().includes(query) ||
      content.topics.some((topic) => topic.toLowerCase().includes(query))
    );
  });

  // Calculate Last Import Date
  const getLastImportDate = () => {
    if (contents.length === 0) return "N/A";
    const dates = contents.map((c) => new Date(c.createdAt).getTime()).filter((t) => !isNaN(t));
    if (dates.length === 0) return "N/A";
    const latest = Math.max(...dates);
    return formatDate(new Date(latest).toISOString());
  };

  const isOnline = status?.fastapi ?? false;
  const isAiReady = isOnline && !!status.ollama && !!status.chromadb;
  const isSearchEnabled = isOnline && !!status.chromadb;

  return (
    <div className="p-6 space-y-6 relative">
      {/* Ambient background glow */}
      <div
        className="fixed top-0 right-1/4 w-[400px] h-[300px] pointer-events-none -z-10"
        style={{
          background: "radial-gradient(ellipse, rgba(123,97,255,0.06) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* Header section (title + stats) */}
      <ContentHeader
        totalItems={contents.length}
        lastImport={getLastImportDate()}
        isAiReady={isAiReady}
        isSearchEnabled={isSearchEnabled}
        loading={loading}
        onRefresh={loadLibrary}
      />

      {/* Search Input Bar */}
      <div className="w-full">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search topics, transcription, OCR, captions..."
          className="w-full"
        />
      </div>

      {/* Source Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/5 pb-4">
        <span className="text-[10px] uppercase tracking-wider text-white/35 font-semibold mr-2">
          Sources:
        </span>
        <button
          onClick={() => handleSourceClick("All")}
          className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
            activeFilter === "All"
              ? "text-[#5B8CFF] border border-[#5B8CFF]/40 bg-[#5B8CFF]/10 shadow-[0_0_12px_rgba(91,140,255,0.1)]"
              : "text-white/40 hover:text-white/70 border border-white/10 hover:border-white/20 hover:bg-white/[0.04]"
          }`}
        >
          All
        </button>

        {FILTER_SOURCES.map((source) => {
          const cfg = SOURCE_CONFIG[source];
          const isActive = activeFilter === source;
          const isAvailable = source === "instagram";
          
          return (
            <button
              key={source}
              onClick={() => handleSourceClick(source)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                isActive
                  ? `${cfg.color} ${cfg.bg} ${cfg.border} border shadow-[0_0_12px_rgba(255,255,255,0.05)]`
                  : isAvailable
                  ? "text-white/50 hover:text-white/80 border border-white/10 hover:border-white/20 hover:bg-white/[0.04]"
                  : "text-white/20 border border-white/5 cursor-not-allowed hover:bg-white/[0.01]"
              }`}
              title={!isAvailable ? `${cfg.label} integration coming soon` : undefined}
            >
              <span>{cfg.label}</span>
              {!isAvailable && (
                <span className="text-[8px] uppercase tracking-widest bg-white/5 px-1 py-0.5 rounded text-white/40 scale-90">
                  Phase 3
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Coming Soon Toast Message */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-xl px-4 py-2.5 bg-violet-950/80 border border-violet-500/30 backdrop-blur-md shadow-lg text-xs text-violet-200 flex items-center gap-2"
          >
            <Sparkles className="h-3.5 w-3.5 text-violet-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid of Contents */}
      {loading ? (
        <ContentGrid>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <LoadingCard key={i} className="h-[280px]" />
          ))}
        </ContentGrid>
      ) : error ? (
        <div className="glass-panel rounded-2xl p-12 text-center space-y-4 max-w-[600px] mx-auto border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 left-[5%] right-[5%] h-px bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
          <AlertCircle className="h-8 w-8 text-rose-500 mx-auto" />
          <h3 className="text-sm font-semibold text-white/80">Failed to load Knowledge Base</h3>
          <p className="text-xs text-white/40 max-w-sm mx-auto leading-relaxed">{error}</p>
          <button
            onClick={loadLibrary}
            className="inline-flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10 transition-all"
          >
            Retry
          </button>
        </div>
      ) : filteredContents.length === 0 ? (
        <EmptyState
          title={contents.length === 0 ? "Your library is empty" : "No matching items found"}
          description={
            contents.length === 0
              ? "Ingest your first Instagram Reel to generate transcripts, topics, and enable semantic AI search."
              : "No content matched your search query or active source filters."
          }
          cta={
            contents.length === 0
              ? {
                  label: "Import First Content",
                  href: "/processing",
                  icon: Plus,
                }
              : undefined
          }
        />
      ) : (
        <ContentGrid>
          {filteredContents.map((content, i) => (
            <ContentCard key={content.id} content={content} index={i} />
          ))}
        </ContentGrid>
      )}
    </div>
  );
}
