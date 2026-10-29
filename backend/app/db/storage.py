"""
Venture Pulse - Local SQLite Storage & In-Memory Vector Search
"""
import sqlite3
import json
import logging
import hashlib
from pathlib import Path
from typing import Dict, Any, List, Optional
import numpy as np
from backend.app.config import get_settings

logger = logging.getLogger(__name__)

def compute_semantic_vector(text: str, dim: int = 64) -> List[float]:
    """
    Computes a deterministic, normalized vector embedding using semantic character n-grams.
    Ensures zero external latency and fast, reproducible cosine similarities.
    """
    clean = text.lower().strip()
    vec = np.zeros(dim, dtype=np.float32)
    for i in range(max(1, len(clean) - 2)):
        trigram = clean[i:i+3]
        h = int(hashlib.md5(trigram.encode('utf-8')).hexdigest()[:8], 16)
        idx = h % dim
        sign = 1.0 if (h // dim) % 2 == 0 else -1.0
        vec[idx] += sign * (1.0 + (i / max(1, len(clean))))
    
    norm = np.linalg.norm(vec)
    if norm > 0:
        vec /= norm
    return vec.tolist()

class Storage:
    def __init__(self, db_path: Optional[str] = None):
        settings = get_settings()
        self.db_path = Path(db_path or settings.database_path)
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        self._init_db()

    def _get_connection(self) -> sqlite3.Connection:
        conn = sqlite3.connect(str(self.db_path))
        conn.row_factory = sqlite3.Row
        return conn

    def _init_db(self):
        with self._get_connection() as conn:
            cursor = conn.cursor()
            # Sessions table
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS sessions (
                session_id TEXT PRIMARY KEY,
                profile_name TEXT NOT NULL,
                mode TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                state_json TEXT NOT NULL
            )
            """)
            # Deals / CRM cards table
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS deals (
                card_id TEXT PRIMARY KEY,
                session_id TEXT,
                brand_name TEXT NOT NULL,
                title TEXT,
                category TEXT NOT NULL,
                affinity_multiplier TEXT NOT NULL,
                synergy_score REAL NOT NULL,
                stage TEXT NOT NULL DEFAULT 'Discovered',
                msrp REAL DEFAULT 185.0,
                run_units INTEGER DEFAULT 500,
                gmv REAL DEFAULT 92500.0,
                spec_json TEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """)

            # Auto-migrate existing deals table if columns are missing
            cursor.execute("PRAGMA table_info(deals)")
            existing_cols = [col["name"] for col in cursor.fetchall()]
            if "title" not in existing_cols:
                cursor.execute("ALTER TABLE deals ADD COLUMN title TEXT")
            if "spec_json" not in existing_cols:
                cursor.execute("ALTER TABLE deals ADD COLUMN spec_json TEXT")
            # Vector embeddings table
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS embeddings (
                entity_id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                vector_json TEXT NOT NULL
            )
            """)
            conn.commit()

    def save_session(self, session_id: str, profile_name: str, mode: str, state_dict: Dict[str, Any]):
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
            INSERT OR REPLACE INTO sessions (session_id, profile_name, mode, state_json)
            VALUES (?, ?, ?, ?)
            """, (session_id, profile_name, mode, json.dumps(state_dict)))
            conn.commit()

    def get_session(self, session_id: str) -> Optional[Dict[str, Any]]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT state_json FROM sessions WHERE session_id = ?", (session_id,))
            row = cursor.fetchone()
            if row:
                return json.loads(row["state_json"])
        return None

    def save_deal(
        self,
        card_id: str,
        session_id: str,
        brand_name: str,
        category: str,
        affinity_multiplier: str,
        synergy_score: float,
        stage: str = "Discovered",
        msrp: float = 185.0,
        run_units: int = 500,
        gmv: float = 92500.0,
        title: Optional[str] = None,
        spec_json: Optional[str] = None,
    ):
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
            INSERT OR REPLACE INTO deals (card_id, session_id, brand_name, title, category, affinity_multiplier, synergy_score, stage, msrp, run_units, gmv, spec_json, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            """, (card_id, session_id, brand_name, title, category, affinity_multiplier, synergy_score, stage, msrp, run_units, gmv, spec_json))
            conn.commit()

    def get_deals(self, stage: Optional[str] = None) -> List[Dict[str, Any]]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            if stage:
                cursor.execute("SELECT * FROM deals WHERE stage = ? ORDER BY updated_at DESC", (stage,))
            else:
                cursor.execute("SELECT * FROM deals ORDER BY updated_at DESC")
            rows = cursor.fetchall()
            deals = []
            for row in rows:
                d = dict(row)
                if d.get("spec_json"):
                    try:
                        d["spec"] = json.loads(d["spec_json"])
                    except Exception:
                        d["spec"] = None
                else:
                    d["spec"] = None
                deals.append(d)
            return deals

    def update_deal_stage(self, card_id: str, new_stage: str) -> bool:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
            UPDATE deals SET stage = ?, updated_at = CURRENT_TIMESTAMP WHERE card_id = ?
            """, (new_stage, card_id))
            conn.commit()
            return cursor.rowcount > 0

    def add_embedding(self, entity_id: str, name: str, vector: List[float]):
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
            INSERT OR REPLACE INTO embeddings (entity_id, name, vector_json)
            VALUES (?, ?, ?)
            """, (entity_id, name, json.dumps(vector)))
            conn.commit()

    def search_similar_entities(self, query_vector: List[float], top_k: int = 5) -> List[Dict[str, Any]]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT entity_id, name, vector_json FROM embeddings")
            rows = cursor.fetchall()

        if not rows:
            return []

        q_vec = np.array(query_vector, dtype=np.float32)
        q_norm = np.linalg.norm(q_vec)
        if q_norm == 0:
            return []

        results = []
        for row in rows:
            v = np.array(json.loads(row["vector_json"]), dtype=np.float32)
            v_norm = np.linalg.norm(v)
            if v_norm > 0:
                similarity = float(np.dot(q_vec, v) / (q_norm * v_norm))
                results.append({
                    "entity_id": row["entity_id"],
                    "name": row["name"],
                    "similarity": round(similarity, 4)
                })

        results.sort(key=lambda x: x["similarity"], reverse=True)
        return results[:top_k]

    def index_entity(self, entity_id: str, name: str, context: str = ""):
        """
        Embeds an entity with its context and saves it to the SQLite embeddings table.
        """
        text = f"{name} {context}".strip()
        vec = compute_semantic_vector(text)
        self.add_embedding(entity_id, name, vec)

    def search_semantic_entities(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """
        Searches the embeddings table by text query using cosine similarity.
        """
        query_vec = compute_semantic_vector(query)
        return self.search_similar_entities(query_vec, top_k=top_k)
