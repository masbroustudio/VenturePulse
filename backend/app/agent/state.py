"""
Venture Pulse - Agent Council State & Schemas
"""
from typing import List, Dict, Any, Optional, Literal
from pydantic import BaseModel, Field

AgentRole = Literal["cultural_analyst", "brand_strategist", "creative_director"]

class TurnMessage(BaseModel):
    role: AgentRole
    agent_name: str
    cycle: int = 1
    thought_reasoning: str
    content: str
    tool_calls: Optional[List[Dict[str, Any]]] = None
    synergy_score: Optional[float] = None
    consensus_status: Optional[str] = None  # "CONFLICT_REJECTED", "APPROVED", "REFINED"

class ProductCollabSpec(BaseModel):
    title: str
    brand_partner: str
    category: str = "apparel"
    affinity_multiplier: str = "7.8x"
    description: str
    materials: List[str] = Field(default_factory=list)
    colorways: List[str] = Field(default_factory=list)
    msrp_usd: float = 185.0
    run_units: int = 500
    projected_gmv: float = 92500.0
    creator_royalty_pct: float = 0.18
    projected_royalty: float = 16650.0
    outreach_pitch: str

class DeliberationSessionState(BaseModel):
    session_id: str
    profile_name: str
    mode: str = "creator"  # "creator" or "brand"
    anchors: List[str] = Field(default_factory=list)
    active_cycle: int = 1
    turns: List[TurnMessage] = Field(default_factory=list)
    candidate_brands: List[Dict[str, Any]] = Field(default_factory=list)
    final_product: Optional[ProductCollabSpec] = None
    consensus_reached: bool = False
    founder_constraints: List[str] = Field(default_factory=list)
