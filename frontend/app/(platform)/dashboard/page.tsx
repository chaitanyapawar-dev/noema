"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Search, Plus, Command, Cpu, Database, ChevronRight, Zap, RefreshCw, AlertCircle
} from "lucide-react";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { fetchLibrary, type ReelItem } from "@/lib/api";
import { useBackend } from "@/components/app/BackendProvider";
import ContentCard from "@/components/content/ContentCard";
import { mapReelToContent } from "@/lib/content/adapters";



export default function DashboardPage() {
  const { status, isLoading: isStatusLoading } = useBackend();
  const [reels, setReels] = useState<ReelItem[]>([]);
  const [loadingReels, setLoadingReels] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoadingReels(true);
      const res = await fetchLibrary();
      if (res.success) {
        setReels(res.reels || []);
      } else {
        setError("Failed to load library");
      }
    } catch (e: any) {
      setError(e.message || "Failed to load library");
    } finally {
      setLoadingReels(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const isOnline = status?.fastapi ?? false;

  const dynamicStats = [
    { 
      label: "Ollama LLM", 
      icon: Cpu, 
      value: isOnline && status.ollama ? "Llama 3.2 (Active)" : "Offline", 
      status: isOnline && status.ollama 
    },
    { 
      label: "ChromaDB", 
      icon: Database, 
      value: isOnline && status.chromadb ? `${(status.reelCount * 12).toLocaleString()} vectors` : "Offline", 
      status: isOnline && status.chromadb 
    },
    { 
      label: "API Server", 
      icon: Zap, 
      value: isOnline ? "FastAPI Online" : "Offline", 
      status: isOnline 
    },
    { 
      label: "Latency", 
      icon: RefreshCw, 
      value: isOnline ? `${status.latencyMs} ms` : "--", 
      status: isOnline 
    },
  ];

  return (
    <div className="p-6 space-y-8 max-w-[1200px]">

      {/* Ambient orb behind dashboard */}
      <div className="fixed top-20 left-1/2 -translate-x-1/4 w-[600px] h-[400px] pointer-events-none -z-10"
        style={{ background: "radial-gradient(ellipse, rgba(91,140,255,0.06) 0%, transparent 70%)", filter: "blur(60px)" }} />

      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-xl font-bold text-white tracking-tight">Good morning.</h1>
        <p className="mt-0.5 text-sm text-white/40">
          {isOnline 
            ? `Your AI memory system is active — ${status.reelCount} items indexed across ${(status.reelCount * 12).toLocaleString()} vectors.`
            : "AI system is offline. Please start the backend service."}
        </p>
      </motion.div>

      {/* System Health Row */}
      <motion.div variants={staggerContainer} initial="hidden" animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {dynamicStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} variants={fadeUp} custom={i * 0.05}
              className="glass-panel card-hover flex items-center gap-3 rounded-2xl p-4 relative overflow-hidden">
              {/* Inner top reflection */}
              <div className="absolute top-0 left-[5%] right-[5%] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 border border-white/10 shrink-0">
                <Icon className={`h-4 w-4 ${stat.status ? "text-white/60" : "text-white/20"}`} strokeWidth={1.5} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-white/35 uppercase tracking-widest">{stat.label}</p>
                <p className="text-xs font-semibold text-white/85 truncate">{stat.value}</p>
              </div>
              <motion.div
                className={`ml-auto h-2 w-2 rounded-full shrink-0 ${stat.status ? "bg-emerald-400" : "bg-rose-500"}`}
                style={{ boxShadow: stat.status ? "0 0 8px rgba(52,211,113,0.7)" : "0 0 8px rgba(244,63,94,0.7)" }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
              />
            </motion.div>
          );
        })}
      </motion.div>

      {/* Global Search shortcut */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
        <div 
          onClick={() => {
            window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }));
          }}
          className="flex items-center gap-3 w-full max-w-[600px] rounded-2xl px-5 py-3.5 cursor-pointer glass-panel hover:border-white/20 transition-colors duration-300 relative overflow-hidden"
        >
          <div className="absolute top-0 left-[5%] right-[5%] h-px bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
          <Search className="h-4 w-4 text-white/30 shrink-0" />
          <span className="text-sm text-white/30 flex-1">Search across your knowledge base...</span>
          <div className="flex items-center gap-0.5 rounded-md border border-white/10 px-1.5 py-0.5 text-[10px] text-white/25">
            <Command className="h-2.5 w-2.5" />K
          </div>
        </div>
      </motion.div>

      {/* Recent Reels */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xs font-semibold text-white/50 uppercase tracking-widest flex items-center gap-2">
            Recent Imports
            {loadingReels && <RefreshCw className="h-3 w-3 animate-spin text-white/30" />}
          </h2>
          <Link href="/library" className="flex items-center gap-1 text-xs text-white/35 hover:text-[#5B8CFF] transition-colors">
            View all <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        {loadingReels ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((placeholder) => (
              <div 
                key={placeholder} 
                className="h-48 rounded-2xl glass-panel animate-pulse relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/[0.02]" />
              </div>
            ))}
          </div>
        ) : reels.length === 0 ? (
          <div className="glass-panel rounded-2xl p-8 text-center space-y-4 max-w-[600px] mx-auto border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 left-[5%] right-[5%] h-px bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
            <AlertCircle className="h-8 w-8 text-white/35 mx-auto" strokeWidth={1.5} />
            <h3 className="text-sm font-semibold text-white/80">No items indexed yet</h3>
            <p className="text-xs text-white/40 max-w-sm mx-auto leading-relaxed">
              Ingest your first source content to extract transcripts, run optical character recognition, and create vector embeddings.
            </p>
            <Link href="/processing" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#5B8CFF] to-[#7B61FF] px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-[#5B8CFF]/20 hover:shadow-[#5B8CFF]/30 transition-all duration-300 hover:scale-[1.02]">
              <Plus className="h-4 w-4" /> Import First Content
            </Link>
          </div>
        ) : (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {reels.slice(0, 6).map((reel, i) => (
              <ContentCard key={reel.id} content={mapReelToContent(reel)} index={i} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
