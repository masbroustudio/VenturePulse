# Venture Pulse — Technical Architecture Specification
**LangGraph State Machine, Supabase pgvector, Observability & Evaluation**

---

## 1. System Overview & Core Paradigms

Venture Pulse is built on four core architectural principles designed for the 2026 AI-native landscape:

1. **Deterministic Cultural Grounding:** Eliminates parametric LLM guesswork by querying Qloo's 600M+ entity graph (`hackathon.api.qloo.com`) before creative synthesis begins.
2. **LangGraph Multi-Agent Deliberation:** Coordinates specialized adversarial sub-agents (Cultural Analyst, Brand Strategist, Creative Director) within a cyclic state graph that enforces consensus criteria.
3. **Low-Latency Streaming Execution:** Streams agent reasoning tokens and tool invocations via Server-Sent Events (SSE) so users observe decisions in real time.
4. **Supabase PostgreSQL + pgvector Persistence:** Persistent relational storage with vector embeddings for semantic brand similarity matching.
5. **Observability & Evaluation:** Complete telemetry via **LangFuse** and quantitative evaluation scores via **DeepEval / Ragas**.

---

## 2. End-to-End Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor User as Creator / Judge
    participant UI as Next.js 15 Client (A24 Editorial UI)
    participant LG as LangGraph Council Orchestrator
    participant Qloo as Qloo Gateway (hackathon.api.qloo.com)
    participant LLM as Multi-Provider LLM (Gemini 2.x / OpenAI)
    participant Supa as Supabase (PostgreSQL + pgvector)
    participant Fuse as LangFuse Observability

    User->>UI: Submit Studio Intake Wizard (Anchors, Category, Targets)
    UI->>LG: POST /api/debate/start (Session Payload)
    LG->>Fuse: Start Trace (Session ID, User Profile)
    
    rect rgb(240, 248, 255)
        note over LG,Qloo: Phase 1: Entity Resolution & Taste Graph Exploration
        LG->>Qloo: search_entities(anchors) & find_tags()
        Qloo-->>LG: Resolved Qloo IDs & Taxonomy Tags
        LG->>Qloo: insights(resolvedIDs, targetCategories)
        Qloo-->>LG: Ranked Entity Affinity Clusters (Multipliers, Overlaps)
        LG->>Fuse: Log Tool: Qloo Insights & Latency
    end

    rect rgb(255, 245, 238)
        note over LG,LLM: Phase 2: LangGraph Multi-Agent Council Debate (SSE Stream)
        LG->>UI: Stream Event: Turn 1 (Cultural Analyst: Affinities)
        LG->>LLM: Run Brand Strategist (Market Sizing & Brand Safety)
        LLM-->>LG: Strategist Critique (Budget Tiers, Safety Check)
        LG->>UI: Stream Event: Turn 2 (Brand Strategist: Critique)
        LG->>LLM: Run Creative Director (Synthesize Product Collab)
        LLM-->>LG: Director Concept (Packaging, Aesthetic, Drop Format)
        LG->>UI: Stream Event: Turn 3 (Creative Director: Blueprint)
        LG->>UI: Stream Event: Council Consensus Reached
    end

    rect rgb(245, 255, 250)
        note over LG,Supa: Phase 3: Vector Embeddings & Supabase Persistence
        LG->>LLM: Generate Vector Embeddings (1536-dim)
        LLM-->>LG: Vectors
        LG->>Supa: INSERT INTO brand_target_cards + pgvector embeddings
        Supa-->>LG: Persisted UUIDs
        LG->>Fuse: End Trace (Token Usage, Latency, Eval Score)
        LG-->>UI: Complete Session Payload (Cards, Pitches, Proof)
    end

    User->>UI: Drag Card to "Pitch Ready" & Click "Dispatch to CRM"
    UI->>LG: POST /api/dispatch (Card ID, Webhook Target)
    LG->>Supa: UPDATE brand_target_cards SET pipeline_stage = 'Dispatched'
    LG-->>UI: Webhook Confirmation Log
```

---

## 3. LangGraph Agent State Machine

```mermaid
stateDiagram-v2
    [*] --> IntakeNode: Studio Wizard Submitted
    IntakeNode --> QlooTasteNode: Query Qloo API (search & insights)
    
    state "LangGraph Multi-Agent Loop" as CouncilGraph {
        QlooTasteNode --> AnalystNode: Cultural Analyst evaluates taste graph
        AnalystNode --> StrategistNode: Brand Strategist checks feasibility & deal size
        StrategistNode --> DirectorNode: Creative Director crafts product & pitch
        
        state ConsensusDecision <<choice>>
        DirectorNode --> ConsensusDecision
        ConsensusDecision --> AnalystNode: Synergy < 85% (Iterate & re-evaluate)
        ConsensusDecision --> EvaluationNode: Synergy >= 85% (Consensus reached)
    }

    EvaluationNode --> DeepEvalNode: Run DeepEval / Ragas Groundedness Check
    DeepEvalNode --> SupabasePersistenceNode: Save Cards & Embeddings to Supabase
    SupabasePersistenceNode --> KanbanReady: Stream Cards to Client UI
    KanbanReady --> [*]
```

---

## 4. Component Architecture Breakdown

```mermaid
flowchart TD
    subgraph Client["Next.js 15 Client Layer (Vercel)"]
        Wizard["Studio Wizard\n(/components/wizard)"]
        DebateStreamView["Council Debate Terminal\n(/components/debate)"]
        KanbanBoard["Brand CRM Board\n(/components/crm)"]
        ProofComparison["Side-by-Side Proof Modal\n(/components/proof)"]
    end

    subgraph ServerlessEdge["Next.js Route Handlers (Vercel Edge)"]
        DebateRoute["/api/debate/route.ts\n(SSE Streaming Handler)"]
        DispatchRoute["/api/dispatch/route.ts\n(Webhook Dispatcher)"]
        ExportRoute["/api/export/route.ts\n(PDF / Markdown Compiler)"]
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
    KanbanBoard -->|POST /api/dispatch| DispatchRoute
```

---

## 5. Latency, Resilience & Fallback Strategy

* **In-Memory Cache (LRU / 24-hour TTL):** All entity lookups and affinity results are hashed. Repeated lookups return in $< 5\text{ms}$.
* **HTTP 429 Exponential Backoff:** Automatically retries transient rate-limit spikes with jittered exponential delay.
* **HTTP 422 Strict Schema Handling:** Sanitizes payloads to prevent schema mismatch errors from Qloo's API.
* **Pre-Seed Demonstration Cache:** 3 verified cultural profiles (*"Cyberpunk Indie Studio"*, *"Lo-Fi Botanical Podcast"*, *"Vintage Film Photographer"*) are locally cached for instant, zero-latency evaluation.
