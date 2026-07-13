"use client";

// components/badges/TopicBadge.tsx
// AI topic chip — currently shows hashtag-derived labels, Gemma-generated in Phase 4.

interface TopicBadgeProps {
  topic: string;
  /** Intensity 0–1 controls the blue tint opacity */
  intensity?: number;
  className?: string;
}

export default function TopicBadge({ topic, intensity = 0.08, className = "" }: TopicBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-medium text-white/75 truncate max-w-[120px] ${className}`}
      style={{
        background: `rgba(91, 140, 255, ${intensity})`,
        border: "1px solid rgba(91,140,255,0.2)",
      }}
      title={topic}
    >
      {topic}
    </span>
  );
}
