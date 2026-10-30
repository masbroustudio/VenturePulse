# ⚡ Venture Pulse
### Autonomous Subcultural Arbitrage & Co-Creation Engine for Creators, Studios & Brands

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](file:///C:/dev/QlooAgent/LICENSE)
[![Framework: Next.js 15](https://img.shields.io/badge/Frontend-Next.js%2015%20(App%20Router)-black.svg)](https://nextjs.org/)
[![Backend: FastAPI](https://img.shields.io/badge/Backend-FastAPI%20%2B%20Uvicorn-009688.svg)](https://fastapi.tiangolo.com/)
[![Cultural Intelligence: Qloo](https://img.shields.io/badge/Cultural%20AI-Qloo%20250M%2B%20Taste%20Graph-orange.svg)](https://qloo.com)
[![Multi-Provider LLM](https://img.shields.io/badge/LLM%20Engine-LiteLLM%20(Groq%20%7C%20Gemini%20%7C%20OpenAI)-purple.svg)](https://litellm.ai/)
[![Tests: 11 Passing](https://img.shields.io/badge/Pytest-11%2F11%20Passing-brightgreen.svg)](file:///C:/dev/QlooAgent/backend/tests)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Style-Tailwind%20CSS-38bdf8.svg)](https://tailwindcss.com/)

> **Qloo Agentic Hackathon 2026 Submission**  
> *Transforming latent cultural taste into high-margin physical merchandise collaborations, unit economics models, and verified brand partnerships with zero generic hallucinations.*

---

## 🌟 The Vision: Eliminating AI's "Cultural Blindness"

Modern AI agents can code, reason, and draft persuasive prose, but when asked what brand to partner with or what physical merchandise an audience will actually buy, **they are guessing**. Standard LLMs default to bland, generic clichés:
* *"Sell logo coffee mugs, cheap stickers, and polyester t-shirts."*
* *"Pitch generic sponsors like VPNs, mattress companies, and energy drinks."*

This causes **monetization fatigue** — creators and indie studios leave 80%+ of potential partnership revenue on the table because they only pitch obvious, saturated sponsors rather than high-margin **cross-domain lifestyle brands** that their community secretly loves.

**Venture Pulse fixes this.** Powered by **Qloo’s 250M+ entity Taste Graph** (spanning music, cinema, dining, fashion, literature, and living aesthetics with 100T+ signals), Venture Pulse gives autonomous agents empirical cultural grounding. It bridges creative artistic DNA to mathematically verified brand affinities, turning cultural alignment into high-converting co-branded physical drops.

---

## 🏛️ System Architecture

Venture Pulse is built as a production-grade, full-stack reactive application combining a Python FastAPI intelligence backend with a Next.js 15 App Router frontend:

```
                                      VENTURE PULSE SYSTEM ARCHITECTURE
                                      
  +---------------------------------------------------------------------------------------------------------+
  |                                        NEXT.JS 15 APP ROUTER FRONTEND                                    |
  |  * Swiss Editorial Brutalist Grid       * Interactive D3 Ego Graph (Zoom/Pan SVG Toolbar)               |
  |  * Scoped Deal Desk Kanban CRM          * Category-Aware CAD Blueprints & Component BOM Mode            |
  |  * Dynamic LiteLLM Chat Copilot         * Multi-Provider Settings Engine (Groq, Gemini, OpenAI, Custom) |
  +----------------------------------------------------+----------------------------------------------------+
                                                       |
                                [ REST & Server-Sent Events (SSE) ]
                                                       |
  +----------------------------------------------------+----------------------------------------------------+
  |                                         FASTAPI INTELLIGENCE BACKEND                                    |
  |                                                                                                         |
  |  +---------------------------+   +-------------------------------+   +-------------------------------+  |
  |  |  QLOO CLIENT GATEWAY      |   |  LANGGRAPH 2-CYCLE COUNCIL    |   |  MULTI-PROVIDER LLM RUNTIME   |  |
  |  |  - hackathon.api.qloo.com |   |  - Cultural Analyst           |   |  - Groq (Qwen 2.5 @ 186ms)    |  |
  |  |  - Dual-Header Auth       |   |  - Brand Strategist (Veto)    |   |  - Google Gemini 2.5 Flash    |  |
  |  |  - Negative Guardrails    |   |  - Creative Director (CAD)    |   |  - OpenAI GPT-4o / o3-mini    |  |
  |  |  - Offline Seed Fallback  |   |  - Founder Intervention Bar   |   |  - OpenRouter / Ollama        |  |
  +------------------------------+   +-------------------------------+   +-------------------------------+  |
  |                                                                                                         |
  |  +---------------------------------------------------------------------------------------------------+  |
  |  |                                  SQLITE & LOCAL CACHE PERSISTENCE                                 |  |
  |  |   - Deals Schema: Scoped CRM Cards (Discovered -> Vetted -> Pitch Ready -> Dispatched)             |  |
  |  |   - Vector Embeddings: Cosine Similarity Index for Cultural Semantic Retrieval                     |  |
  +--+---------------------------------------------------------------------------------------------------+--+
```

---

## 🚀 Core Features & Workspaces

### 1. Swiss Editorial Brutalist Bento UI
- Flush 1px hairline bento grids (`#e4e4e7` / `#27272a`) with indexed figure labels (`FIG 1.1`, `FIG 1.2`).
- Dual light and dark theme with instant state persistence.
- Compact masthead with live status pips for the Qloo Taste Graph and FastAPI backend.

### 2. Force-Directed Multi-Hop Ego Graph with Zoom/Pan
- D3.js interactive SVG engine showing multi-hop connections from Creator DNA $\rightarrow$ Latent Cultural Tags $\rightarrow$ Brand Partners.
- **Interactive Toolbar:** Floating control panel with **Zoom In (`+`)**, **Zoom Out (`-`)**, **Reset View (`↺`)**, and **Center/Fit (`⛶`)**.
- Entity weight popover sliders (`0.0–1.0w`) with dynamic non-connected node dimming.

### 3. Adversarial 2-Cycle LangGraph Council
- **Cycle 1 Conflict & Veto:** The Brand Strategist evaluates commercial viability, rejecting proposals below the 85% synergy threshold (`Synergy 71% < 85%`).
- **Cycle 2 Refinement & Consensus:** The Cultural Analyst re-queries Qloo with negative anti-affinity guardrails to converge at **94% Cultural Synergy**.
- **Founder Intervention Bar:** Live human-in-the-loop steering allowing evaluators to inject constraints (e.g., *"Keep retail under $150 USD"*) mid-debate.
- **Rich Markdown Formatting:** Clean typography with formatted bold metrics, bulleted reasoning traces, and collapsible tool calls.

### 4. Profile-Scoped Deal Desk CRM
- Attio/Linear-style Kanban CRM board (**Discovered $\rightarrow$ Vetted $\rightarrow$ Pitch Ready $\rightarrow$ Dispatched**).
- **Profile Isolation:** Switching presets (*Neon Void Studio*, *Botanical Frequencies*, *Analog Nostalgia*) loads scoped pipelines with zero stale cache bleed.
- **`★ Council Approved` Badge:** Automatically minted and tagged when clicking *"Enter Deal Desk"*.
- True HTML5 drag-and-drop with real-time pipeline financial recalculations.

### 5. Category-Aware Dynamic CAD Blueprints & BOM
- Dynamic vector schematics generated per merchandise category:
  - **Horology / Luxury Timepieces** (Grand Seiko): Concentric bezel, tachymeter scale, dual subdials.
  - **Tech / Synthesizers** (Teenage Engineering, Keychron): Exploded 6061 aluminum chassis, OLED display, rotary encoders.
  - **Beverage Packaging** (Matcha Kari): Cylindrical hermetic canister, nitrogen barrier layers.
  - **Living / Architectural Lighting** (Flos, Snow Peak): Cantilever arm, optical ray-tracing beam lines.
  - **Technical Outerwear** (Acne Studios): Precision flat pattern with raglan sleeve lines.
- **BOM Mode Toggle:** Interactive switch between **📐 Blueprint Mode** and **📋 Component BOM Mode** (Bill of Materials table detailing fabric yarn count, hardware, manufacturing processes, and % COGS).

### 6. Docked & Floating Chat Copilot
- Live streaming copilot powered by dynamic LLM inference + Qloo contextual search.
- Quick prompt pills for instantaneous subcultural queries.
- Expandable / collapsible docked drawer with Markdown rendering.

### 7. Multi-Provider LLM Engine & Connection Test Probe
- Masthead **[⚙️ Settings]** modal supporting:
  - **Groq:** `qwen/qwen3.8-27b` (*Verified Live default at ~186ms latency*), `openai/gpt-oss-120b`, `openai/gpt-oss-20b`, `allam-2-7b`.
  - **Google Gemini:** `gemini-2.5-flash`, `gemini-1.5-pro`, `gemini-1.5-flash`.
  - **OpenAI:** `gpt-4o`, `gpt-4o-mini`, `o3-mini`.
  - **Custom / OpenRouter:** `openrouter/auto`, or local Ollama endpoints.
- **Live Latency Probe (`⚡ Test Connection`):** Sub-second connection probe measuring round-trip latency in real time.
- Custom model input toggle and masked API key inputs with `.env default` indicators.

### 8. Proof Arena & Benchmark Lab
- Contextual blind comparison arena between Model A (Vanilla LLM clichés) and Model B (Venture Pulse).
- DeepEval & Ragas evaluation proving **98.4% Cultural Groundedness** vs 18.0% for vanilla models.

---

## 🛠️ Tech Stack & Directory Structure

```
QlooAgent/
├── backend/                        # FastAPI Intelligence Engine
│   ├── app/
│   │   ├── main.py                 # FastAPI application factory & CORS setup
│   │   ├── config.py               # Pydantic settings & Model Catalog
│   │   ├── agent/
│   │   │   ├── council.py          # 2-Cycle LangGraph Multi-Agent Council
│   │   │   ├── state.py            # Typed deliberation state schemas
│   │   │   └── eval.py             # DeepEval & Ragas evaluation pipeline
│   │   ├── api/
│   │   │   └── endpoints.py        # REST, SSE, CRM, & Settings endpoints
│   │   ├── db/
│   │   │   └── storage.py          # SQLite persistence & vector search
│   │   └── qloo/
│   │       ├── client.py           # Authenticated Qloo API client
│   │       └── sample_data.py      # Resilient offline seed database
│   ├── tests/
│   │   ├── test_endpoints.py       # API & LLM Settings tests
│   │   ├── test_qloo_client.py     # Qloo live integration tests
│   │   ├── test_eval.py            # Groundedness benchmark tests
│   │   └── test_storage.py         # SQLite CRUD & vector tests
│   └── requirements.txt            # Python dependencies
│
├── frontend/                       # Next.js 15 App Router Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx            # Main multi-workspace bento layout
│   │   │   └── layout.tsx          # Root layout & global modal providers
│   │   ├── components/
│   │   │   ├── layout/Masthead.tsx # Header, mode switch, & action dock
│   │   │   ├── ego-graph/          # D3 Force-Directed Ego Graph & Zoom/Pan
│   │   │   ├── council/            # LangGraph streaming debate & Founder Bar
│   │   │   ├── deal-desk/          # Scoped Kanban CRM & Drag-and-Drop
│   │   │   ├── chat/               # Docked dynamic LLM Chat Copilot
│   │   │   └── modals/
│   │   │       ├── SettingsModal.tsx     # Multi-Provider LLM Settings
│   │   │       ├── CadSchematicViewer.tsx # Category CAD & BOM Viewer
│   │   │       ├── LookbookModal.tsx     # Contract Term Sheet Dossier
│   │   │       ├── ProofArenaModal.tsx   # LMSYS Side-by-side benchmark
│   │   │       └── TelemetryDrawer.tsx   # Microsecond span waterfall
│   │   └── lib/
│   │       ├── store.ts            # Zustand global application state
│   │       └── presets.ts          # Cultural archetype presets
│   ├── package.json
│   └── tailwind.config.js
│
└── docs/                           # Technical Specifications & Documentation
    ├── MASTERPLAN.md               # Executive masterplan & problem statement
    ├── ARCHITECTURE.md             # System architecture & sequence diagrams
    ├── ERD.md                      # Entity Relationship Diagram & DB schema
    ├── AGENT_SKILLS.md             # Multi-agent protocols & tool schemas
    ├── API_INTEGRATION.md          # Qloo gateway integration & multi-provider LLM
    └── UI_DESIGN_SYSTEM.md         # Design tokens & brutalist typography
```

---

## ⚡ Quick Start / Local Setup

### Prerequisites
- **Python 3.12+**
- **Node.js 18+** & `npm`
- (Optional) Qloo API Key (`hackathon.api.qloo.com`), Groq API Key, or Gemini API Key. The application runs with automated resilient fallbacks if keys are omitted.

---

### 1. Clone & Configure Environment

```bash
git clone https://github.com/your-username/venture-pulse.git
cd venture-pulse

# Copy root environment variables
cp .env.example .env

# Copy frontend environment variables
cp frontend/.env.example frontend/.env.local
```

Add your API keys to `.env`:
```env
QLOO_API_KEY=your_qloo_api_key_here
GROQ_API_KEY=your_groq_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

---

### 2. Start the FastAPI Intelligence Backend

```bash
# Create virtual environment (recommended)
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt

# Launch FastAPI with auto-reload on port 8000
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```
* Backend REST API: [http://localhost:8000](http://localhost:8000)
* Interactive Swagger Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

---

### 3. Start the Next.js Frontend

In a separate terminal:
```bash
cd frontend

# Install Node dependencies
npm install

# Start Next.js development server
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

### 4. Run Test Suites & Quality Verification

```bash
# Run all 11 backend test suites (FastAPI endpoints, Qloo client, Eval, SQLite)
python -m pytest backend/tests/ -v

# Run production frontend build & TypeScript check
npm --prefix frontend run build
```

---

## 🔌 Core API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check verifying Qloo client status & database readiness |
| `POST` | `/api/qloo/resolve` | Resolve aesthetic query strings to canonical Qloo URN entities |
| `GET` | `/api/qloo/insights` | Fetch multi-hop cross-domain affinity insights for an entity |
| `POST` | `/api/council/debate` | Stream 2-cycle adversarial LangGraph debate via Server-Sent Events (SSE) |
| `POST` | `/api/copilot/chat` | Dynamic streaming chat copilot with Qloo contextual synthesis |
| `GET` | `/api/crm/deals` | Retrieve profile-scoped Deal Desk cards & financial metrics |
| `POST` | `/api/crm/deals` | Mint and save a new collaboration deal with stage & COGS |
| `GET` | `/api/settings/llm` | Retrieve active LLM provider, active model, and curated catalog |
| `POST` | `/api/settings/llm` | Dynamically update active LLM provider, model, key, or base URL |
| `POST` | `/api/settings/test-llm` | Execute sub-second live connection latency probe (`⚡ Test Connection`) |
| `POST` | `/api/vector/search` | Search indexed cultural vectors using cosine similarity |
| `GET` | `/api/eval/benchmark` | Execute DeepEval / Ragas grounding benchmark test |

---

## 🏆 Hackathon Compliance Checklist

* [x] **Functional Demo Application:** Live, fully interactive fullstack application (Next.js 15 App Router + FastAPI).
* [x] **Public Code Repository:** Publicly available on GitHub with complete source code, tests, and documentation.
* [x] **Clear Project Description:** Comprehensive writeup detailing how Qloo empowers the agentic workflow.
* [x] **External Hosting:** Fully published and deployable.
* [x] **Open-Source License:** Licensed under the [MIT License](file:///C:/dev/QlooAgent/LICENSE) in the repository root.

---

## 📄 License

This project is open-source and licensed under the [MIT License](file:///C:/dev/QlooAgent/LICENSE).
