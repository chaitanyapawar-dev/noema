"use client";

// components/shared/EmptyState.tsx
// Generic empty state — used in Knowledge Base, Search, Processing, etc.

import { motion } from "framer-motion";
import { type LucideIcon, Inbox } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  cta?: {
    label: string;
    href: string;
    icon?: LucideIcon;
  };
}

export default function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  cta,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-2xl p-12 text-center space-y-4 max-w-[560px] mx-auto border border-white/10 relative overflow-hidden"
    >
      {/* Top sheen */}
      <div className="absolute top-0 left-[5%] right-[5%] h-px bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

      <div
        className="h-12 w-12 rounded-2xl mx-auto flex items-center justify-center"
        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <Icon className="h-6 w-6 text-white/30" strokeWidth={1.5} />
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-white/80">{title}</h3>
        <p className="text-xs text-white/40 max-w-sm mx-auto leading-relaxed">{description}</p>
      </div>

      {cta && (
        <Link
          href={cta.href}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold text-white hover:scale-[1.02] transition-all"
          style={{
            background: "linear-gradient(135deg, #5B8CFF, #7B61FF)",
            boxShadow: "0 0 24px rgba(91,140,255,0.3)",
          }}
        >
          {cta.icon && <cta.icon className="h-4 w-4" />}
          {cta.label}
        </Link>
      )}
    </motion.div>
  );
}
