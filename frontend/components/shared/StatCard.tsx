"use client";

// components/shared/StatCard.tsx
// Single stat tile used in the Knowledge Base statistics strip and future dashboards.

import { type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  sublabel?: string;
  iconColor?: string;
  /** If true, shows a green glow dot indicating live/online status */
  live?: boolean;
}

export default function StatCard({
  icon: Icon,
  label,
  value,
  sublabel,
  iconColor = "text-[#5B8CFF]",
  live,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 rounded-2xl px-4 py-3 relative overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Top sheen */}
      <div className="absolute top-0 left-[5%] right-[5%] h-px bg-gradient-to-r from-transparent via-white/12 to-transparent pointer-events-none" />

      <div
        className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 ${iconColor}`}
        style={{ background: "rgba(255,255,255,0.06)" }}
      >
        <Icon className="h-4 w-4" strokeWidth={1.75} />
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-bold text-white/90 leading-none">{value}</p>
          {live && (
            <span
              className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0"
              style={{ boxShadow: "0 0 6px rgba(52,211,113,0.8)" }}
            />
          )}
        </div>
        <p className="text-[11px] text-white/40 mt-0.5 truncate">{label}</p>
        {sublabel && (
          <p className="text-[10px] text-white/25 mt-0.5 truncate">{sublabel}</p>
        )}
      </div>
    </motion.div>
  );
}
