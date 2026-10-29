"""
Venture Pulse - Strict Live Qloo API Client
"""
import logging
from typing import List, Dict, Any, Optional
import httpx
from backend.app.config import get_settings
from backend.app.qloo.models import QlooEntity, QlooSearchResponse, QlooInsightsResponse

logger = logging.getLogger(__name__)

class QlooAPIError(Exception):
    """Base exception for Qloo API operations"""
    pass

class QlooAuthenticationError(QlooAPIError):
    """Raised when QLOO_API_KEY is missing, unauthorized, or invalid (401/403)"""
    pass

class QlooValidationError(QlooAPIError):
    """Raised when request payload or parameters fail validation (400/422)"""
    pass

class QlooNetworkError(QlooAPIError):
    """Raised when connection to Qloo gateway fails or times out"""
    pass

class QlooClient:
    def __init__(self, api_key: Optional[str] = None, base_url: Optional[str] = None):
        settings = get_settings()
        self.api_key = api_key or settings.qloo_api_key
        if not self.api_key or self.api_key == "your_qloo_api_key_here":
            raise QlooAuthenticationError(
                "QLOO_API_KEY is not configured or contains a placeholder. "
                "Please configure an active key in your .env file."
            )
        self.base_url = (base_url or settings.qloo_api_base_url).rstrip("/")
        self.headers = {
            "X-Api-Key": self.api_key,
            "Authorization": f"Bearer {self.api_key}",
            "Accept": "application/json"
        }

    async def search_entities(self, query: str, entity_type: Optional[str] = None) -> List[QlooEntity]:
        """
        Search for entities across music, cinema, brands, dining, and aesthetics.
        GET /v2/search?query=...
        """
        url = f"{self.base_url}/v2/search"
        params: Dict[str, Any] = {"query": query}
        if entity_type:
            params["types"] = entity_type

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                resp = await client.get(url, params=params, headers=self.headers)
                if resp.status_code in (401, 403):
                    raise QlooAuthenticationError(f"Qloo Authentication Failed ({resp.status_code}): Invalid QLOO_API_KEY.")
                if resp.status_code == 400:
                    raise QlooValidationError(f"Qloo Search Error: {resp.text}")
                resp.raise_for_status()

                data = resp.json()
                results = data.get("results", [])
                return [QlooEntity(**item) for item in results]
        except httpx.RequestError as e:
            raise QlooNetworkError(f"Network error communicating with Qloo gateway: {str(e)}")

    async def get_insights(
        self,
        entity_id: str,
        filter_type: str = "urn:entity:brand",
        sample_size: int = 20
    ) -> List[QlooEntity]:
        """
        Query cross-domain affinities and recommended brand/subculture entities.
        GET /v2/insights?filter.type=...&signal.interests.entities=...
        """
        url = f"{self.base_url}/v2/insights"
        params: Dict[str, Any] = {
            "filter.type": filter_type,
            "signal.interests.entities": entity_id
        }

        try:
            async with httpx.AsyncClient(timeout=20.0) as client:
                resp = await client.get(url, params=params, headers=self.headers)
                if resp.status_code in (401, 403):
                    raise QlooAuthenticationError(f"Qloo Authentication Failed ({resp.status_code}): Invalid QLOO_API_KEY.")
                if resp.status_code == 400:
                    raise QlooValidationError(f"Qloo Insights Error: {resp.text}")
                resp.raise_for_status()

                data = resp.json()
                results_dict = data.get("results", {})
                entities_raw = results_dict.get("entities", [])
                
                entities: List[QlooEntity] = []
                for item in entities_raw[:sample_size]:
                    # Harmonize score/affinity
                    score = item.get("score") or item.get("affinity") or item.get("popularity") or 0.0
                    item["score"] = score
                    entities.append(QlooEntity(**item))
                return entities
        except httpx.RequestError as e:
            raise QlooNetworkError(f"Network error communicating with Qloo gateway: {str(e)}")

    async def resolve_creator_profile(self, anchors: List[str], target_domain: str = "urn:entity:brand") -> Dict[str, Any]:
        """
        Takes human-readable seed anchors (e.g. ['Acne Studios', 'Synthwave', 'Blade Runner 2049']),
        resolves them to canonical Qloo entities, and fetches cross-domain affinities.
        """
        resolved_seeds: List[QlooEntity] = []
        for anchor in anchors:
            search_res = await self.search_entities(anchor)
            if search_res:
                resolved_seeds.append(search_res[0])

        if not resolved_seeds:
            return {
                "seeds": [],
                "insights": []
            }

        # Query insights using the primary resolved seed
        primary_seed = resolved_seeds[0]
        insights = await self.get_insights(primary_seed.entity_id, filter_type=target_domain)

        return {
            "primary_seed": primary_seed.model_dump(),
            "resolved_seeds": [s.model_dump() for s in resolved_seeds],
            "insights": [e.model_dump() for e in insights]
        }
