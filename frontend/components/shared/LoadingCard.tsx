"use client";

// components/shared/LoadingCard.tsx
// Animated skeleton card for loading states.

export default function LoadingCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-2xl overflow-hidden relative animate-pulse ${className}`}
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* Thumbnail area */}
      <div className="h-36 w-full bg-white/[0.04]" />
      {/* Content area */}
      <div className="p-4 space-y-2.5">
        <div className="h-3.5 w-4/5 rounded-lg bg-white/[0.06]" />
        <div className="h-2.5 w-1/2 rounded-lg bg-white/[0.04]" />
        <div className="h-2.5 w-3/4 rounded-lg bg-white/[0.04]" />
        <div className="flex gap-1.5 mt-3">
          <div className="h-5 w-14 rounded-full bg-white/[0.04]" />
          <div className="h-5 w-16 rounded-full bg-white/[0.04]" />
        </div>
      </div>
    </div>
  );
}
