"use client";

// components/badges/StatusBadge.tsx
// Renders a colour-coded ContentStatus pill: Queued | Processing | Embedding | Indexed | Failed

import { motion } from "framer-motion";
import { STATUS_CONFIG } from "@/lib/content/constants";
import type { ContentStatus } from "@/lib/content/types";

interface StatusBadgeProps {
  status: ContentStatus;
  /** Show animated dot for active states */
  animated?: boolean;
  className?: string;
}

export default function StatusBadge({ status, animated = true, className = "" }: StatusBadgeProps) {
  const cfg = STATUS_CONFIG[status];
  const isActive = status === "processing" || status === "embedding";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium ${cfg.color} ${cfg.bg} ${cfg.border} ${className}`}
    >
      {animated && isActive ? (
        <motion.span
          className={`h-1.5 w-1.5 rounded-full ${cfg.dotColor}`}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        />
      ) : (
        <span className={`h-1.5 w-1.5 rounded-full ${cfg.dotColor}`} />
      )}
      {cfg.label}
    </span>
  );
}
