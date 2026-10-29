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
