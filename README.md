# Noema

**Your AI Second Brain**

> Transform everything you learn into connected knowledge.

---

## Overview

Noema is a multimodal AI knowledge engine that helps you save, organize, search, and interact with information from multiple sources. It turns raw media into structured, searchable, interactive knowledge — all running 100% on your own machine with no cloud dependencies and zero running costs.

Current implementation includes **Instagram Reels** as the first supported content source. Future versions will expand to YouTube, PDFs, Images, Voice Notes, Articles, and GitHub Repositories.

**Mission:**
- Save less.
- Understand more.
- Remember forever.

---

## Features

- **Multimodal Ingestion** — Download and process content from supported sources using `yt-dlp` and `FFmpeg`
- **Speech-to-Text (ASR)** — High-fidelity transcription via `faster-whisper` (CPU-optimized, `int8` quantized)
- **Optical Character Recognition (OCR)** — Frame-based text extraction (English & Hindi) using `EasyOCR`
- **Visual Understanding (BLIP)** — Automated frame captioning via `Salesforce/blip-image-captioning-base`
- **Semantic Embeddings (CLIP)** — Visual semantic embeddings using `openai/clip-vit-base-patch32`
- **Hybrid Semantic Search** — Merges text (`sentence-transformers`) and visual (CLIP) scores via a weighted ranking algorithm
- **Local LLM Reasoning** — Query expansion, result reranking, and relevance feedback via `Ollama` + `Llama 3.2`
- **Conversational RAG Chat** — Chat with your entire knowledge base; answers grounded with source citations
- **Knowledge Base Management** — Browse, filter, re-index, and safely delete items from the vector database

---

## Architecture

```
                    Sources

   Instagram · YouTube · PDFs · Images · Voice · GitHub · URLs

                       ↓

                  Extractors

              yt-dlp · FFmpeg · Parsers

                       ↓

            Processing Pipeline

                       ↓

      OCR · ASR (Whisper) · Vision (BLIP) · Metadata

                       ↓

                  Embeddings

         sentence-transformers · CLIP · Multi-frame pooling

                       ↓

                  ChromaDB

          Vector Store (text + vision collections)

                       ↓

                    Gemma / Llama

          Query Expansion · Reranking · RAG Chat

                       ↓

           Workspace · Search · Notes · Insights
```

---

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom Vanilla CSS glassmorphism
- **Animations**: Framer Motion
- **3D Graphics**: Three.js & React Three Fiber (landing page)
- **Data Fetching**: TanStack Query

### Backend
- **Framework**: FastAPI (Python 3.10+)
- **Server**: Uvicorn
- **Concurrency**: SQLite WAL + `asyncio.Semaphore` job queue

### Database / Vector Store
- **Relational**: SQLite (jobs, pipeline logs, queue state)
- **Vector DB**: ChromaDB (local persistent store)
  - `reels` collection — Text semantic embeddings (transcripts, captions, OCR)
  - `reels_clip` collection — Multi-frame visual embeddings (CLIP)

### AI Models
| Model | Purpose |
|---|---|
| `faster-whisper` | Speech transcription (ASR) |
| `EasyOCR` | On-screen text extraction |
| `BLIP` | Frame visual captioning |
| `CLIP (ViT-B/32)` | Visual semantic embeddings |
| `sentence-transformers/all-MiniLM-L6-v2` | Text semantic embeddings |
| `Ollama / Llama 3.2` | Query rewriting, reranking, RAG chat |

---

## Current Capabilities

### Currently Implemented Sources

| Source | Status |
|---|---|
| **Instagram Reels** | ✅ Fully implemented |

### Planned Future Sources

| Source | Status |
|---|---|
| YouTube Videos | 🔜 Phase 2 |
| PDFs & Documents | 🔜 Phase 2 |
| Images | 🔜 Phase 2 |
| Voice Notes | 🔜 Phase 3 |
| Articles & URLs | 🔜 Phase 3 |
| GitHub Repositories | 🔜 Phase 3 |

---

## Roadmap

### Phase 1 — Multi-Source Ingestion
- YouTube video ingestion via `yt-dlp`
- PDF parsing and embedding
- Image annotation and indexing

### Phase 2 — Workspace
- Unified **Workspace** view (Chat, Search, Memory, Reasoning)
- Notes and annotations on indexed content
- Memory graph visualization

### Phase 3 — Voice, Articles & GitHub
- Voice note transcription and indexing
- Article/URL scraping and chunking
- GitHub repo code understanding

### Phase 4 — Intelligence Layer
- Temporal video search (highlight exact timestamps)
- Auto-categorization via K-Means clustering on embeddings
- Cross-source insight generation

---

## Running Locally

### Prerequisites
- Python 3.10+
- Node.js 18+
- FFmpeg (on system PATH)
- Ollama (`ollama run llama3.2:3b`)

### Setup

#### 1. Clone the repository
```bash
git clone https://github.com/chaitanyapawar-dev/noema.git
cd noema
```

#### 2. Backend
```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

#### 3. Frontend
```bash
cd ../frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

**`frontend/.env.local`**
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

**`backend/.env`** *(optional)*
```env
MAX_CONCURRENT_PIPELINES=2
```

---

## Project Structure

```
noema/
├── backend/
│   ├── main.py              # FastAPI app, API routers & pipeline worker
│   ├── db.py                # SQLite wrapper (jobs, WAL, logs)
│   ├── requirements.txt     # Python dependencies
│   ├── selftest.py          # Integration verification suite
│   ├── downloads/           # Media storage (gitignored)
│   │   ├── audio/           # Extracted MP3s
│   │   ├── transcripts/     # Whisper transcripts
│   │   ├── ocr/             # OCR text files
│   │   └── frames/          # Temporary processing frames
│   └── vector_db/           # ChromaDB persistent store (gitignored)
├── frontend/
│   ├── app/
│   │   ├── (marketing)/     # Landing page with 3D glassmorphism
│   │   └── (platform)/      # Dashboard, Knowledge Base, AI Search, Ingestion Pipeline, Settings
│   ├── components/
│   │   ├── app/             # Topbar, GlassSidebar, CommandPalette, Context Providers
│   │   ├── dashboard/       # Landing page sections (Hero, Navbar, Footer, Features)
│   │   └── ui/              # Shared UI primitives
│   └── lib/
│       ├── api.ts           # Central API layer with TypeScript contracts
│       ├── branding.ts      # Brand constants (single source of truth)
│       └── fetcher.ts       # Retrying HTTP client
├── docs/
│   └── vision.md            # Product vision and philosophy
└── README.md
```

---

## API Reference

### Ingestion
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/jobs` | Enqueue a new content URL for processing |
| `GET` | `/api/jobs` | List pipeline jobs with optional status filter |
| `GET` | `/api/jobs/{job_id}` | Retrieve job progress, stage, and logs |
| `GET` | `/api/jobs/{job_id}/stream` | SSE stream for real-time job updates |

### Search & Knowledge
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/search` | Hybrid semantic search with LLM reranking |
| `POST` | `/api/feedback` | Submit relevance feedback for a search result |
| `GET` | `/api/search-analytics` | Fetch search latency and success metrics |

### Library Management
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/reels` | Paginated indexed content with keyword filter |
| `DELETE` | `/api/reels/{id}` | Remove item from SQLite, disk, and ChromaDB |
| `POST` | `/api/reels/{id}/reindex` | Refresh vector embeddings for a stored item |

### AI Chat & System
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/chat` | Conversational RAG with source citations |
| `GET` | `/api/system/health` | Server status, models, latency, disk |

---

## License

MIT License — Open Source. See [LICENSE](./LICENSE).

---

*Noema — v0.1 Hackathon · Built with FastAPI • Next.js • ChromaDB • Gemma*
