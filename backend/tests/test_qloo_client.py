"""
Tests for Live Qloo API Client
"""
import pytest
from backend.app.qloo.client import QlooClient, QlooAuthenticationError

@pytest.mark.asyncio
async def test_qloo_client_initialization():
    client = QlooClient()
    assert client.api_key is not None
    assert "hackathon.api.qloo.com" in client.base_url

@pytest.mark.asyncio
async def test_qloo_live_search():
    client = QlooClient()
    results = await client.search_entities("Acne Studios")
    assert len(results) > 0
    top = results[0]
    assert "Acne" in top.name
    assert top.entity_id is not None
    assert top.subtype is not None

@pytest.mark.asyncio
async def test_qloo_live_insights():
    client = QlooClient()
    # Search entity first
    search_res = await client.search_entities("Acne Studios")
    assert len(search_res) > 0
    entity_id = search_res[0].entity_id

    insights = await client.get_insights(entity_id, filter_type="urn:entity:brand", sample_size=5)
    assert len(insights) > 0
    assert insights[0].name is not None
    assert insights[0].score is not None
