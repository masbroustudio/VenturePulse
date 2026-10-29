# Venture Pulse — Technical Architecture Specification
**Next-Generation Multi-Agent Cultural Intelligence Engine**

---

## 1. System Overview & Core Paradigms

Venture Pulse is built on four core architectural principles designed for the 2026 AI-native landscape:

1. **Deterministic Cultural Grounding:** Eliminates parametric LLM guesswork by querying Qloo's 250M+ entity graph before creative synthesis begins.
2. **Multi-Agent Deliberation:** Splits complex commercial reasoning into three specialized, adversarial personas that debate and self-correct.
3. **Low-Latency Streaming Execution:** Streams agent thoughts, tool execution flags, and state transitions via Server-Sent Events (SSE) so users see active reasoning in real time.
4. **Frictionless Hybrid Persistence:** Keeps state instantly responsive in browser storage (IndexedDB/LocalStorage) while maintaining relational schema compatibility for enterprise backends.

---

## 2. End-to-End Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor User as Creator / Judge
    participant UI as Next.js Client (UI / Wizard)
    participant Orch as Agentic Council Orchestrator
    participant Qloo as Qloo Gateway & Cache
    participant LLM as Multi-Provider LLM Engine
    participant Store as Hybrid Persistence (IndexedDB)
    participant CRM as External Webhook (HubSpot/Notion)

    User->>UI: Submit Studio Intake Wizard (Anchors, Category, Targets)
    UI->>Orch: POST /api/debate/start (Session Payload)
    
    rect rgb(240, 248, 255)
        note over Orch,Qloo: Phase 1: Entity Resolution & Taste Graph Exploration
        Orch->>Qloo: resolveEntities(anchors)
        Qloo-->>Orch: Resolved Qloo IDs
        Orch->>Qloo: fetchAffinityGraph(resolvedIDs, targetDomains)
        Qloo-->>Orch: Ranked Entity Affinity Clusters (Multipliers, Confidence)
    end

    rect rgb(255, 245, 238)
        note over Orch,LLM: Phase 2: Multi-Agent Council Debate (SSE Stream)
        Orch->>UI: Stream Event: Turn 1 (Cultural Analyst: Initial Affinities)
        Orch->>LLM: Prompt Brand Strategist (Analyze Market Feasibility & Sizing)
        LLM-->>Orch: Strategist Critique (Brand Safety Check, Deal Tiers)
        Orch->>UI: Stream Event: Turn 2 (Brand Strategist: Critique)
        Orch->>LLM: Prompt Creative Director (Synthesize Product Collab Concept)
        LLM-->>Orch: Director Concept (Packaging, Aesthetic, Drop Format)
        Orch->>UI: Stream Event: Turn 3 (Creative Director: Blueprint)
        Orch->>UI: Stream Event: Council Consensus Reached
    end

    rect rgb(245, 255, 250)
        note over Orch,LLM: Phase 3: Synthesis, Proof Generation & Storage
        par Generate CRM Cards
            Orch->>LLM: Synthesize Structured BrandTargetCards
            LLM-->>Orch: Array<BrandTargetCard>
        and Generate Counter-factual Proof
            Orch->>LLM: Generate Ungrounded Vanilla LLM Output
            LLM-->>Orch: Vanilla Cliché Output
        end
        Orch-->>UI: Full Session Payload (Cards, Pitches, Proof)
        UI->>Store: Save Session & Cards to IndexedDB
    end

    User->>UI: Drag Card to "Pitch Ready" & Edit Pitch
    UI->>Store: Update Card Stage
    User->>UI: Click "Dispatch to CRM"
    UI->>Orch: POST /api/dispatch (Card ID, Webhook Target)
    Orch->>CRM: HTTP POST Payload
    CRM-->>Orch: 200 OK (Dispatched)
    Orch-->>UI: Webhook Confirmation Log
```

---

## 3. Component Architecture Breakdown

```mermaid
flowchart TD
    subgraph Browser["Browser Client (React 18 / Next.js 14)"]
        WizardComponent["Studio Wizard\n(/components/wizard)"]
        DebateStreamView["Council Debate Terminal\n(/components/debate)"]
        KanbanBoard["Interactive Brand CRM Board\n(/components/crm)"]
        ProofComparison["Side-by-Side Proof Modal\n(/components/proof)"]
        LocalClientDB["IndexedDB Storage Adapter\n(/lib/storage/hybrid-store.ts)"]
    end

    subgraph API["Next.js Route Handlers (/app/api)"]
        DebateRoute["/api/debate/route.ts\n(SSE Streaming Handler)"]
        QlooProxyRoute["/api/qloo/route.ts\n(Cached Taste Gateway)"]
        DispatchRoute["/api/dispatch/route.ts\n(Webhook Dispatcher)"]
        ExportRoute["/api/export/route.ts\n(PDF / Markdown Compiler)"]
    end

    subgraph Core["Agentic Engine Core (/lib/agent)"]
        CouncilOrchestrator["CouncilOrchestrator.ts\n(State Machine & Turn Manager)"]
        SkillRegistry["SkillRegistry.ts\n(Tool Calling Execution)"]
        QlooClientLib["QlooClient.ts\n(Rate-Limiting & In-Memory KV)"]
        LLMProviderLib["LLMGateway.ts\n(Gemini / OpenAI / SumoPod Adapter)"]
    end

    WizardComponent -->|POST /api/debate| DebateRoute
    DebateRoute --> CouncilOrchestrator
    CouncilOrchestrator --> SkillRegistry
    SkillRegistry --> QlooClientLib
    SkillRegistry --> LLMProviderLib
    DebateRoute -.->|SSE Stream| DebateStreamView
    DebateStreamView --> KanbanBoard
    KanbanBoard --> LocalClientDB
    KanbanBoard -->|POST /api/dispatch| DispatchRoute
```

---

## 4. Latency & Streaming Strategy

To provide an immediate, engaging experience for evaluators and users:

1. **Server-Sent Events (SSE) Streaming:**
   The multi-agent debate uses Vercel AI SDK Core’s `createDataStreamResponse` protocol. As each sub-agent outputs its reasoning tokens and tool invocations, chunks are transmitted instantaneously over a single persistent HTTP connection.
2. **Predictive Qloo Prefetching:**
   When the user selects an input archetype in the wizard, Qloo entity lookups and affinity pre-fetches are initiated asynchronously in the background. By the time the user hits "Launch Council Debate", initial entity resolution is already warm in cache.
3. **Parallel Output Synthesis:**
   Once council consensus is reached, the generation of the structured CRM cards and the ungrounded vanilla LLM comparison occurs in parallel via `Promise.all()`, shaving 3–5 seconds off total generation time.

---

## 5. Resilience, Caching & Fallback Architecture

To ensure the demo **never breaks during a live hackathon evaluation**, Venture Pulse incorporates a three-tiered resilience model:

```mermaid
flowchart TD
    Req["Incoming Taste Request"] --> CheckCache{"Cached in Memory\n(24h TTL)?"}
    CheckCache -- Yes --> ServeCache["Return Cached Entity Affinity"]
    CheckCache -- No --> CallLive["Call Live Qloo API"]
    CallLive --> CheckStatus{"API Response\nStatus?"}
    CheckStatus -- 200 OK --> CacheAndReturn["Cache Response & Return"]
    CheckStatus -- 429 Rate Limit / Error --> CircuitBreaker{"Circuit Breaker\nActive?"}
    CircuitBreaker -- Yes --> SeedFallback["Serve High-Fidelity Seed Fallback"]
    CircuitBreaker -- No --> RetryWithBackoff["Exponential Backoff Retry (Max 2)"]
    RetryWithBackoff --> CallLive
```

* **Tier 1 (In-Memory Hot Cache):** Prevents repeated external requests for identical creator anchors.
* **Tier 2 (Exponential Backoff):** Retries transient rate-limit (HTTP 429) spikes with jittered delay.
* **Tier 3 (Seed Fallback Safety Net):** If Qloo credentials are temporarily unavailable or rate limits are exceeded during judging, high-fidelity verified taste graph clusters are served seamlessly with an indicator badge, guaranteeing an uninterrupted demo.
