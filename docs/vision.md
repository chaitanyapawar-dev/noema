# Noema — Product Vision

> *"The real problem of humanity is the following: We have Paleolithic emotions, medieval institutions, and godlike technology."*
> — E.O. Wilson

---

## What Is Noema?

Noema is a **multimodal AI knowledge engine** — a local-first second brain that captures, organizes, and makes sense of the information you consume across the internet.

The name comes from the Greek *noema* (νόημα) — meaning **thought**, **meaning**, or **what is understood**. It is the intentional content of consciousness; the object that the mind holds when it perceives or thinks about something.

We chose this name because Noema is not about storing files. It is about storing **meaning**.

---

## The Problem

The modern human consumes more information in a week than a person in the 18th century consumed in a lifetime. But we retain almost none of it.

We bookmark. We screenshot. We save videos to watch later.
Then we forget they exist.

The tools we use to organize information — notes apps, bookmarking services, read-later apps — are fundamentally passive. They store *copies* of content, not understanding.

They cannot answer:
- "What did that video about attention mechanisms explain about transformers?"
- "Find everything I've saved about cold email outreach."
- "What were the key points from the YouTube video on sleep optimization I watched last month?"

Standard search fails because it matches keywords, not meaning.

---

## The Solution

Noema is different because it **understands** what you save.

When you save a piece of content to Noema, it does not just store a link:

1. It **extracts** the spoken words (ASR/Whisper)
2. It **reads** the text on screen (OCR/EasyOCR)
3. It **describes** what it sees visually (BLIP)
4. It **embeds** all of this into a semantic vector space (CLIP + sentence-transformers)
5. It **indexes** everything into a local vector database (ChromaDB)

Now you can ask natural language questions and get answers grounded in your own saved content.

---

## Who Is It For?

### Knowledge Workers
Developers, researchers, designers, writers — anyone who learns from video content and struggles to retrieve specific things they've seen before.

### Students
Students who watch lecture recordings, tutorials, and explanations but cannot search through them when studying for exams.

### Creators
Creators who save reference material for inspiration and need to find specific examples quickly.

### Privacy-Conscious Users
People who want offline, local-first semantic indexing without sending their data to cloud APIs or paying subscription fees.

---

## How Is It Different?

| Feature | Noema | Notion | Readwise | Standard Notes |
|---|---|---|---|---|
| Multimodal (video, audio, images) | ✅ | ❌ | ❌ | ❌ |
| Semantic search | ✅ | Limited | Limited | ❌ |
| Local-first / 100% offline | ✅ | ❌ | ❌ | ✅ |
| Zero cloud cost | ✅ | ❌ | ❌ | ✅ |
| Conversational RAG | ✅ | ❌ | Limited | ❌ |
| Visual understanding | ✅ | ❌ | ❌ | ❌ |
| OCR on screen text | ✅ | ❌ | ❌ | ❌ |

The core differentiator is **multimodal local AI**. Noema is the only tool that understands video at every layer (speech, screen text, visual scene) and keeps all of that understanding private, local, and free.

---

## Current State (v0.1)

Noema currently supports **Instagram Reels** as its first content source. This was chosen because:

1. Instagram Reels are dense with information (tutorials, explanations, demos)
2. Instagram has no native semantic search
3. Reels contain a mix of modalities: speech, text overlays, and visual content — making them a perfect proof-of-concept for multimodal AI

The pipeline processes a reel in stages:
- Download → Transcription → OCR → Visual Captioning → Embedding → Vector Index

---

## The Future

Noema is designed from day one to be source-agnostic. The ingestion pipeline is modular — adding a new source type means building a new extractor, not rebuilding the system.

### Roadmap

**Phase 1** — Multi-Source Ingestion
- YouTube videos
- PDFs and documents
- Images

**Phase 2** — Workspace
- Unified Workspace (Chat, Search, Memory, Reasoning in one view)
- Notes and annotations on indexed content
- Memory graph: visualize how knowledge connects

**Phase 3** — More Sources
- Voice notes
- Articles and web URLs
- GitHub repositories (code understanding)

**Phase 4** — Intelligence Layer
- Temporal search (find the exact second in a video)
- Auto-clustering (discover themes in your knowledge base)
- Cross-source synthesis (answer questions using multiple source types simultaneously)
- Shareable knowledge snapshots

---

## Philosophy

Noema is built around three principles:

**1. Ownership** — Your knowledge lives on your machine. No API keys required. No subscription. No cloud.

**2. Understanding** — We don't store links. We store meaning. Every item in your knowledge base is semantically indexed at multiple levels.

**3. Retrieval** — The best capture system is useless if retrieval fails. Noema is optimized for retrieval: hybrid search, LLM reranking, and conversational access.

---

## Technical Philosophy

- **Local-first by default** — All AI inference runs on the user's hardware
- **Modular pipeline** — Each processing stage (ASR, OCR, BLIP, CLIP) is independent and composable
- **Separation of concerns** — Ingestion, storage, retrieval, and generation are fully decoupled
- **Graceful degradation** — Each modality enriches the index independently; a failed OCR run does not break the rest

---

*Noema — Your AI Second Brain*  
*v0.1 Hackathon · Open Source · MIT License*  
*https://github.com/chaitanyapawar-dev/noema*
