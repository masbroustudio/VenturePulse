"""
Venture Pulse - Main FastAPI Application
"""
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from backend.app.api.endpoints import router as api_router
from backend.app.config import get_settings

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("venture_pulse")

app = FastAPI(
    title="Venture Pulse Cultural AI Engine",
    version="1.0.0",
    description="Autonomous Subcultural Arbitrage & Deal Desk Backend grounded in Qloo's 250M+ Taste Graph",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for local dev & testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Router
app.include_router(api_router)

@app.get("/", include_in_schema=False)
async def root():
    return RedirectResponse(url="/docs")

if __name__ == "__main__":
    import uvicorn
    settings = get_settings()
    uvicorn.run("backend.app.main:app", host=settings.host, port=settings.port, reload=True)
