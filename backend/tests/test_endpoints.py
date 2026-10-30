"""
Tests for FastAPI API Endpoints
"""
import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["qloo_api_status"] == "AUTHENTICATED"

def test_resolve_endpoint():
    response = client.post("/api/qloo/resolve", json={"query": "Acne Studios"})
    assert response.status_code == 200
    data = response.json()
    assert data["count"] > 0
    assert "Acne" in data["results"][0]["name"]

def test_crm_deals_endpoint():
    response = client.get("/api/crm/deals")
    assert response.status_code == 200
    data = response.json()
    assert "deals" in data
    assert len(data["deals"]) >= 4
    assert "metrics" in data
    assert data["metrics"]["total_pipeline_value"] > 0

def test_eval_benchmark_endpoint():
    response = client.get("/api/eval/benchmark")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "PASS"
    assert data["composite_score"] >= 0.85

def test_vector_search_endpoint():
    # First resolve an entity to index it
    client.post("/api/qloo/resolve", json={"query": "Acne Studios"})
    # Now search vector
    response = client.post("/api/vector/search", json={"query": "minimalist denim", "top_k": 3})
    assert response.status_code == 200
    data = response.json()
    assert "results" in data
    assert len(data["results"]) > 0

def test_settings_llm_lifecycle():
    # 1. Fetch current LLM settings
    res = client.get("/api/settings/llm")
    assert res.status_code == 200
    data = res.json()
    assert "active_provider" in data
    assert "active_model" in data
    assert "catalog" in data
    assert "groq" in data["catalog"]

    # 2. Update LLM settings
    update_res = client.post("/api/settings/llm", json={
        "provider": "gemini",
        "model": "gemini/gemini-2.5-flash",
    })
    assert update_res.status_code == 200
    updated_data = update_res.json()
    assert updated_data["active_provider"] == "gemini"
    assert updated_data["active_model"] == "gemini/gemini-2.5-flash"

    # Reset back to groq
    client.post("/api/settings/llm", json={
        "provider": "groq",
        "model": "groq/qwen/qwen3.8-27b",
    })

