# Venture Pulse — Technical Architecture Specification
**LangGraph State Machine, Adversarial Consensus Loop, Supabase pgvector & Observability**

---

## 1. System Overview & Core Paradigms

Venture Pulse is built on five core architectural principles designed for the 2026 AI-native landscape:

1. **Deterministic Cultural Grounding:** Eliminates parametric LLM guesswork by querying Qloo's 250M+ entity Taste Graph (`hackathon.api.qloo.com`) before creative synthesis begins.
2. **Adversarial 2-Cycle LangGraph Multi-Agent Deliberation:** Coordinates specialized adversarial sub-agents (Cultural Analyst, Brand Strategist, Creative Director) within a cyclic state graph that enforces strict consensus criteria ($\ge 85\%$). Cycle 1 features explicit critique and rejection of budget or brand-safety mismatches, driving Cycle 2 refinement with anti-affinity guardrails.
3. **Bidirectional Orchestration:** Dynamically pivots between **Creator Mode** (Creator $\rightarrow$ Brands & Products) and **Brand Counter-Discovery Mode** (Brand $\rightarrow$ Untapped Subcultural Communities).
4. **Interactive Unit Economics & HTML5 CRM Pipeline:** Real-time financial calculations (GMV, royalties, sponsor fees) coupled with persistent drag-and-drop Kanban state.
5. **Observability, Vector Search & AI Evaluation:** Full telemetry via **LangFuse**, semantic similarity embeddings in **Supabase (PostgreSQL + pgvector)**, and quantitative quality benchmarks via **DeepEval / Ragas**.

---

## 2. End-to-End Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor User as Creator / Brand Evaluator
    participant UI as Next.js 15 Client (A24 Editorial UI)
    participant LG as LangGraph Council Orchestrator
    participant Qloo as Qloo Gateway (hackathon.api.qloo.com)
    participant LLM as Multi-Provider LLM (Gemini 2.x / OpenAI)
    participant Supa as Supabase (PostgreSQL + pgvector)
    participant Fuse as LangFuse Observability

    User->>UI: Submit Studio Intake / Select Preset (Mode: Creator | Brand)
    UI->>LG: POST /api/debate/start (Session Payload)
    LG->>Fuse: Start Trace (Session ID, User Profile)
    
    rect rgb(240, 248, 255)
        note over LG,Qloo: Phase 1: Entity Resolution & Multi-Hop Taste Graph Traversal
        LG->>Qloo: search_entities(anchors) & find_tags()
        Qloo-->>LG: Resolved Qloo URNs & Taxonomy Tags
        LG->>Qloo: insights(resolvedIDs, targetCategories, excludedTags)
        Qloo-->>LG: Ranked Entity Affinity Clusters (Multipliers, Multi-Hop Paths, Anti-Signals)
        LG->>Fuse: Log Tool: Qloo Insights & Latency
    end

    rect rgb(255, 245, 238)
        note over LG,LLM: Phase 2: Adversarial Multi-Agent Debate (SSE Streaming)
        LG->>UI: Stream Turn 1 (Cultural Analyst: Initial Candidates)
        LG->>LLM: Run Brand Strategist (Market Sizing & Safety Audit)
        LLM-->>LG: Strategist Rejection (Synergy 71% < 85% - Tier/Saturation Conflict)
        LG->>UI: Stream Turn 2 (Brand Strategist: Cycle 1 Rejection Event)
        note over LG,Qloo: Cycle 2 Loopback: Cultural Analyst applies anti-affinity guardrails
        LG->>Qloo: insights(refinedFilter, excluded_tags)
        Qloo-->>LG: Refined Shortlist (94% Synergy)
        LG->>UI: Stream Turn 3 (Cultural Analyst: Cycle 2 Convergence)
        User->>UI: (Optional) Inject Founder Constraint mid-debate
        UI->>LG: POST /api/debate/inject-constraint
        LG->>LLM: Run Creative Director (Synthesize Product Collab & Adapt Constraints)
        LLM-->>LG: Director Concept (Packaging, Pricing, Unit Economics)
        LG->>UI: Stream Turn 4 (Creative Director: Capsule Blueprint & Consensus Reached)
    end

    rect rgb(245, 255, 250)
        note over LG,Supa: Phase 3: Vector Embeddings & Supabase Persistence
        LG->>LLM: Generate Vector Embeddings (1536-dim)
        LLM-->>LG: Vectors
        LG->>Supa: INSERT INTO brand_target_cards + pgvector embeddings
        Supa-->>LG: Persisted UUIDs
        LG->>Fuse: End Trace (Token Usage, Latency, DeepEval Score)
        LG-->>UI: Complete Session Payload (Cards, Pitches, Unit Economics)
    end

    User->>UI: Drag Card to "Pitch Ready" & Click "Dispatch to CRM"
    UI->>LG: POST /api/dispatch (Card ID, Target Service)
    LG->>Supa: UPDATE brand_target_cards SET pipeline_stage = 'Dispatched'
    LG-->>UI: Webhook Confirmation Log (200 OK)
```

---

## 3. LangGraph Agent State Machine (Cyclic Consensus Loop)

```mermaid
stateDiagram-v2
    [*] --> IntakeNode: Studio / Brand Profile Submitted
    IntakeNode --> QlooTasteNode: Query Qloo API (/v2/search & /v2/insights)
    
    state "LangGraph Multi-Agent Consensus Loop" as CouncilGraph {
        QlooTasteNode --> AnalystNode: Cultural Analyst evaluates taste graph
        AnalystNode --> StrategistNode: Brand Strategist checks feasibility & deal sizing
        
        state ConsensusDecision <<choice>>
        StrategistNode --> ConsensusDecision
        ConsensusDecision --> Cycle2Refinement: Synergy < 85% (Cycle 1 Conflict / Rejection)
        Cycle2Refinement --> AnalystNode: Re-query Qloo with negative anti-affinity tags
        
        ConsensusDecision --> DirectorNode: Synergy >= 85% (Approved candidate shortlist)
        DirectorNode --> HumanInterventionNode: Check for Founder constraints
        HumanInterventionNode --> DirectorNode: Adapt BOM specs & pricing
    }

    DirectorNode --> DeepEvalNode: Run DeepEval / Ragas Groundedness Benchmark
    DeepEvalNode --> SupabasePersistenceNode: Save Cards & Embeddings to Supabase
    SupabasePersistenceNode --> KanbanReady: Populate Actionable CRM Board
    KanbanReady --> [*]
```

---

## 4. Component Architecture Breakdown

```mermaid
flowchart TD
    subgraph Client["Next.js 15 Client Layer (Vercel)"]
        Wizard["Studio & Taste Graph Visualizer\n(/components/wizard)"]
        DebateStreamView["Council Debate Terminal\n(/components/debate)"]
        KanbanBoard["Brand CRM Board\n(/components/crm)"]
        ProofComparison["Side-by-Side Proof Modal\n(/components/proof)"]
        UnitEconModal["Lookbook & Unit Economics\n(/components/lookbook)"]
    end

    subgraph ServerlessEdge["Next.js Route Handlers (Vercel Edge)"]
        DebateRoute["/api/debate/route.ts\n(SSE Streaming Handler)"]
        DispatchRoute["/api/dispatch/route.ts\n(Webhook Dispatcher)"]
        ExportRoute["/api/export/route.ts\n(Markdown Dossier Compiler)"]
    end

    subgraph Engine["LangGraph & Agent Engine (/lib/agent)"]
        GraphOrchestrator["LangGraphCouncil.ts\n(StateGraph Definition)"]
        QlooClientLib["QlooClient.ts\n(hackathon.api.qloo.com Gateway)"]
        LLMProviderLib["LLMGateway.ts\n(Gemini 2.x / OpenAI / SumoPod)"]
        DeepEvalTester["AgentEvaluator.ts\n(Groundedness & Faithfulness)"]
    end

    subgraph DataObservability["Cloud Data & Observability"]
        SupabaseDB["Supabase PostgreSQL + pgvector\n(Profiles, Cards, Embeddings)"]
        LangFuseTrace["LangFuse Cloud\n(Traces, Latency, Token Costs)"]
    end

    Wizard -->|POST /api/debate| DebateRoute
    DebateRoute --> GraphOrchestrator
    GraphOrchestrator --> QlooClientLib
    GraphOrchestrator --> LLMProviderLib
    GraphOrchestrator --> DeepEvalTester
    GraphOrchestrator --> SupabaseDB
    GraphOrchestrator --> LangFuseTrace
    DebateRoute -.->|SSE Stream| DebateStreamView
    DebateStreamView --> KanbanBoard
    KanbanBoard --> UnitEconModal
    KanbanBoard -->|POST /api/dispatch| DispatchRoute
```

---

## 5. Latency, Resilience & Fallback Strategy

* **In-Memory Cache (LRU / 24-hour TTL):** All entity lookups and affinity results are hashed. Repeated lookups return in $< 5\text{ms}$.
* **HTTP 429 Exponential Backoff:** Automatically retries transient rate-limit spikes with jittered exponential delay ($500\text{ms}$, $1500\text{ms}$).
* **HTTP 422 Strict Schema Handling:** Sanitizes payloads to prevent schema mismatch errors from Qloo's API.
* **Dual-Header Authentication:** Dispatches both `Authorization: Bearer <KEY>` and `X-Api-Key: <KEY>` to ensure seamless operation across hackathon proxies and direct production endpoints.
* **High-Fidelity Pre-Seed Fallback:** 3 verified cultural profiles (*"Cyberpunk Indie Studio"*, *"Lo-Fi Botanical Podcast"*, *"Vintage Film Photographer"*) plus Brand Mode profiles ensure 100% uninterrupted judging uptime.
