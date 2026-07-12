/**
 * Noema – Branding Constants
 *
 * Single source of truth for all brand copy.
 * Import BRAND from here instead of hardcoding strings.
 */

export const BRAND = {
  name: "Noema",

  tagline: "Your AI Second Brain",

  subtitle: "Transform everything you learn into connected knowledge.",

  mission: [
    "Save less.",
    "Understand more.",
    "Remember forever.",
  ],

  github: "https://github.com/chaitanyapawar-dev/noema",

  version: "v0.1 Hackathon",

  company: "Open Source",

  copyright: `© ${new Date().getFullYear()} Noema`,

  techStack: "FastAPI • Next.js • ChromaDB • Gemma",

  description:
    "Noema is a multimodal AI knowledge engine that helps you save, organize, search, and interact with information from multiple sources.",
} as const;
