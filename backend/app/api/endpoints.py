"""
Venture Pulse - API Endpoints Router (REST & Server-Sent Events)
"""
import os
import uuid
import json
import logging
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, HTTPException, Query, Body, BackgroundTasks
from pydantic import BaseModel, Field
from sse_starlette.sse import EventSourceResponse

from backend.app.config import get_settings, get_runtime_llm, update_runtime_llm, MODEL_CATALOG
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

@router.delete("/crm/deals/{card_id}")
async def delete_deal(card_id: str):
    success = storage.delete_deal(card_id)
    if success:
        return {"status": "DELETED", "card_id": card_id}
    raise HTTPException(status_code=404, detail=f"Deal '{card_id}' not found")

@router.delete("/crm/deals")
async def clear_all_deals(session_id: Optional[str] = None):
    deleted_count = storage.clear_deals(session_id)
    return {"status": "CLEARED", "deleted_count": deleted_count, "session_id": session_id}

class SeedCRMRequest(BaseModel):
    session_id: Optional[str] = "neon-void"
    deals: Optional[List[Dict[str, Any]]] = None

@router.post("/crm/seed")
async def seed_crm_deals(req: SeedCRMRequest):
    target_id = req.session_id or "neon-void"
    seeded_count = 0
    if req.deals:
        for d in req.deals:
            c_id = d.get("card_id") or f"{target_id}_preset_{seeded_count + 1}"
            storage.save_deal(
                card_id=c_id,
                session_id=target_id,
                brand_name=d.get("brand_name") or d.get("brand", "Acne Studios"),
                category=d.get("category") or d.get("domain", "apparel"),
                affinity_multiplier=str(d.get("affinity_multiplier") or d.get("affinity", "7.8x")).replace("⚡ ", ""),
                synergy_score=float(d.get("synergy_score") or d.get("score", 0.92)),
                stage=d.get("stage", "Discovered"),
                msrp=float(d.get("msrp", 185.0)),
                run_units=int(d.get("run_units", 500)),
                gmv=float(d.get("gmv", 92500.0)),
                title=d.get("title"),
                spec_json=json.dumps(d.get("spec")) if d.get("spec") else None
            )
            seeded_count += 1
    return {"status": "SEEDED", "count": seeded_count, "session_id": target_id}

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

# 10. LLM SETTINGS & MODEL CONFIGURATION
class UpdateLLMRequest(BaseModel):
    provider: str = "groq"
    model: str = "groq/qwen/qwen3.8-27b"
    api_key: Optional[str] = None
    base_url: Optional[str] = None

class TestLLMRequest(BaseModel):
    provider: str = "groq"
    model: str = "groq/qwen/qwen3.8-27b"
    api_key: Optional[str] = None
    base_url: Optional[str] = None
    probe_prompt: Optional[str] = "Reply in 1 concise sentence validating cultural AI capability."

@router.get("/settings/llm")
async def get_llm_settings():
    settings = get_settings()
    runtime = get_runtime_llm()
    return {
        "active_provider": runtime.provider,
        "active_model": runtime.model,
        "base_url": runtime.base_url,
        "catalog": MODEL_CATALOG,
        "env_keys": {
            "groq": bool(settings.groq_api_key),
            "gemini": bool(settings.gemini_api_key),
            "openai": bool(settings.openai_api_key),
            "custom": bool(runtime.api_key or settings.openai_base_url)
        },
        "has_runtime_key": bool(runtime.api_key)
    }

@router.post("/settings/llm")
async def update_llm_settings(req: UpdateLLMRequest):
    updated = update_runtime_llm(
        provider=req.provider,
        model=req.model,
        api_key=req.api_key if req.api_key and req.api_key.strip() else None,
        base_url=req.base_url if req.base_url and req.base_url.strip() else None
    )
    return {
        "status": "UPDATED",
        "active_provider": updated.provider,
        "active_model": updated.model,
        "base_url": updated.base_url
    }

@router.post("/settings/test-llm")
async def test_llm_connection(req: TestLLMRequest):
    import time
    import litellm
    settings = get_settings()

    key = req.api_key
    if not key:
        if "groq" in req.model.lower() or req.provider == "groq":
            key = settings.groq_api_key or os.environ.get("GROQ_API_KEY")
        elif "gemini" in req.model.lower() or req.provider == "gemini":
            key = settings.gemini_api_key or os.environ.get("GEMINI_API_KEY")
        elif "openai" in req.model.lower() or req.provider == "openai":
            key = settings.openai_api_key or os.environ.get("OPENAI_API_KEY")

    if not key and req.provider != "custom":
        raise HTTPException(
            status_code=400,
            detail=f"No API key provided or found in environment for provider '{req.provider}'."
        )

    start_t = time.perf_counter()
    try:
        kwargs: Dict[str, Any] = {
            "model": req.model,
            "messages": [
                {"role": "system", "content": "You are Venture Pulse LLM engine probe."},
                {"role": "user", "content": req.probe_prompt or "Ping test."}
            ],
            "max_tokens": 50,
            "temperature": 0.2,
            "timeout": 6.0
        }
        if key:
            kwargs["api_key"] = key
        if req.base_url:
            kwargs["api_base"] = req.base_url

        resp = await litellm.acompletion(**kwargs)
        latency = round((time.perf_counter() - start_t) * 1000)
        content = resp.choices[0].message.content.strip()
        return {
            "status": "SUCCESS",
            "provider": req.provider,
            "model": req.model,
            "latency_ms": latency,
            "message": content
        }
    except Exception as e:
        latency = round((time.perf_counter() - start_t) * 1000)
        raise HTTPException(
            status_code=502,
            detail=f"LiteLLM connection test failed ({latency}ms): {str(e)}"
        )

# 11. ON-DEMAND GEMINI IMAGEN 3 IMAGE GENERATION
class GenerateImageRequest(BaseModel):
    card_id: Optional[str] = None
    brand_name: str
    title: str
    category: str = "apparel"
    materials: Optional[List[str]] = None
    colorways: Optional[List[str]] = None
    profile_name: Optional[str] = None
    custom_prompt: Optional[str] = None

def build_editorial_image_prompt(req: GenerateImageRequest) -> str:
    if req.custom_prompt and req.custom_prompt.strip():
        return req.custom_prompt.strip()

    mat_str = ", ".join(req.materials) if req.materials else "archival high-grade materials"
    col_str = ", ".join(req.colorways) if req.colorways else "obsidian and bone white"
    profile = req.profile_name or "Venture Pulse Studio"

    return (
        f"Archival studio product photograph of {req.title}, an exclusive limited collaboration drop "
        f"between {req.brand_name} and {profile}. Category: {req.category}. "
        f"Crafted with exquisite detail featuring {mat_str}, in colorway {col_str}. "
        f"Swiss editorial luxury presentation, Hasselblad H6D-100c medium format camera, 50mm prime lens, "
        f"crisp museum studio daylight softbox lighting, architectural hairline shadows, high contrast textures, "
        f"neutral clean background with subtle mathematical grid, 8K resolution, zero blur."
    )

def generate_editorial_fallback_svg(brand: str, title: str, category: str, profile: str) -> str:
    import urllib.parse
    cat = category.lower()
    if "tech" in cat or "synth" in cat:
        icon_path = """
        <rect x="250" y="240" width="300" height="180" rx="12" fill="#18181b" stroke="#e05d44" stroke-width="2"/>
        <rect x="270" y="260" width="120" height="60" rx="4" fill="#09090b" stroke="#3f3f46"/>
        <circle cx="430" cy="280" r="14" fill="#27272a" stroke="#e05d44"/>
        <circle cx="480" cy="280" r="14" fill="#27272a" stroke="#e05d44"/>
        <circle cx="530" cy="280" r="14" fill="#27272a" stroke="#e05d44"/>
        <line x1="270" y1="360" x2="530" y2="360" stroke="#3f3f46" stroke-dasharray="4 4"/>
        """
    elif "watch" in cat or "access" in cat:
        icon_path = """
        <circle cx="400" cy="330" r="100" fill="#18181b" stroke="#e05d44" stroke-width="2"/>
        <circle cx="400" cy="330" r="85" fill="#09090b" stroke="#3f3f46"/>
        <line x1="400" y1="330" x2="400" y2="270" stroke="#fafafa" stroke-width="2"/>
        <line x1="400" y1="330" x2="445" y2="345" stroke="#e05d44" stroke-width="2"/>
        <rect x="365" y="190" width="70" height="40" rx="4" fill="#27272a" stroke="#3f3f46"/>
        <rect x="365" y="430" width="70" height="40" rx="4" fill="#27272a" stroke="#3f3f46"/>
        """
    elif "bev" in cat or "tea" in cat:
        icon_path = """
        <rect x="320" y="230" width="160" height="220" rx="16" fill="#18181b" stroke="#e05d44" stroke-width="2"/>
        <rect x="340" y="210" width="120" height="20" rx="6" fill="#27272a" stroke="#e05d44"/>
        <circle cx="400" cy="320" r="35" fill="#09090b" stroke="#3f3f46"/>
        <text x="400" y="325" font-family="'JetBrains Mono', monospace" font-size="10" fill="#e05d44" text-anchor="middle" font-weight="bold">MATCHA</text>
        """
    else:
        icon_path = """
        <path d="M300 230 L350 200 L450 200 L500 230 L530 330 L480 340 L470 470 L330 470 L320 340 L270 330 Z" fill="#18181b" stroke="#e05d44" stroke-width="2"/>
        <line x1="400" y1="200" x2="400" y2="470" stroke="#3f3f46" stroke-width="1.5" stroke-dasharray="3 3"/>
        <rect x="345" y="270" width="40" height="45" fill="#09090b" stroke="#3f3f46" stroke-width="1"/>
        """

    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 640" width="800" height="640">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="40%" r="65%">
      <stop offset="0%" stop-color="#18181b"/>
      <stop offset="100%" stop-color="#09090b"/>
    </radialGradient>
  </defs>
  <rect width="800" height="640" fill="url(#bgGrad)"/>
  <g stroke="#27272a" stroke-width="0.75" opacity="0.6">
    <line x1="40" y1="0" x2="40" y2="640"/>
    <line x1="760" y1="0" x2="760" y2="640"/>
    <line x1="0" y1="40" x2="800" y2="40"/>
    <line x1="0" y1="600" x2="800" y2="600"/>
    <line x1="400" y1="0" x2="400" y2="640" stroke-dasharray="2 4"/>
    <line x1="0" y1="320" x2="800" y2="320" stroke-dasharray="2 4"/>
  </g>
  <text x="60" y="70" font-family="'JetBrains Mono', monospace" font-size="11" fill="#71717a" letter-spacing="2">FIG 2.4 // AI STUDIO VISUAL PROOF</text>
  <text x="740" y="70" font-family="'JetBrains Mono', monospace" font-size="10" fill="#e05d44" font-weight="bold" text-anchor="end">8K STUDIO PLATE</text>
  {icon_path}
  <text x="400" y="520" font-family="'Instrument Serif', serif" font-style="italic" font-size="28" fill="#fafafa" text-anchor="middle" letter-spacing="0.5">{title}</text>
  <text x="400" y="548" font-family="'JetBrains Mono', monospace" font-size="12" fill="#e05d44" font-weight="bold" text-anchor="middle" letter-spacing="1.5">{brand.upper()} × {profile.upper()}</text>
  <text x="400" y="575" font-family="'JetBrains Mono', monospace" font-size="9" fill="#71717a" text-anchor="middle" letter-spacing="1">ARCHIVAL CAPSULE DOSSIER • QLOO TASTE AI GROUNDED</text>
  <path d="M30 40 L40 40 L40 30" fill="none" stroke="#e05d44" stroke-width="1.5"/>
  <path d="M770 40 L760 40 L760 30" fill="none" stroke="#e05d44" stroke-width="1.5"/>
  <path d="M30 600 L40 600 L40 610" fill="none" stroke="#e05d44" stroke-width="1.5"/>
  <path d="M770 600 L760 600 L760 610" fill="none" stroke="#e05d44" stroke-width="1.5"/>
</svg>"""
    return f"data:image/svg+xml;utf8,{urllib.parse.quote(svg)}"

@router.post("/generate/image")
async def generate_product_image(req: GenerateImageRequest):
    import httpx
    settings = get_settings()
    prompt = build_editorial_image_prompt(req)
    gemini_key = settings.gemini_api_key or os.environ.get("GEMINI_API_KEY")

    image_url = None
    source = "fallback"
    notice = None

    if gemini_key:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key={gemini_key}"
            headers = {"Content-Type": "application/json"}
            body = {
                "instances": [{"prompt": prompt}],
                "parameters": {
                    "sampleCount": 1,
                    "aspectRatio": "1:1",
                    "outputOptions": {"mimeType": "image/jpeg"}
                }
            }
            async with httpx.AsyncClient(timeout=25.0) as client:
                resp = await client.post(url, json=body, headers=headers)
                if resp.status_code == 200:
                    data = resp.json()
                    predictions = data.get("predictions", [])
                    if predictions and "bytesBase64Encoded" in predictions[0]:
                        b64_img = predictions[0]["bytesBase64Encoded"]
                        image_url = f"data:image/jpeg;base64,{b64_img}"
                        source = "imagen-3"
                    else:
                        logger.warning(f"Imagen response missing predictions: {data}")
                else:
                    logger.warning(f"Imagen API returned status {resp.status_code}: {resp.text}")
        except Exception as e:
            logger.warning(f"Imagen 3 generation call failed: {e}")

    if not image_url:
        image_url = generate_editorial_fallback_svg(
            brand=req.brand_name,
            title=req.title,
            category=req.category,
            profile=req.profile_name or "Venture Pulse"
        )
        source = "fallback"
        notice = "Generated using High-Fidelity Editorial Visualizer (Add GEMINI_API_KEY to enable Imagen 3)"

    # Automatically persist to SQLite storage if card_id provided
    if req.card_id:
        deals = storage.get_deals()
        for d in deals:
            if d.get("card_id") == req.card_id:
                spec = d.get("spec") or {}
                spec["generated_image_url"] = image_url
                spec["generated_image_prompt"] = prompt
                spec["generated_image_source"] = source
                storage.save_deal(
                    card_id=d["card_id"],
                    session_id=d.get("session_id", "default"),
                    brand_name=d["brand_name"],
                    category=d["category"],
                    affinity_multiplier=d["affinity_multiplier"],
                    synergy_score=d.get("synergy_score", 0.92),
                    stage=d.get("stage", "Discovered"),
                    msrp=d.get("msrp", 185.0),
                    run_units=d.get("run_units", 500),
                    gmv=d.get("gmv", 92500.0),
                    title=d.get("title"),
                    spec_json=json.dumps(spec)
                )
                break

    return {
        "status": "SUCCESS",
        "source": source,
        "image_url": image_url,
        "prompt": prompt,
        "notice": notice,
        "card_id": req.card_id
    }
