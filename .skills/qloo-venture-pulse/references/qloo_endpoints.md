# Qloo Cultural Taste AI™ API Reference
**Endpoint Specifications for Venture Pulse Agent Skills**

---

## 1. Authentication & Base URLs
* **Hackathon Base URL:** `https://hackathon.api.qloo.com`
* **Commercial Base URL:** `https://api.qloo.com`
* **Dual Authentication Header Requirement:**
  ```http
  Authorization: Bearer <QLOO_API_KEY>
  X-Api-Key: <QLOO_API_KEY>
  ```
* **Taste Graph Scope:** 250M+ entities across music, film, television, dining, fashion, literature, and living aesthetics, underpinned by 100 Trillion+ cultural signals.

---

## 2. Core Endpoints & Payloads

### 2.1 Entity Search & Tag Lookup
* **Path:** `/v2/search` (or `/v1/search`)
* **Method:** `GET`
* **Query Parameters:**
  - `query`: The name of the artist, film, style, or brand (e.g. `Synthwave`, `Blade Runner 2049`, `Acne Studios`)
  - `type`: Target category (`music`, `movie`, `brand`, `fashion`, `dining`, `book`)
* **Response:** Array of matched entities with canonical URNs (`urn:entity:<category>:<slug>`), name, confidence, and popularity rank.

### 2.2 Cross-Domain Insights & Negative Anti-Affinity Filtering
* **Path:** `/v2/insights`
* **Method:** `POST`
* **Request Body:**
  ```json
  {
    "filter": {
      "entities": [
        "urn:entity:music:kavinsky",
        "urn:entity:movie:bladerunner2049"
      ]
    },
    "target_categories": ["fashion", "tech", "beverage", "living"],
    "excluded_tags": ["mass-market", "cheap-plastic", "conglomerate-tier"],
    "min_affinity": 5.0
  }
  ```
* **Response Body:**
  ```json
  {
    "status": 200,
    "insights": [
      {
        "entity_id": "urn:entity:brand:acne_studios",
        "name": "Acne Studios",
        "category": "fashion",
        "affinity_multiplier": 7.8,
        "cosine_distance": 0.12,
        "compatibility_pct": 94,
        "multi_hop_path": "Kavinsky [artist] -> Dark Minimalism [tag] -> Acne Studios [brand]",
        "negative_signals": "Audience indexes -4.2x against generic neon plastics and mass-market energy drinks.",
        "top_geographic_clusters": [
          { "city": "Tokyo", "lift": 4.1 },
          { "city": "Brooklyn", "lift": 3.4 },
          { "city": "Berlin", "lift": 2.9 }
        ]
      }
    ]
  }
  ```

### 2.3 Shortlist Ranking & Candidates Sizing
* **Path:** `/v2/entities/rank`
* **Method:** `POST`
* **Body:**
  ```json
  {
    "anchor_entities": ["urn:entity:music:kavinsky"],
    "candidates": ["urn:entity:brand:acne_studios", "urn:entity:brand:keychron", "urn:entity:brand:balenciaga"]
  }
  ```
* **Response:** Ranked candidate brands ordered by cross-domain affinity scores and safety flags.

### 2.4 Subcultural Counter-Discovery (Brand Mode)
* **Path:** `/v2/insights/subcultures`
* **Method:** `POST`
* **Body:**
  ```json
  {
    "brand_entity": "urn:entity:brand:snow_peak",
    "target_creator_domains": ["podcast", "gaming", "art"]
  }
  ```
* **Response:** High-affinity creator communities, podcasts, and indie gaming subcultures indexing $>6\times$ above baseline.
