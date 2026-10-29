# Qloo Cultural Taste AI™ API Reference
**Endpoint Specifications for Venture Pulse Agent Skills**

---

## 1. Authentication
* **Header:** `X-Api-Key: <QLOO_API_KEY>`
* **Base URL:** `https://api.qloo.com` (or hackathon proxy)

---

## 2. Core Endpoints

### 2.1 Entity Search & Tag Lookup
* **Path:** `/v2/search` (or `/v1/search`)
* **Method:** `GET`
* **Query Parameters:**
  - `query`: The name of the artist, film, style, or brand (e.g. `Synthwave`, `A24`, `Acne Studios`)
  - `type`: Target category (`music`, `movie`, `brand`, `fashion`, `dining`)
* **Response:** Array of matched entities with canonical `id`, `name`, `type`, and popularity metrics.

### 2.2 Cross-Domain Insights & Affinities
* **Path:** `/v2/insights`
* **Method:** `POST`
* **Body:**
  ```json
  {
    "filter": {
      "entities": ["<entity_id_1>", "<entity_id_2>"]
    },
    "target_categories": ["fashion", "beverage", "consumer_electronics"]
  }
  ```
* **Response:** Ranked entity affinities with relative affinity index (e.g. `2.5` to `10.0x` baseline) and demographic overlap percentages.

### 2.3 Shortlist Ranking
* **Path:** `/v2/entities/rank`
* **Method:** `POST`
* **Body:**
  ```json
  {
    "anchor_entities": ["<entity_id_1>"],
    "candidates": ["<brand_id_a>", "<brand_id_b>", "<brand_id_c>"]
  }
  ```
* **Response:** Ordered candidate brands ranked by cultural affinity to the anchor profile.
