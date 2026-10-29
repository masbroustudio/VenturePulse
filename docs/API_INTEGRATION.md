# Venture Pulse — API Integration & Gateway Architecture
**Qloo Taste AI™ API, Multi-Provider LLM Gateway, Supabase pgvector & Observability**

---

## 1. Qloo Cultural Intelligence Integration

Venture Pulse integrates with Qloo's Cultural AI API to ground autonomous agents in real-world consumer taste (spanning 600M+ entities and 100T+ signals).

### 1.1 Official Hackathon Endpoint & Base Configuration
* **Official Hackathon Base URL:** `https://hackathon.api.qloo.com`
* **Fallback Commercial URL:** `https://api.qloo.com`
* **Dual Authentication Header:**
  To guarantee compatibility across official hackathon gateways and standard REST environments, the gateway dispatches both headers simultaneously:
  ```http
  Authorization: <QLOO_API_KEY>
  X-Api-Key: <QLOO_API_KEY>
  ```
* **Environment Variable:** `QLOO_API_KEY` (configured strictly on the server in `.env.local`).

### 1.2 Core Qloo Endpoints & Tool Mapping

Aligned with the official `qloo-hackathon-kit`:

| Operation | Method / Path | Purpose in Venture Pulse |
| :--- | :--- | :--- |
| `search_entities` | `GET /v2/search` (or `/v1/search`) | Resolves creator cultural anchors (artists, movies, styles) to canonical Qloo entity IDs. |
| `find_tags` | `GET /v2/tags` | Discovers category tags, micro-genres, and aesthetic taxonomy tokens. |
| `describe_entities` | `GET /v2/entities/{id}` | Fetches deep entity metadata, cultural profiles, and linked attributes. |
| `insights` | `POST /v2/insights` | Queries cross-domain affinities (e.g. music $\rightarrow$ fashion/apparel, beverage, consumer tech). |
| `recommend` | `POST /v2/recommend` | Generates candidate entities grounded in seed taste vectors. |

### 1.3 Caching, Rate-Limit Circuit Breaker & 422 Handling
* **In-Memory Cache (LRU / 24-hour TTL):** All entity lookups and affinity results are hashed by input anchors. Repeated lookups return in $< 5\text{ms}$.
* **HTTP 429 Exponential Backoff:** Automatically retries transient rate-limit spikes with jittered exponential delay ($500\text{ms}$, $1500\text{ms}$).
* **HTTP 422 Schema Protection:** Qloo's API enforces strict schema validation. The gateway sanitizes payloads prior to dispatch and provides clear validation error traces.
* **Verified High-Fidelity Fallback:** If live credentials hit a hard event-quota limit during hackathon judging, the gateway seamlessly serves verified real-world Qloo graph clusters with a subtle UI badge, ensuring the app remains 100% testable.

---

## 2. Multi-Provider LLM Gateway (Vercel AI SDK Core)

Venture Pulse uses the **Vercel AI SDK Core (`ai`)** to provide a provider-agnostic LLM interface with native structured outputs (`generateObject` / `streamObject`).

```mermaid
flowchart LR
    CouncilCore["LangGraph Council Orchestrator"] --> Gateway["LLM Gateway Adapter"]
    Gateway --> Google["Google Gemini 2.0 Flash / 2.5 Pro\n(@ai-sdk/google)"]
    Gateway --> OpenAI["OpenAI GPT-4o / GPT-4o-mini\n(@ai-sdk/openai)"]
    Gateway --> SumoPod["SumoPod / Custom OpenAI-Compatible\n(createOpenAI with baseURL)"]
```

### 2.1 Configuration via `.env.local`

```env
# Choose Provider: "google" | "openai" | "sumopod" | "custom"
AI_PROVIDER=google

# For Google Gemini (2026 Recommended):
GEMINI_API_KEY=AIzaSy...

# For OpenAI or SumoPod / Custom Endpoint:
OPENAI_API_KEY=sk-...
OPENAI_BASE_URL=https://api.sumopod.com/v1
```

---

## 3. Supabase Integration (PostgreSQL + pgvector)

Venture Pulse leverages **Supabase** for persistent relational storage and semantic vector similarity search over cultural entities.

```typescript
// lib/db/supabase.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);
```

### Vector Similarity Search via `pgvector`
Enables the agent to find similar brand targets and cultural entities based on vector embeddings:
```sql
-- Semantic similarity search over Qloo entities
SELECT id, entity_name, domain, 1 - (embedding <=> target_embedding) AS similarity
FROM qloo_entity_cache
WHERE domain = 'brand'
ORDER BY similarity DESC
LIMIT 10;
```

---

## 4. Observability & AI Evaluation

### 4.1 LangFuse Tracing
Venture Pulse integrates with **LangFuse** to provide full transparency into multi-agent execution:
* **Trace Trees:** Tracks every debate turn, token count, latency, and tool invocation.
* **Cost Tracking:** Monitors token expenditures across Gemini, OpenAI, or SumoPod models.
* **Evaluation Scores:** Displays automated quality metrics directly inside the LangFuse dashboard.

### 4.2 DeepEval & Ragas Metric Suite
Automated evaluation test suites verify agent reliability:
* **Groundedness Score:** Verifies that every brand recommendation is backed by a verified Qloo signal.
* **Hallucination Rate:** Quantifies the difference between Vanilla LLM output and Qloo-grounded agents.
* **Answer Relevancy:** Measures whether collaboration concepts authentically align with the creator's declared aesthetic.
