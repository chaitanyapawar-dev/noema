"use client";

// components/content/ContentHeader.tsx
// Sub-header for the Knowledge Base containing stats strip and title/subtitle/actions.

import { Database, Sparkles, Search, Clock, RefreshCw, Cpu } from "lucide-react";
import StatCard from "@/components/shared/StatCard";
import PageHeader from "@/components/shared/PageHeader";

interface ContentHeaderProps {
  totalItems: number;
  lastImport: string;
  isAiReady: boolean;
  isSearchEnabled: boolean;
  loading: boolean;
  onRefresh: () => void;
}

export default function ContentHeader({
  totalItems,
  lastImport,
  isAiReady,
  isSearchEnabled,
  loading,
  onRefresh,
}: ContentHeaderProps) {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Knowledge Base"
        subtitle="Browse, organize and explore everything you've learned."
        actions={
          <button
            onClick={onRefresh}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200 text-white/60 hover:text-white"
            title="Refresh library"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        }
      />

      {/* Statistics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatCard
          icon={Database}
          label="Total Items"
          value={`${totalItems} Contents`}
          sublabel="1 Active Source"
          iconColor="text-[#5B8CFF]"
        />
        <StatCard
          icon={Cpu}
          label="Active Sources"
          value="1 Source"
          sublabel="Instagram active"
          iconColor="text-rose-400"
        />
        <StatCard
          icon={Clock}
          label="Last Import"
          value={lastImport || "None"}
          sublabel="Auto-synced"
          iconColor="text-cyan-400"
        />
        <StatCard
          icon={Sparkles}
          label="Knowledge Health"
          value={isAiReady ? "Excellent" : "Offline"}
          sublabel={isAiReady ? "All systems active" : "Check backend"}
          iconColor="text-violet-400"
          live={isAiReady}
        />
        <StatCard
          icon={Search}
          label="Search Mode"
          value={isSearchEnabled ? "Semantic" : "Disabled"}
          iconColor="text-emerald-400"
          live={isSearchEnabled}
        />
      </div>
    </div>
  );
}
