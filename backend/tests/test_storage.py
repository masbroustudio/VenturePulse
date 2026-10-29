"""
Tests for SQLite Storage & Vector Cosine Similarity
"""
import pytest
import tempfile
import os
from backend.app.db.storage import Storage

def test_storage_lifecycle():
    with tempfile.NamedTemporaryFile(suffix=".db", delete=False) as tmp:
        db_path = tmp.name

    try:
        storage = Storage(db_path=db_path)

        # 1. Test deal saving & retrieving
        storage.save_deal("card_test_1", "sess_1", "Acne Studios", "apparel", "7.8x", 0.94, "Discovered", 185.0, 500, 92500.0)
        deals = storage.get_deals()
        assert len(deals) == 1
        assert deals[0]["brand_name"] == "Acne Studios"
        assert deals[0]["stage"] == "Discovered"

        # 2. Test deal stage transition
        updated = storage.update_deal_stage("card_test_1", "Pitch Ready")
        assert updated is True
        deals_updated = storage.get_deals(stage="Pitch Ready")
        assert len(deals_updated) == 1
        assert deals_updated[0]["stage"] == "Pitch Ready"

        # 3. Test vector embeddings and cosine similarity search
        storage.add_embedding("ent_1", "Cyberpunk", [1.0, 0.0, 0.0])
        storage.add_embedding("ent_2", "Synthwave", [0.9, 0.1, 0.0])
        storage.add_embedding("ent_3", "Pastoral Folk", [0.0, 1.0, 0.0])

        similar = storage.search_similar_entities([1.0, 0.05, 0.0], top_k=2)
        assert len(similar) == 2
        assert similar[0]["name"] in ("Cyberpunk", "Synthwave")
        assert similar[0]["similarity"] > 0.9
    finally:
        if os.path.exists(db_path):
            try:
                os.remove(db_path)
            except (PermissionError, OSError):
                pass
