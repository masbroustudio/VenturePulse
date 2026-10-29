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

class StartDebateRequest(BaseModel):
    profile_name: str = "Neon Void Studio"
    mode: str = "creator"  # "creator" or "brand"
    anchors: List[str] = Field(default_factory=lambda: ["Acne Studios", "Synthwave", "Blade Runner 2049"])
    founder_constraints: Optional[List[str]] = None

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
        return {"entity_id": req.entity_id, "count": len(results), "entities": [e.model_dump() for e in results]}
    except QlooAuthenticationError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except QlooValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 4. START DELIBERATION
@router.post("/debate/start")
async def start_debate(req: StartDebateRequest):
    session_id = f"sess_{uuid.uuid4().hex[:12]}"
    ACTIVE_SESSIONS[session_id] = {
        "profile_name": req.profile_name,
        "mode": req.mode,
        "anchors": req.anchors,
        "founder_constraints": req.founder_constraints or []
    }
    return {
        "session_id": session_id,
        "profile_name": req.profile_name,
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
            founder_constraints=session_data.get("founder_constraints", [])
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
async def get_deals(stage: Optional[str] = None):
    deals = storage.get_deals(stage=stage)
    # Seed default deals if empty
    if not deals:
        defaults = [
            ("card_1", "Acne Studios", "apparel", "7.8x", 0.94, "Discovered", 185.0, 500, 92500.0),
            ("card_2", "Teenage Engineering", "tech", "8.4x", 0.91, "Vetted", 249.0, 300, 74700.0),
            ("card_3", "Matcha Kari", "beverage", "6.9x", 0.88, "Pitch Ready", 38.0, 1000, 38000.0),
            ("card_4", "Snow Peak", "living", "9.1x", 0.96, "Dispatched", 320.0, 200, 64000.0)
        ]
        for c_id, name, cat, mult, syn, stg, msrp, units, gmv in defaults:
            storage.save_deal(c_id, "seed", name, cat, mult, syn, stg, msrp, units, gmv)
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
