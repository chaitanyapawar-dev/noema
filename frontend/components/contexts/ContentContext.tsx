"use client";

// frontend/components/contexts/ContentContext.tsx
// Global drawer state — any page or component can call openDrawer(content).
// Wraps the platform layout so Search, Dashboard, Timeline, etc. all share one drawer.

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { Content } from "@/lib/content/types";

// ─── Context Shape ────────────────────────────────────────────────────────────

interface ContentContextValue {
  selectedContent: Content | null;
  isDrawerOpen: boolean;
  openDrawer: (content: Content) => void;
  closeDrawer: () => void;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const ContentContext = createContext<ContentContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

export function ContentProvider({ children }: { children: ReactNode }) {
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = useCallback((content: Content) => {
    setSelectedContent(content);
    setIsDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    // Keep selectedContent alive during exit animation, clear after
    setTimeout(() => setSelectedContent(null), 350);
  }, []);

  return (
    <ContentContext.Provider value={{ selectedContent, isDrawerOpen, openDrawer, closeDrawer }}>
      {children}
    </ContentContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useContent(): ContentContextValue {
  const ctx = useContext(ContentContext);
  if (!ctx) {
    throw new Error("useContent must be used within <ContentProvider>");
  }
  return ctx;
}
