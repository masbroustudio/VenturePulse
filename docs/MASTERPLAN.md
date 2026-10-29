# Venture Pulse — Masterplan & Technical Architecture Specification
**Autonomous Cultural Intelligence & Brand Collaboration Agent for Creators & Indie Studios**

> **Hackathon Track:** Qloo Agentic Hackathon 2026  
> **Core Differentiator:** Grounds agentic commercial decision-making in Qloo’s 250M+ entity Taste Graph, replacing generic LLM hallucinations with empirical cross-domain affinity data.

---

## 1. Executive Summary & The Cultural Grounding Imperative

### 1.1 The Problem: The Cultural Blindness of Modern AI
Modern Large Language Models (LLMs) can plan, code, and write persuasive prose, but when tasked with commercial strategy, brand partnerships, or merchandise design, they are **culturally blind**. When an indie game studio or podcaster asks an ungrounded LLM for brand sponsors or merchandise ideas, the model defaults to bland, generic clichés:
- *"Sell logo t-shirts, tote bags, and coffee mugs."*
- *"Pitch generic brands like NordVPN, Audible, or Casper mattresses."*

These generic recommendations fail because they ignore the nuanced, multi-dimensional subcultures of modern audiences. 

### 1.2 The Solution: Venture Pulse
**Venture Pulse** is an AI-native agentic platform that pairs a **Multi-Agent Council** with **Qloo’s Cultural Taste Graph** (250M+ entities across music, film, dining, fashion, literature, and lifestyle). 

Instead of guessing, Venture Pulse:
1. Translates a creator's artistic and aesthetic footprint into verified Qloo taste nodes.
2. Traverses cross-domain graph edges to reveal non-obvious, mathematically verified audience affinities (e.g. an anime lo-fi creator whose audience unexpectedly indexes 7.8× higher for artisanal matcha brands and mechanical keyboard aesthetics).
3. Executes a live **Multi-Agent Debate** (Cultural Analyst, Brand Strategist, Creative Director) to filter for market feasibility, sizing, and aesthetic coherence.
4. Produces an **Actionable Brand CRM Board** (Kanban pipeline) with data-backed pitch drafts, custom product collaboration specs, and automated CRM webhook dispatching.
5. Features an interactive **"Proof Engine"** side-by-side view contrasting Qloo-grounded intelligence against ungrounded vanilla LLM hallucinations.

---

## 2. System Architecture & Agent State Machine

### 2.1 High-Level System Architecture

```mermaid
flowchart TD
    subgraph Client["Client Layer (Next.js 14 App Router)"]
        Wizard["Studio Intake Wizard\n(Category, Cultural Anchors, Collab Targets)"]
        DebateStream["Live Multi-Agent Debate View\n(SSE Real-Time Thought Stream)"]
        CRMBoard["Brand CRM Board\n(Kanban Pipeline, Pitch Editor, Deal Sizing)"]
        ProofView["Side-by-Side Proof Engine\n(Qloo Grounded vs. Vanilla LLM)"]
        HybridStore["Hybrid Browser Persistence\n(IndexedDB / LocalStorage)"]
    end

    subgraph Server["Serverless Edge & API Layer (Next.js Routes)"]
        Orchestrator["Agentic Council Orchestrator\n(Vercel AI SDK Core)"]
        QlooClient["Secure Qloo Gateway\n(Cache, Rate-Limiter & Error Circuit Breaker)"]
        LLMAdapter["Multi-Provider LLM Gateway\n(Gemini 1.5 Pro / SumoPod / OpenAI)"]
        WebhookDispatcher["CRM Dispatch Engine\n(HubSpot / Notion / Custom Webhook)"]
    end

    subgraph External["External Services & APIs"]
        QlooAPI["Qloo Taste AI™ API\n(250M+ Entity Taste Graph)"]
        ModelEndpoints["LLM Inference Providers\n(Google GenAI / SumoPod / OpenAI)"]
        TargetCRMs["External Endpoints\n(Webhooks, Notion API, HubSpot)"]
    end

    Wizard --> Orchestrator
    Orchestrator --> QlooClient
    Orchestrator --> LLMAdapter
    QlooClient --> QlooAPI
    LLMAdapter --> ModelEndpoints
    Orchestrator --> DebateStream
    DebateStream --> CRMBoard
    CRMBoard --> ProofView
    CRMBoard --> HybridStore
    CRMBoard --> WebhookDispatcher
    WebhookDispatcher --> TargetCRMs
```

### 2.2 Multi-Agent Debate State Machine

```mermaid
stateDiagram-v2
    [*] --> IntakeSubmitted: User completes Studio Wizard
    IntakeSubmitted --> EntityResolution: Extract anchors & resolve entities
    
    state "Multi-Agent Council Loop" as Council {
        EntityResolution --> CulturalAnalysis: Cultural Analyst queries Qloo Taste Graph
        CulturalAnalysis --> BrandCritique: Brand Strategist evaluates market sizing & brand safety
        BrandCritique --> CreativeDirection: Creative Director designs physical collab concept
        
        state DebateCheck <<choice>>
        CreativeDirection --> DebateCheck
        DebateCheck --> CulturalAnalysis: Conflict detected (Affinity too low or unsafe)
        DebateCheck --> CouncilConsensus: Synergy Score >= 85% reached
    }

    CouncilConsensus --> CardGeneration: Synthesize Brand CRM Cards
    CardGeneration --> ProofGeneration: Run counter-factual vanilla LLM query
    ProofGeneration --> CRMReady: Populate Interactive Kanban Board
    CRMReady --> [*]
```

---

## 3. Data Architecture & Entity Relationship Diagram (ERD)

### 3.1 Entity Relationship Diagram

```mermaid
erDiagram
    CREATOR_PROFILE ||--o{ CULTURAL_ANCHOR : "declares"
    CREATOR_PROFILE ||--o{ DEBATE_SESSION : "initiates"
    DEBATE_SESSION ||--o{ DEBATE_TURN : "contains"
    DEBATE_SESSION ||--o{ BRAND_TARGET_CARD : "generates"
    BRAND_TARGET_CARD ||--|| COLLAB_PRODUCT_CONCEPT : "defines"
    BRAND_TARGET_CARD ||--|| OUTREACH_PITCH : "produces"
    BRAND_TARGET_CARD ||--o{ DISPATCH_WEBHOOK_LOG : "triggers"
    BRAND_TARGET_CARD ||--o{ QLOO_ENTITY_SIGNAL : "backed_by"

    CREATOR_PROFILE {
        string id PK
        string name
        string handle
        string category "Gaming | Podcast | Music | Art | Tech"
        string audience_summary
        string primary_vibe
        datetime created_at
    }

    CULTURAL_ANCHOR {
        string id PK
        string creator_id FK
        string domain "music | film | fashion | dining | literature"
        string entity_name
        string qloo_entity_id "Resolved Qloo ID"
        float confidence_weight
    }

    DEBATE_SESSION {
        string id PK
        string creator_id FK
        string status "running | consensus_reached | failed"
        float overall_cultural_synergy_score
        int turns_count
        datetime started_at
        datetime completed_at
    }

    DEBATE_TURN {
        string id PK
        string session_id FK
        int turn_index
        string agent_role "Cultural_Analyst | Brand_Strategist | Creative_Director"
        string thought_reasoning
        string message_content
        json tool_calls
        datetime timestamp
    }

    BRAND_TARGET_CARD {
        string id PK
        string session_id FK
        string brand_name
        string brand_domain "Apparel | Beverage | Tech | Living"
        string pipeline_stage "Discovered | Vetted | Pitch_Ready | Dispatched"
        float qloo_affinity_score "0.00 to 10.00x baseline"
        float demographic_overlap_pct
        string estimated_deal_tier "Micro ($2k-$5k) | Mid ($5k-$20k) | High ($20k-$50k+)"
        datetime updated_at
    }

    COLLAB_PRODUCT_CONCEPT {
        string id PK
        string brand_card_id FK
        string product_title
        string format "Limited Drop | Capsule | Co-Branded Packaging"
        string aesthetic_description
        string packaging_spec
        float target_retail_price
    }

    OUTREACH_PITCH {
        string id PK
        string brand_card_id FK
        string subject_line
        string hook_statement
        string data_grounding_paragraph "Qloo empirical proof statement"
        string call_to_action
        string vanilla_llm_comparison "Ungrounded alternative comparison"
    }

    DISPATCH_WEBHOOK_LOG {
        string id PK
        string brand_card_id FK
        string target_service "HubSpot | Notion | Custom_Webhook"
        string endpoint_url
        string payload_json
        int response_status
        datetime dispatched_at
    }

    QLOO_ENTITY_SIGNAL {
        string id PK
        string brand_card_id FK
        string source_entity_id
        string target_entity_id
        float affinity_metric
        string cross_domain_path "e.g. Synthwave -> Japanese Indigo Denim"
    }
```

### 3.2 Data Persistence Strategy: The Frictionless Hybrid Model
1. **Zero-Login Judge Evaluation (Client-First):**
   - The application boots with zero barrier to entry. State is immediately initialized in browser storage (`IndexedDB` via `idb-keyval` or `localStorage`).
   - Judges can test custom profiles, re-run debates, drag cards across Kanban stages, and refresh the browser without losing their generated data.
2. **Deterministic Pre-Seed Profiles:**
   - 3 pre-built creator archetypes (*"Neo-Tokyo Cyberpunk Indie Studio"*, *"Lo-Fi Botanical Wellness Podcast"*, *"Vintage Vinyl & Analog Camera Creator"*) are cached locally for instantaneous, latency-free evaluation.
3. **Export & Portability:**
   - Single-click export of the entire session into clean Markdown dossier or structured JSON.
   - Ready-to-connect Prisma/PostgreSQL schema included in the codebase for enterprise deployment.

---

## 4. The 6-Agent Skill Protocol & Tool Calling Schema

Venture Pulse utilizes a modular tool-calling architecture conforming to modern 2026 AI-Native agent standards.

```mermaid
flowchart LR
    Orchestrator["Council Orchestrator"] --> S1["Skill 1: qloo_taste_explorer"]
    Orchestrator --> S2["Skill 2: market_feasibility_validator"]
    Orchestrator --> S3["Skill 3: creative_concept_synthesizer"]
    Orchestrator --> S4["Skill 4: pitch_architect"]
    Orchestrator --> S5["Skill 5: vanilla_llm_counter_proof"]
    Orchestrator --> S6["Skill 6: crm_webhook_dispatcher"]
```

### Skill 1: `qloo_taste_explorer`
* **Purpose:** Interfaces with Qloo's API to resolve input entities and discover cross-domain brand affinities.
* **Input Schema:**
  ```json
  {
    "anchor_entities": ["str"],
    "target_domains": ["brand", "fashion", "food_beverage", "consumer_tech"],
    "min_affinity_threshold": 0.65
  }
  ```
* **Output:** Ranked array of verified cultural entities, cross-category affinity scores, and bridge correlation paths.

### Skill 2: `market_feasibility_validator`
* **Purpose:** Evaluates brand partnership feasibility, brand safety, sponsor tiers, and realistic commercial deal sizing.
* **Input Schema:**
  ```json
  {
    "brand_name": "str",
    "creator_category": "str",
    "creator_audience_size_tier": "nano | micro | mid | macro"
  }
  ```
* **Output:** Feasibility index (0-100), deal sizing tier ($2k–$50k+), category exclusivity conflicts, and brand safety flags.

### Skill 3: `creative_concept_synthesizer`
* **Purpose:** Merges the creator's aesthetic with the target brand's heritage into a tangible physical collaboration concept.
* **Input Schema:**
  ```json
  {
    "creator_vibe": "str",
    "brand_name": "str",
    "cultural_intersection_tags": ["str"]
  }
  ```
* **Output:** Product title, physical packaging aesthetic, materials palette, limited-drop mechanics, and retail price bracket.

### Skill 4: `pitch_architect`
* **Purpose:** Generates high-converting, personalized cold outreach emails backed by statistical Qloo citations.
* **Input Schema:**
  ```json
  {
    "target_brand": "str",
    "product_concept": "object",
    "qloo_affinity_stat": "str"
  }
  ```
* **Output:** Subject line, executive hook, empirical proof paragraph, and collaboration proposal.

### Skill 5: `vanilla_llm_counter_proof`
* **Purpose:** Executes an ungrounded counter-factual prompt to illustrate to the judges what generic AI suggests vs. Qloo.
* **Input Schema:**
  ```json
  {
    "creator_description": "str"
  }
  ```
* **Output:** Generic/cliché LLM output (e.g. coffee mug, generic logo tee) with comparative analysis highlighting the difference.

### Skill 6: `crm_webhook_dispatcher`
* **Purpose:** Dispatches the finalized brand cards and pitch drafts to external workflows (HubSpot, Notion, or custom webhook).
* **Input Schema:**
  ```json
  {
    "target_service": "hubspot | notion | custom_webhook",
    "webhook_url": "str",
    "card_payload": "object"
  }
  ```
* **Output:** Dispatch status, timestamp, request/response payload log.

---

## 5. Security, Privacy & API Key Protection

To guarantee production security and protect hackathon credentials:

### 5.1 Architecture-Level Key Isolation
1. **Zero Client Exposure:**
   - `QLOO_API_KEY` and all LLM keys (`GEMINI_API_KEY`, `OPENAI_API_KEY`, etc.) reside strictly within the serverless environment (`process.env`).
   - Next.js server actions and API route handlers act as an isolated proxy. No private key is ever bundled into client-side JavaScript.
2. **Strict Git Guardian Protocol:**
   - `.gitignore` explicitly blocks all `.env`, `.env.local`, `.env.*.local`, and credential files.
   - Pre-commit hygiene ensures no API keys or Bearer tokens ever enter source control.
3. **Runtime In-Memory Secrets:**
   - Keys supplied via UI for custom testing are stored exclusively in memory during the active session and never logged to telemetry or disk.

### 5.2 Resilient API Gateway & Rate-Limit Circuit Breaker
- **Taste Graph Response Cache:** Qloo entity resolution and affinity queries are cached in an in-memory/KV cache with a 24-hour TTL, preventing redundant API calls and conserving rate limits.
- **Graceful Mock Fallback Mode:** If external API rate limits are exhausted during live judging, the gateway seamlessly fails over to high-fidelity cached cultural clusters, ensuring the demo never crashes or shows a broken state.

---

## 6. 2026 AI-Native Best Practices Checklist

| Best Practice | How Venture Pulse Implements It |
| :--- | :--- |
| **Deterministic Cultural Grounding** | Replaces stochastic hallucination with empirical graph edges from Qloo's 250M+ entity graph. |
| **Multi-Agent Deliberation & Self-Correction** | 3 specialized personas (Cultural Analyst, Brand Strategist, Creative Director) debate and cross-validate before outputting recommendations. |
| **Real-Time Streaming States (SSE)** | Live thought tokens and tool-call indicators stream to the user in real time for total observability. |
| **Strict JSON Schema Enforcement** | All agent tool inputs and outputs are validated via Zod schemas, eliminating malformed outputs. |
| **Action-Oriented Agency** | The agent doesn't just offer conversational advice; it writes specs, stages CRM cards, and dispatches real webhooks. |
| **Frictionless Zero-Login UX** | Judges can experience 100% of the platform instantly without account creation friction. |

---

## 7. Sprint Roadmap & Implementation Plan

```mermaid
gantt
    title Venture Pulse Implementation Roadmap
    dateFormat  YYYY-MM-DD
    section Phase 1: Foundation
    Next.js 14 Scaffold & Tailwind Setup       :done,    p1_1, 2026-10-29, 1d
    Qloo API Gateway & Security Caching Layer  :active,  p1_2, 2026-10-29, 1d
    section Phase 2: Agentic Engine
    6-Skill Tool Definitions & Zod Schemas     :         p2_1, 2026-10-30, 1d
    Multi-Agent Debate Council Orchestrator    :         p2_2, 2026-10-30, 1d
    section Phase 3: UI & Experience
    3-Step Studio Wizard & Pre-Seed Profiles   :         p3_1, 2026-10-31, 1d
    Interactive Brand CRM Kanban Board         :         p3_2, 2026-10-31, 1d
    Side-by-Side 'Proof of Difference' Engine  :         p3_3, 2026-11-01, 1d
    section Phase 4: Polish & Deployment
    Webhook Dispatcher & Export Functionality  :         p4_1, 2026-11-01, 1d
    Vercel Deployment & Public Repo Polish     :         p4_2, 2026-11-02, 1d
```

### Phase-by-Phase Deliverables:
- **Phase 1: Foundation & Security Setup**
  - Initialize Next.js 14 project with TypeScript, Tailwind CSS, Lucide icons, and Shadcn UI components.
  - Implement protected `.env.local` configuration and the secure Qloo API client with rate-limit caching.
- **Phase 2: Multi-Agent Council & Tool Protocol**
  - Implement the 6 specialized agent skills using Vercel AI SDK Core.
  - Construct the streaming Multi-Agent Debate engine (Analyst $\leftrightarrow$ Strategist $\leftrightarrow$ Director).
- **Phase 3: Studio Wizard & Brand CRM Kanban UI**
  - Build the 3-step Studio Intake Wizard with quick-fill sample presets.
  - Build the real-time debate visualizer and the interactive Drag-and-Drop Brand CRM Board.
  - Build the "Proof Engine" split view comparing vanilla LLM output vs. Qloo-grounded data.
- **Phase 4: Webhook Dispatch, Export & Vercel Deployment**
  - Wire the autonomous webhook dispatcher (HubSpot/Notion simulation).
  - Deploy to Vercel and generate public, live testing URL.
  - Publish public repository with MIT License and submission write-up.
