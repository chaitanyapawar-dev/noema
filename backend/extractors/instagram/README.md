# Instagram Extractor

Currently integrated directly into the main processing pipeline (`backend/main.py`).

## Future Interface

New extractors (YouTube, PDF, Voice, GitHub) will follow the same interface:

```python
from extractors.base import BaseExtractor, RawContent

class InstagramExtractor(BaseExtractor):
    def extract(self, source_url: str) -> RawContent: ...
    def normalize(self, raw: RawContent) -> dict: ...
```

## Do Not Modify

Do **not** modify the main pipeline to use this package yet.
New extractors will plug in here during Phase 3.

## Planned Extractors

| Package        | Source    | Status      |
|----------------|-----------|-------------|
| `instagram/`   | Instagram | Integrated  |
| `youtube/`     | YouTube   | Phase 3     |
| `pdf/`         | PDF       | Phase 3     |
| `image/`       | Images    | Phase 3     |
| `voice/`       | Voice     | Phase 3     |
| `github/`      | GitHub    | Phase 4     |
| `article/`     | Articles  | Phase 4     |
