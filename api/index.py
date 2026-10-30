"""
Venture Pulse — Vercel Serverless Function Entrypoint
Routes all /api/* requests directly into the FastAPI application.
"""
import sys
from pathlib import Path

# Ensure project root is in sys.path so 'backend.app...' imports resolve cleanly
ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from backend.app.main import app

# Export ASGI application for @vercel/python runtime
__all__ = ["app"]
