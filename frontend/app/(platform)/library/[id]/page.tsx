"use client";

// app/(platform)/library/[id]/page.tsx
// Renders the same KnowledgeBasePage so the search filters and grid remain visible
// underneath the automatically opened drawer.

import KnowledgeBasePage from "@/components/knowledge/KnowledgeBasePage";

export default function ContentDetailRoute() {
  return <KnowledgeBasePage />;
}
