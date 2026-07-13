"use client";

// components/content/ContentGrid.tsx
// Responsive masonry-style grid wrapper for ContentCards.

import { type ReactNode } from "react";

interface ContentGridProps {
  children: ReactNode;
  className?: string;
}

export default function ContentGrid({ children, className = "" }: ContentGridProps) {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ${className}`}
    >
      {children}
    </div>
  );
}
