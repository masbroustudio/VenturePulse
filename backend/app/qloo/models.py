"""
Venture Pulse - Qloo Data Models
"""
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class QlooEntity(BaseModel):
    entity_id: str
    name: str
    type: str = "urn:entity"
    subtype: Optional[str] = None
    popularity: Optional[float] = 0.0
    score: Optional[float] = None
    affinity: Optional[float] = None
    properties: Dict[str, Any] = Field(default_factory=dict)
    tags: List[Dict[str, Any]] = Field(default_factory=list)
    external: Dict[str, Any] = Field(default_factory=dict)

class QlooSearchResponse(BaseModel):
    results: List[QlooEntity] = Field(default_factory=list)

class QlooInsightsResult(BaseModel):
    entities: List[QlooEntity] = Field(default_factory=list)

class QlooInsightsResponse(BaseModel):
    success: bool = True
    results: QlooInsightsResult = Field(default_factory=QlooInsightsResult)
