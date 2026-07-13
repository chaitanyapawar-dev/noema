"use client";

// app/(platform)/library/page.tsx
// Thin shell route wrapper for the KnowledgeBasePage component.

import KnowledgeBasePage from "@/components/knowledge/KnowledgeBasePage";

export default function LibraryRoute() {
  return <KnowledgeBasePage />;
}
