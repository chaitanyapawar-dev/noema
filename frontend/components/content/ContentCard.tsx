"use client";

// components/content/ContentCard.tsx
// Rich card component — reusable from Knowledge Base, Dashboard, Search, Collections, etc.
// Calls openDrawer(content) from ContentContext on click. No navigation.

import { motion } from "framer-motion";
import { useContent } from "@/components/contexts/ContentContext";
import ContentThumbnail from "./ContentThumbnail";
import SourceBadge from "@/components/badges/SourceBadge";
import StatusBadge from "@/components/badges/StatusBadge";
import TopicBadge from "@/components/badges/TopicBadge";
import type { Content } from "@/lib/content/types";
import { getContentTitle, timeAgo } from "@/lib/content/helpers";

interface ContentCardProps {
  content: Content;
  index?: number;
}

export default function ContentCard({ content, index = 0 }: ContentCardProps) {
  const { openDrawer } = useContent();
  const title = getContentTitle(content);
  const visibleTopics = content.topics.slice(0, 3);
  const hiddenCount = content.topics.length - visibleTopics.length;

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      className="group rounded-2xl overflow-hidden glass-panel card-hover cursor-pointer relative focus-within:ring-2 focus-within:ring-[#5B8CFF]/40"
      onClick={() => openDrawer(content)}
      role="button"
      tabIndex={0}
      aria-label={`Open ${title}`}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && openDrawer(content)}
    >
      {/* Top sheen */}
      <div className="absolute top-0 left-[5%] right-[5%] h-px bg-gradient-to-r from-transparent via-white/12 to-transparent pointer-events-none z-10" />

      {/* Thumbnail */}
      <div className="relative overflow-hidden">
        <ContentThumbnail
          id={content.id}
          source={content.source}
          thumbnailUrl={content.thumbnail}
          height="h-36"
        />

        {/* Badges overlay */}
        <div className="absolute top-2 left-2 right-2 flex items-start justify-between z-20">
          <SourceBadge source={content.source} variant="full" />
          <StatusBadge status={content.status} animated />
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-2.5">
        {/* Title */}
        <p className="text-sm font-semibold text-white/90 group-hover:text-white transition-colors line-clamp-2 leading-snug">
          {title}
        </p>

        {/* Source label + date */}
        <p className="text-[11px] text-white/35 truncate">
          {content.sourceLabel}
          {content.createdAt && (
            <span className="ml-1.5 text-white/25">· {timeAgo(content.createdAt)}</span>
          )}
        </p>

        {/* Summary */}
        {content.summary && (
          <p className="text-[11px] text-white/45 leading-relaxed line-clamp-2">
            {content.summary}
          </p>
        )}

        {/* AI Topics */}
        {visibleTopics.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {visibleTopics.map((topic, i) => (
              <TopicBadge key={topic} topic={topic} intensity={0.07 + i * 0.02} />
            ))}
            {hiddenCount > 0 && (
              <span className="text-[10px] text-white/30 self-center">+{hiddenCount}</span>
            )}
          </div>
        )}
      </div>
    </motion.article>
  );
}
