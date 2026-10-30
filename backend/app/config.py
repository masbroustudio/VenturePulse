"""
Venture Pulse Backend - Configuration & Environment Validation
"""
import os
from pathlib import Path
from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

# Project root path
ROOT_DIR = Path(__file__).resolve().parent.parent.parent
ENV_FILE = ROOT_DIR / ".env"

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=ENV_FILE,
        env_file_encoding="utf-8",
        extra="ignore"
    )

    # Qloo Cultural AI API (Strict live configuration)
    qloo_api_key: str = Field(default=..., alias="QLOO_API_KEY")
    qloo_api_base_url: str = Field(default="https://hackathon.api.qloo.com", alias="QLOO_API_BASE_URL")

    # Multi-Provider LLM Configuration (LiteLLM)
    ai_provider: str = Field(default="groq", alias="AI_PROVIDER")
    llm_model: str = Field(default="groq/qwen/qwen3.8-27b", alias="LLM_MODEL")
    groq_api_key: Optional[str] = Field(default=None, alias="GROQ_API_KEY")
    gemini_api_key: Optional[str] = Field(default=None, alias="GEMINI_API_KEY")
    openai_api_key: Optional[str] = Field(default=None, alias="OPENAI_API_KEY")
    openai_base_url: Optional[str] = Field(default=None, alias="OPENAI_BASE_URL")

    # Persistence
    database_path: str = Field(default="backend/data/venture_pulse.db", alias="DATABASE_PATH")
    supabase_url: Optional[str] = Field(default=None, alias="SUPABASE_URL")
    supabase_key: Optional[str] = Field(default=None, alias="SUPABASE_ANON_KEY")

    # Server Configuration
    port: int = Field(default=8000, alias="PORT")
    host: str = Field(default="0.0.0.0", alias="HOST")

def get_settings() -> Settings:
    return Settings()

# Multi-Provider Model Catalog
MODEL_CATALOG = {
    "groq": [
        {"id": "groq/qwen/qwen3.8-27b", "name": "Qwen 2.5 32B (Default)", "desc": "High-accuracy cultural analysis & ultra-fast synthesis (Verified Live)"},
        {"id": "groq/openai/gpt-oss-120b", "name": "GPT-OSS 120B Flagship", "desc": "Deep reasoning & multi-agent adversarial council"},
        {"id": "groq/openai/gpt-oss-20b", "name": "GPT-OSS 20B Fast", "desc": "Low-latency streaming & unit economics"},
        {"id": "groq/allam-2-7b", "name": "ALLaM 2 7B Instant", "desc": "Ultra lightweight sub-50ms token generation"},
    ],
    "gemini": [
        {"id": "gemini/gemini-2.5-flash", "name": "Gemini 2.5 Flash", "desc": "Next-gen multimodal speed & reasoning"},
        {"id": "gemini/gemini-1.5-pro", "name": "Gemini 1.5 Pro", "desc": "Complex cross-domain synthesis with 2M context window"},
        {"id": "gemini/gemini-1.5-flash", "name": "Gemini 1.5 Flash", "desc": "Fast multimodal intelligence"},
    ],
    "openai": [
        {"id": "openai/gpt-4o", "name": "GPT-4o Flagship", "desc": "Omni model for creative direction & economics"},
        {"id": "openai/gpt-4o-mini", "name": "GPT-4o Mini", "desc": "Fast everyday reasoning"},
        {"id": "openai/o3-mini", "name": "o3-mini", "desc": "STEM & economic modeling reasoning specialist"},
    ],
    "custom": [
        {"id": "openrouter/auto", "name": "OpenRouter Auto Router", "desc": "Dynamic multi-model fallback gateway"},
        {"id": "custom", "name": "Custom Model Endpoint", "desc": "Any OpenAI-compatible v1 endpoint / Ollama"},
    ]
}

class RuntimeLLMConfig:
    def __init__(self):
        settings = get_settings()
        self.provider = settings.ai_provider or "groq"
        self.model = settings.llm_model or "groq/qwen/qwen3.8-27b"
        self.api_key = None
        self.base_url = settings.openai_base_url

_runtime_llm = RuntimeLLMConfig()

def get_runtime_llm() -> RuntimeLLMConfig:
    global _runtime_llm
    return _runtime_llm

def update_runtime_llm(provider: str, model: str, api_key: Optional[str] = None, base_url: Optional[str] = None) -> RuntimeLLMConfig:
    global _runtime_llm
    _runtime_llm.provider = provider
    _runtime_llm.model = model
    if api_key:
        _runtime_llm.api_key = api_key
    if base_url is not None:
        _runtime_llm.base_url = base_url
    return _runtime_llm
