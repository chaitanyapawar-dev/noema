# backend/extractors/__init__.py
# Extractor plugin registry for Noema's multi-source ingestion architecture.
#
# Each extractor lives in its own sub-package and exposes two callables:
#   extract(source_url: str) -> RawContent
#   normalize(raw: RawContent) -> dict
#
# Currently integrated extractor: Instagram (via main pipeline)
# Planned: YouTube, PDF, Image, Voice, GitHub, Article
