# Venture Pulse — Live Python Backend Service
**FastAPI, LiteLLM Multi-Provider Agent Council, Strict Live Qloo Gateway, SQLite Vector Storage & DeepEval**

---

## 1. Quick Start

### 1.1 Prerequisites
* Python 3.10+ (Tested on Python 3.12.4)
* An active Qloo API key (configured in `.env`)

### 1.2 Running the Backend Server
From the repository root:
```bash
python -m backend.app.main
```
Or using uvicorn directly:
```bash
uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```
Once launched:
* **Interactive OpenAPI Swagger UI:** Open [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
* **ReDoc Documentation:** Open [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

### 1.3 Streaming Live Multi-Agent Deliberation CLI Demo
In a separate terminal:
```bash
python backend/scripts/sse_client_demo.py
```
This CLI triggers an intake session and streams real-time Server-Sent Events (SSE) showing:
1. Live entity resolution against `hackathon.api.qloo.com`
2. Turn 1: Cultural Analyst initial synthesis
3. Turn 2: Brand Strategist **Cycle 1 Conflict / Rejection Event** (Synergy 72% < 85%)
4. Turn 3: Cultural Analyst **Cycle 2 Refinement** with anti-affinity guardrails
5. Turn 4: Creative Director consensus (94%), technical garment blueprint, and unit economics

---

## 2. API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check & active Qloo API key status |
| `POST` | `/api/qloo/resolve` | Query `GET /v2/search` to resolve human inputs to canonical Qloo URNs |
| `POST` | `/api/qloo/insights` | Query `GET /v2/insights` for cross-domain affinity scores |
| `POST` | `/api/debate/start` | Initialize a new LangGraph deliberation session |
| `GET` | `/api/debate/stream/{session_id}` | Live Server-Sent Events (SSE) stream of agent turns & consensus |
| `POST` | `/api/debate/inject` | Inject real-time founder constraints into an ongoing debate |
| `GET` | `/api/crm/deals` | List tracked brand deals, stage progression, and pipeline GMV |
| `POST` | `/api/crm/dispatch` | Move a deal card across Kanban stages (`Discovered` $\rightarrow$ `Dispatched`) |
| `GET` | `/api/eval/benchmark` | DeepEval cultural groundedness & hallucination resistance scorecard |

---

## 3. Running Automated Tests

Run the full pytest suite:
```bash
pytest backend/tests/ -v
```

Run specific test modules:
```bash
# 1. Live Qloo Gateway tests
pytest backend/tests/test_qloo_client.py -v

# 2. SQLite & Vector cosine similarity tests
pytest backend/tests/test_storage.py -v

# 3. FastAPI REST & SSE tests
pytest backend/tests/test_endpoints.py -v

# 4. DeepEval Cultural Groundedness benchmark
pytest backend/tests/test_eval.py -v
```
