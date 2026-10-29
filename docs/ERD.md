# Venture Pulse — Entity Relationship Diagram & Data Models
**Relational Schema, PostgreSQL + pgvector Migration & TypeScript Interfaces**

---

## 1. Entity Relationship Diagram (ERD)

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
        uuid id PK
        string name
        string handle
        string category
        text audience_summary
        string primary_vibe
        string mode "creator | brand_counter_discovery"
        vector embedding "vector(1536) for semantic matching"
        timestamptz created_at
    }

    CULTURAL_ANCHOR {
        uuid id PK
        uuid creator_id FK
        string domain
        string entity_name
        string qloo_urn
        float confidence_weight
    }

    DEBATE_SESSION {
        uuid id PK
        uuid creator_id FK
        string status "running | cycle1_rejected | consensus_reached | failed"
        float overall_cultural_synergy_score
        int turns_count
        int cycles_count
        text human_constraints
        timestamptz started_at
        timestamptz completed_at
    }

    DEBATE_TURN {
        uuid id PK
        uuid session_id FK
        int turn_index
        int cycle_index
        string agent_role "Cultural_Analyst | Brand_Strategist | Creative_Director"
        text thought_reasoning
        text message_content
        jsonb tool_calls
        timestamptz timestamp
    }

    BRAND_TARGET_CARD {
        uuid id PK
        uuid session_id FK
        string brand_name
        string brand_domain
        string pipeline_stage "Discovered | Vetted | Pitch_Ready | Dispatched"
        float qloo_affinity_score
        float demographic_overlap_pct
        string estimated_deal_tier
        text multi_hop_path
        text negative_signals
        jsonb top_geographic_clusters
        vector embedding "vector(1536) for brand clustering"
        timestamptz updated_at
    }

    COLLAB_PRODUCT_CONCEPT {
        uuid id PK
        uuid brand_card_id FK
        string product_title
        string format
        text aesthetic_description
        text packaging_spec
        int edition_run_size
        numeric target_retail_price
        numeric gross_merchandise_value
        float creator_royalty_split_pct
    }

    OUTREACH_PITCH {
        uuid id PK
        uuid brand_card_id FK
        string subject_line
        text hook_statement
        text data_grounding_paragraph
        text call_to_action
        text vanilla_llm_comparison
        timestamptz created_at
    }

    DISPATCH_WEBHOOK_LOG {
        uuid id PK
        uuid brand_card_id FK
        string target_service "HubSpot | Notion | Custom_Webhook"
        string endpoint_url
        jsonb payload_json
        int response_status
        timestamptz dispatched_at
    }

    QLOO_ENTITY_SIGNAL {
        uuid id PK
        uuid brand_card_id FK
        string source_entity_urn
        string target_entity_urn
        float affinity_metric
        string cross_domain_path
    }
```

---

## 2. PostgreSQL + pgvector Migration Schema (`supabase/migrations/001_initial_schema.sql`)

```sql
-- Enable pgvector extension for semantic cultural embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Creator / Brand Profiles
CREATE TABLE creator_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    handle VARCHAR(100),
    category VARCHAR(100) NOT NULL,
    audience_summary TEXT,
    primary_vibe VARCHAR(255),
    mode VARCHAR(50) DEFAULT 'creator', -- 'creator' or 'brand_counter_discovery'
    embedding VECTOR(1536),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cultural Anchors declared by creators or brands
CREATE TABLE cultural_anchors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID REFERENCES creator_profiles(id) ON DELETE CASCADE,
    domain VARCHAR(50) NOT NULL,
    entity_name VARCHAR(255) NOT NULL,
    qloo_urn VARCHAR(150),
    confidence_weight FLOAT DEFAULT 1.0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Multi-Agent Debate Sessions
CREATE TABLE debate_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID REFERENCES creator_profiles(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'running',
    overall_cultural_synergy_score FLOAT,
    turns_count INT DEFAULT 0,
    cycles_count INT DEFAULT 1,
    human_constraints TEXT,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Multi-Agent Debate Turns (Live Thought Stream & Tool Calls)
CREATE TABLE debate_turns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES debate_sessions(id) ON DELETE CASCADE,
    turn_index INT NOT NULL,
    cycle_index INT DEFAULT 1,
    agent_role VARCHAR(100) NOT NULL,
    thought_reasoning TEXT,
    message_content TEXT,
    tool_calls JSONB,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Brand Target Cards (Kanban Pipeline Items)
CREATE TABLE brand_target_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES debate_sessions(id) ON DELETE CASCADE,
    brand_name VARCHAR(255) NOT NULL,
    brand_domain VARCHAR(100) NOT NULL,
    pipeline_stage VARCHAR(50) DEFAULT 'Discovered',
    qloo_affinity_score FLOAT NOT NULL,
    demographic_overlap_pct FLOAT,
    estimated_deal_tier VARCHAR(100),
    multi_hop_path TEXT,
    negative_signals TEXT,
    top_geographic_clusters JSONB,
    embedding VECTOR(1536),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Physical Collaboration Concepts & Unit Economics
CREATE TABLE collab_product_concepts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_card_id UUID REFERENCES brand_target_cards(id) ON DELETE CASCADE,
    product_title VARCHAR(255) NOT NULL,
    format VARCHAR(100),
    aesthetic_description TEXT,
    packaging_spec TEXT,
    edition_run_size INT DEFAULT 500,
    target_retail_price NUMERIC(10, 2) NOT NULL,
    gross_merchandise_value NUMERIC(12, 2),
    creator_royalty_split_pct FLOAT DEFAULT 0.18,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Personalized Outreach Pitch Letters
CREATE TABLE outreach_pitches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_card_id UUID REFERENCES brand_target_cards(id) ON DELETE CASCADE,
    subject_line VARCHAR(255) NOT NULL,
    hook_statement TEXT,
    data_grounding_paragraph TEXT,
    call_to_action TEXT,
    vanilla_llm_comparison TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Outbound Webhook Logs
CREATE TABLE dispatch_webhook_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_card_id UUID REFERENCES brand_target_cards(id) ON DELETE CASCADE,
    target_service VARCHAR(100) NOT NULL,
    endpoint_url TEXT NOT NULL,
    payload_json JSONB NOT NULL,
    response_status INT,
    dispatched_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for vector similarity search
CREATE INDEX ON creator_profiles USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX ON brand_target_cards USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
```

---

## 3. TypeScript Interfaces

```typescript
export type CreatorCategory = 'Gaming' | 'Podcast' | 'Music' | 'Art' | 'Tech' | 'Living' | 'Lifestyle';
export type WorkflowMode = 'creator' | 'brand_counter_discovery';

export interface CulturalAnchor {
  id: string;
  creatorId: string;
  domain: 'music' | 'film' | 'fashion' | 'dining' | 'literature' | 'aesthetic';
  entityName: string;
  qlooUrn?: string;
  confidenceWeight: number; // 0.0 - 1.0
}

export interface CreatorProfile {
  id: string;
  name: string;
  handle: string;
  category: CreatorCategory;
  audienceSummary: string;
  primaryVibe: string;
  mode: WorkflowMode;
  anchors: CulturalAnchor[];
  embedding?: number[];
  createdAt: string;
}

export type AgentRole = 'Cultural_Analyst' | 'Brand_Strategist' | 'Creative_Director';

export interface DebateTurn {
  id: string;
  sessionId: string;
  turnIndex: number;
  cycleIndex: number;
  agentRole: AgentRole;
  thoughtReasoning: string;
  messageContent: string;
  toolCalls?: {
    toolName: string;
    input: Record<string, unknown>;
    output: Record<string, unknown>;
  }[];
  timestamp: string;
}

export interface DebateSession {
  id: string;
  creatorId: string;
  status: 'idle' | 'running' | 'cycle1_rejected' | 'consensus_reached' | 'failed';
  overallCulturalSynergyScore: number;
  cyclesCount: number;
  humanConstraints?: string;
  turns: DebateTurn[];
  startedAt: string;
  completedAt?: string;
}

export type PipelineStage = 'Discovered' | 'Vetted' | 'Pitch Ready' | 'Dispatched';
export type DealTier = 'Micro ($2k-$5k)' | 'Mid ($5k-$20k)' | 'High ($20k-$50k+)' | 'Enterprise ($50k+)';

export interface CollabProductConcept {
  id: string;
  brandCardId: string;
  productTitle: string;
  format: 'Limited Capsule' | 'Co-Branded Packaging' | 'Hardware Variant' | 'Experiential Drop';
  aestheticDescription: string;
  packagingSpec: string;
  editionRunSize: number;
  targetRetailPrice: number;
  grossMerchandiseValue: number;
  creatorRoyaltySplitPct: number;
}

export interface OutreachPitch {
  id: string;
  brandCardId: string;
  subjectLine: string;
  hookStatement: string;
  dataGroundingParagraph: string;
  callToAction: string;
  vanillaLlmComparison: string;
}

export interface BrandTargetCard {
  id: string;
  sessionId: string;
  brandName: string;
  brandDomain: 'apparel' | 'beverage' | 'tech' | 'living' | 'lifestyle';
  pipelineStage: PipelineStage;
  qlooAffinityScore: number;
  demographicOverlapPct: number;
  estimatedDealTier: DealTier;
  multiHopPath: string;
  negativeSignals: string;
  topGeographicClusters: Array<{ city: string; lift: number }>;
  embedding?: number[];
  productConcept: CollabProductConcept;
  pitch: OutreachPitch;
  dispatchLogs: Array<{
    targetService: string;
    endpointUrl: string;
    responseStatus: number;
    dispatchedAt: string;
  }>;
  updatedAt: string;
}
```
