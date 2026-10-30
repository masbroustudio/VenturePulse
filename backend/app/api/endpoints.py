"""
Venture Pulse - API Endpoints Router (REST & Server-Sent Events)
"""
import uuid
import json
import logging
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, HTTPException, Query, Body, BackgroundTasks
from pydantic import BaseModel, Field
from sse_starlette.sse import EventSourceResponse

from backend.app.config import get_settings
from backend.app.qloo.client import QlooClient, QlooAuthenticationError, QlooValidationError, QlooNetworkError
from backend.app.agent.council import AgentCouncil
from backend.app.db.storage import Storage
from backend.app.eval.benchmark import evaluate_cultural_groundedness

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["Venture Pulse API"])

# In-memory session cache for active streams
ACTIVE_SESSIONS: Dict[str, Dict[str, Any]] = {}
storage = Storage()

class ResolveRequest(BaseModel):
    query: str
    entity_type: Optional[str] = None

class InsightsRequest(BaseModel):
    entity_id: str
    filter_type: str = "urn:entity:brand"
    sample_size: int = 15

class VectorSearchRequest(BaseModel):
    query: Optional[str] = None
    query_text: Optional[str] = None
    top_k: int = 5

class StartDebateRequest(BaseModel):
    profile_name: str = "Neon Void Studio"
    mode: str = "creator"  # "creator" or "brand"
    anchors: List[str] = Field(default_factory=lambda: ["Acne Studios", "Synthwave", "Blade Runner 2049"])
    founder_constraints: Optional[List[str]] = None
    profile_id: Optional[str] = None

class InjectConstraintRequest(BaseModel):
    session_id: str
    constraint: str

class UpdateStageRequest(BaseModel):
    card_id: str
    new_stage: str

# 1. HEALTH & QLOO STATUS
@router.get("/health")
async def health_check():
    settings = get_settings()
    has_key = bool(settings.qloo_api_key and settings.qloo_api_key != "your_qloo_api_key_here")
    return {
        "status": "healthy",
        "service": "Venture Pulse Cultural AI Engine",
        "version": "1.0.0",
        "qloo_api_status": "AUTHENTICATED" if has_key else "MISSING_KEY",
        "qloo_gateway": settings.qloo_api_base_url,
        "llm_model": settings.llm_model,
        "database": settings.database_path
    }

# 2. QLOO ENTITY RESOLUTION
@router.post("/qloo/resolve")
async def resolve_entity(req: ResolveRequest):
    client = QlooClient()
    try:
        results = await client.search_entities(req.query, entity_type=req.entity_type)
        # Auto-index into vector embeddings
        for r in results:
            desc = r.properties.get("description", "") if isinstance(r.properties, dict) else ""
            storage.index_entity(r.entity_id, r.name, desc)
        return {"query": req.query, "count": len(results), "results": [r.model_dump() for r in results]}
    except QlooAuthenticationError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except QlooValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 3. QLOO INSIGHTS
@router.post("/qloo/insights")
async def get_insights(req: InsightsRequest):
    client = QlooClient()
    try:
        results = await client.get_insights(req.entity_id, filter_type=req.filter_type, sample_size=req.sample_size)
        # Auto-index into vector embeddings
        for e in results:
            desc = e.properties.get("description", "") if isinstance(e.properties, dict) else ""
            storage.index_entity(e.entity_id, e.name, desc)
        return {"entity_id": req.entity_id, "count": len(results), "entities": [e.model_dump() for e in results]}
    except QlooAuthenticationError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except QlooValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 4. VECTOR SEMANTIC SEARCH
@router.post("/vector/search")
async def search_vector(req: VectorSearchRequest):
    search_q = req.query or req.query_text or ""
    results = storage.search_semantic_entities(search_q, top_k=req.top_k)
    return {
        "query": search_q,
        "count": len(results),
        "results": results,
        "matches": results
    }

# 4. START DELIBERATION
@router.post("/debate/start")
async def start_debate(req: StartDebateRequest):
    session_id = f"sess_{uuid.uuid4().hex[:12]}"
    ACTIVE_SESSIONS[session_id] = {
        "profile_name": req.profile_name,
        "profile_id": req.profile_id or req.profile_name,
        "mode": req.mode,
        "anchors": req.anchors,
        "founder_constraints": req.founder_constraints or []
    }
    return {
        "session_id": session_id,
        "profile_name": req.profile_name,
        "profile_id": req.profile_id or req.profile_name,
        "mode": req.mode,
        "stream_url": f"/api/debate/stream/{session_id}"
    }

# 5. SERVER-SENT EVENTS (SSE) STREAMING DEBATE
@router.get("/debate/stream/{session_id}")
async def stream_debate(session_id: str):
    session_data = ACTIVE_SESSIONS.get(session_id)
    if not session_data:
        # Fallback to default preset if session was not pre-registered
        session_data = {
            "profile_name": "Neon Void Studio",
            "profile_id": "neon-void",
            "mode": "creator",
            "anchors": ["Acne Studios", "Synthwave", "Blade Runner 2049"],
            "founder_constraints": []
        }

    council = AgentCouncil()

    async def event_generator():
        async for item in council.run_deliberation_stream(
            session_id=session_id,
            profile_name=session_data["profile_name"],
            anchors=session_data["anchors"],
            mode=session_data["mode"],
            founder_constraints=session_data.get("founder_constraints", []),
            profile_id=session_data.get("profile_id")
        ):
            yield {
                "event": item["event"],
                "data": json.dumps(item["data"])
            }

    return EventSourceResponse(event_generator())

# 6. FOUNDER MID-DEBATE CONSTRAINT INJECTION
@router.post("/debate/inject")
async def inject_constraint(req: InjectConstraintRequest):
    if req.session_id in ACTIVE_SESSIONS:
        ACTIVE_SESSIONS[req.session_id]["founder_constraints"].append(req.constraint)
        return {"status": "INJECTED", "session_id": req.session_id, "constraint": req.constraint}
    raise HTTPException(status_code=404, detail="Session not found")

# 7. CRM DEALS & STAGE PROGRESSION
@router.get("/crm/deals")
async def get_deals(
    stage: Optional[str] = None,
    session_id: Optional[str] = None,
    profile_id: Optional[str] = None,
    mode: Optional[str] = None
):
    target_id = profile_id or session_id
    deals = storage.get_deals(stage=stage, session_id=target_id)
    # Seed default deals if empty and no specific profile was requested
    if not deals and not target_id:
        defaults = [
            ("card_1", "Acne Studios", "The 'Midnight Grid' 14oz Selvedge Chore Coat", "apparel", "7.8x", 0.94, "Discovered", 185.0, 500, 92500.0, {
                "title": "The 'Midnight Grid' 14oz Selvedge Chore Coat",
                "brand_partner": "Acne Studios",
                "category": "apparel",
                "affinity_multiplier": "7.8x",
                "description": "Crafted in collaboration with Kuroki Mills, Okayama Japan. 14oz raw selvedge with citron ticker and debossed hardware.",
                "materials": ["14oz Okayama Indigo Denim", "Citron Selvedge Ticker", "Matte Nickel Hardware", "Organic Cotton Pocketing"],
                "colorways": ["Midnight Indigo", "Raw Ecru"],
                "msrp_usd": 185.0,
                "run_units": 500,
                "projected_gmv": 92500.0,
                "creator_royalty_pct": 0.18,
                "projected_royalty": 16650.0,
                "outreach_pitch": "According to Qloo's cultural intelligence graph (250M+ entities), our audience exhibits an extraordinary 7.8x statistical affinity for Acne Studios and Japanese raw selvedge outerwear."
            }),
            ("card_2", "Teenage Engineering", "Pocket Operator VP-01 Synthesizer", "tech", "8.4x", 0.91, "Vetted", 249.0, 300, 74700.0, {
                "title": "Pocket Operator VP-01 Synthesizer",
                "brand_partner": "Teenage Engineering",
                "category": "tech",
                "affinity_multiplier": "8.4x",
                "description": "Custom pocket synthesizer with physical tactile keys, silicon-free architectural chassis, and custom generative firmware.",
                "materials": ["CNC Anodized 6061 Aluminum", "Cherry MX Ultra-Low Profile Switches", "Monochrome OLED Display"],
                "colorways": ["Anodized Silver", "Space Gray", "Signal Orange"],
                "msrp_usd": 249.0,
                "run_units": 300,
                "projected_gmv": 74700.0,
                "creator_royalty_pct": 0.18,
                "projected_royalty": 13446.0,
                "outreach_pitch": "Qloo data identifies an 8.4x cross-domain affinity among electronic audio producers and tactile design enthusiasts for Teenage Engineering."
            }),
            ("card_3", "Matcha Kari", "Ceremonial Single-Origin Uji Matcha", "beverage", "6.9x", 0.88, "Pitch Ready", 38.0, 1000, 38000.0, {
                "title": "Ceremonial Single-Origin Uji Matcha",
                "brand_partner": "Matcha Kari",
                "category": "beverage",
                "affinity_multiplier": "6.9x",
                "description": "First-harvest ceremonial grade tencha stone-ground in Kyoto, packaged in matte nitrogen-sealed collectable tins.",
                "materials": ["Single-Origin Uji Tencha", "Food-Grade UV Matte Tinplate", "Artisanal Bamboo Chasen"],
                "colorways": ["Ceremonial Green", "Wabi-Sabi Sand", "Ink Black"],
                "msrp_usd": 38.0,
                "run_units": 1000,
                "projected_gmv": 38000.0,
                "creator_royalty_pct": 0.20,
                "projected_royalty": 7600.0,
                "outreach_pitch": "Our audience indexes 6.9x above baseline for slow-living rituals and ceremonial Japanese green tea culture."
            }),
            ("card_4", "Snow Peak", "Titanium Double-Wall Minimalist Sconce", "living", "9.1x", 0.96, "Dispatched", 320.0, 200, 64000.0, {
                "title": "Titanium Double-Wall Minimalist Sconce",
                "brand_partner": "Snow Peak",
                "category": "living",
                "affinity_multiplier": "9.1x",
                "description": "Aerospace-grade Japanese titanium luminaire engineered for both expedition bivouacs and modern residential studios.",
                "materials": ["Grade 2 Aerospace Titanium", "Hand-Blown Borosilicate Glass", "Solid Brushed Brass"],
                "colorways": ["Raw Titanium", "Charcoal Oxide", "Sandblasted Gold"],
                "msrp_usd": 320.0,
                "run_units": 200,
                "projected_gmv": 64000.0,
                "creator_royalty_pct": 0.18,
                "projected_royalty": 11520.0,
                "outreach_pitch": "Cross-domain mapping reveals 9.1x mutual affinity between modern spatial creators and Snow Peak's outdoor minimalism."
            })
        ]
        for c_id, name, title, cat, mult, syn, stg, msrp, units, gmv, spec in defaults:
            storage.save_deal(c_id, "seed", name, cat, mult, syn, stg, msrp, units, gmv, title=title, spec_json=json.dumps(spec))
        deals = storage.get_deals(stage=stage)

    total_value = sum(d["gmv"] for d in deals)
    avg_affinity = sum(float(d["affinity_multiplier"].replace("x", "")) for d in deals) / len(deals) if deals else 0.0

    return {
        "deals": deals,
        "metrics": {
            "total_pipeline_value": total_value,
            "average_affinity": round(avg_affinity, 1),
            "total_deals": len(deals)
        }
    }

@router.post("/crm/dispatch")
async def dispatch_deal(req: UpdateStageRequest):
    success = storage.update_deal_stage(req.card_id, req.new_stage)
    if success:
        return {"status": "UPDATED", "card_id": req.card_id, "new_stage": req.new_stage}
    raise HTTPException(status_code=404, detail=f"Deal card '{req.card_id}' not found")

# 8. DEEPEVAL / RAGAS BENCHMARK SCORECARD
@router.get("/eval/benchmark")
async def get_benchmark_scorecard():
    scorecard = evaluate_cultural_groundedness(
        input_anchors=["Acne Studios", "Synthwave", "Blade Runner 2049"],
        resolved_qloo_entities=["c90e3920-bf05-4537-903f-085bfe2e41ac"],
        proposed_partnerships=["Acne Studios", "Teenage Engineering", "Keychron"]
    )
    return scorecard

# 9. COPILOT CHAT STREAMING & DIRECT CRM DEAL CREATION
class CreateDealRequest(BaseModel):
    card_id: Optional[str] = None
    session_id: Optional[str] = None
    profile_id: Optional[str] = None
    brand_name: str
    title: Optional[str] = None
    category: str = "apparel"
    affinity_multiplier: str = "7.5x"
    synergy_score: float = 0.92
    stage: str = "Discovered"
    msrp: float = 185.0
    run_units: int = 500
    gmv: float = 92500.0
    spec: Optional[Dict[str, Any]] = None

@router.post("/crm/deals")
async def create_deal(req: CreateDealRequest):
    card_id = req.card_id or f"deal_{uuid.uuid4().hex[:8]}"
    storage.save_deal(
        card_id=card_id,
        session_id=req.profile_id or req.session_id or "chat",
        brand_name=req.brand_name,
        category=req.category,
        affinity_multiplier=req.affinity_multiplier,
        synergy_score=req.synergy_score,
        stage=req.stage,
        msrp=req.msrp,
        run_units=req.run_units,
        gmv=req.gmv,
        title=req.title,
        spec_json=json.dumps(req.spec) if req.spec else None
    )
    return {"status": "CREATED", "card_id": card_id, "brand_name": req.brand_name}

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None
    mode: str = "creator"
    profile_name: str = "Neon Void Studio"
    anchors: Optional[List[str]] = None
    history: Optional[List[ChatMessage]] = None

@router.post("/chat")
async def chat_copilot_stream(req: ChatRequest):
    council = AgentCouncil()
    history_dicts = [{"role": m.role, "content": m.content} for m in req.history] if req.history else None

    async def event_generator():
        async for item in council.run_copilot_chat_stream(
            message=req.message,
            mode=req.mode,
            profile_name=req.profile_name,
            anchors=req.anchors,
            history=history_dicts
        ):
            yield {
                "event": item["event"],
                "data": json.dumps(item["data"])
            }

    return EventSourceResponse(event_generator())
