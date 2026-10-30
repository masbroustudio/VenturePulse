"use client";

import React, { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import {
  X,
  Settings,
  Zap,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  Cpu,
  Server,
  Globe,
  Sparkles,
  RefreshCw,
} from "lucide-react";

interface ModelOption {
  id: string;
  name: string;
  desc: string;
}

const DEFAULT_CATALOG: Record<string, ModelOption[]> = {
  groq: [
    {
      id: "groq/qwen/qwen3.8-27b",
      name: "Qwen 2.5 32B (Default)",
      desc: "High-accuracy cultural analysis & ultra-fast synthesis (Verified Live)",
    },
    {
      id: "groq/openai/gpt-oss-120b",
      name: "GPT-OSS 120B Flagship",
      desc: "Deep reasoning & multi-agent adversarial council",
    },
    {
      id: "groq/openai/gpt-oss-20b",
      name: "GPT-OSS 20B Fast",
      desc: "Low-latency streaming & unit economics",
    },
    {
      id: "groq/allam-2-7b",
      name: "ALLaM 2 7B Instant",
      desc: "Ultra lightweight sub-50ms token generation",
    },
  ],
  gemini: [
    {
      id: "gemini/gemini-2.5-flash",
      name: "Gemini 2.5 Flash",
      desc: "Next-gen multimodal speed & reasoning",
    },
    {
      id: "gemini/gemini-1.5-pro",
      name: "Gemini 1.5 Pro",
      desc: "Complex cross-domain synthesis with 2M context window",
    },
    {
      id: "gemini/gemini-1.5-flash",
      name: "Gemini 1.5 Flash",
      desc: "Fast multimodal intelligence",
    },
  ],
  openai: [
    {
      id: "openai/gpt-4o",
      name: "GPT-4o Flagship",
      desc: "Omni model for creative direction & economics",
    },
    {
      id: "openai/gpt-4o-mini",
      name: "GPT-4o Mini",
      desc: "Fast everyday reasoning",
    },
    {
      id: "openai/o3-mini",
      name: "o3-mini",
      desc: "STEM & economic modeling reasoning specialist",
    },
  ],
  custom: [
    {
      id: "openrouter/auto",
      name: "OpenRouter Auto Router",
      desc: "Dynamic multi-model fallback gateway",
    },
    {
      id: "custom",
      name: "Custom Model Endpoint",
      desc: "Any OpenAI-compatible v1 endpoint / Ollama",
    },
  ],
};

export const SettingsModal: React.FC = () => {
  const { isSettingsModalOpen, setSettingsModalOpen, showToast } = useAppStore();

  const [provider, setProvider] = useState<"groq" | "gemini" | "openai" | "custom">("groq");
  const [selectedModel, setSelectedModel] = useState<string>("groq/qwen/qwen3.8-27b");
  const [customModel, setCustomModel] = useState<string>("");
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>("");
  const [showKey, setShowKey] = useState<boolean>(false);
  const [baseUrl, setBaseUrl] = useState<string>("");

  const [catalog, setCatalog] = useState<Record<string, ModelOption[]>>(DEFAULT_CATALOG);
  const [envKeys, setEnvKeys] = useState<{ groq: boolean; gemini: boolean; openai: boolean; custom: boolean }>({
    groq: false,
    gemini: false,
    openai: false,
    custom: false,
  });

  // Testing status
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    latencyMs?: number;
    message?: string;
  } | null>(null);

  // Load existing settings from backend & localStorage on open
  useEffect(() => {
    if (!isSettingsModalOpen) return;

    // Load from backend
    fetch("/api/settings/llm")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          if (data.catalog) setCatalog(data.catalog);
          if (data.env_keys) setEnvKeys(data.env_keys);
          if (data.active_provider) setProvider(data.active_provider);
          if (data.active_model) {
            setSelectedModel(data.active_model);
            const modelsInProvider = (data.catalog?.[data.active_provider] || []).map((m: any) => m.id);
            if (!modelsInProvider.includes(data.active_model)) {
              setIsCustomMode(true);
              setCustomModel(data.active_model);
            }
          }
          if (data.base_url) setBaseUrl(data.base_url);
        }
      })
      .catch((err) => console.warn("Could not fetch remote LLM settings:", err));

    // Also check localStorage
    try {
      const stored = localStorage.getItem("venture_pulse_llm");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.apiKey) setApiKey(parsed.apiKey);
        if (parsed.provider) setProvider(parsed.provider);
        if (parsed.model) setSelectedModel(parsed.model);
        if (parsed.baseUrl) setBaseUrl(parsed.baseUrl);
      }
    } catch {
      // Ignore localStorage parse errors
    }
  }, [isSettingsModalOpen]);

  if (!isSettingsModalOpen) return null;

  const activeModel = isCustomMode ? customModel : selectedModel;
  const currentModels = catalog[provider] || DEFAULT_CATALOG[provider] || [];

  const handleProviderChange = (newProvider: "groq" | "gemini" | "openai" | "custom") => {
    setProvider(newProvider);
    setIsCustomMode(false);
    setTestResult(null);

    const firstModel = catalog[newProvider]?.[0]?.id || DEFAULT_CATALOG[newProvider]?.[0]?.id || "";
    setSelectedModel(firstModel);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      const res = await fetch("/api/settings/test-llm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          model: activeModel,
          api_key: apiKey.trim() || undefined,
          base_url: baseUrl.trim() || undefined,
          probe_prompt: "Validate Venture Pulse cultural intelligence connection in 1 short sentence.",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Connection test failed");
      }

      setTestResult({
        success: true,
        latencyMs: data.latency_ms,
        message: data.message,
      });
      showToast(`⚡ Model responded in ${data.latency_ms}ms!`);
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || "Failed to reach LLM endpoint",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch("/api/settings/llm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          model: activeModel,
          api_key: apiKey.trim() || undefined,
          base_url: baseUrl.trim() || undefined,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save LLM settings to backend");
      }

      // Persist in localStorage
      localStorage.setItem(
        "venture_pulse_llm",
        JSON.stringify({
          provider,
          model: activeModel,
          apiKey: apiKey.trim(),
          baseUrl: baseUrl.trim(),
        })
      );

      showToast(`✓ Active LLM configured: ${activeModel}`);
      setSettingsModalOpen(false);
    } catch (err: any) {
      showToast(`Error saving settings: ${err.message}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-surface dark:bg-darkSurface border border-editorial max-w-2xl w-full max-h-[92vh] overflow-y-auto rounded-xl p-6 sm:p-8 space-y-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-editorial pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded bg-terracotta/10 text-terracotta flex items-center justify-center border border-terracotta/30">
              <Settings className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h2 className="font-serif italic text-2xl text-ink dark:text-darkInk">
                LLM Engine &amp; Provider Settings
              </h2>
              <p className="text-xs text-inkMuted dark:text-darkMuted font-mono">
                Configure inference model for LangGraph Council &amp; Cultural Copilot
              </p>
            </div>
          </div>
          <button
            onClick={() => setSettingsModalOpen(false)}
            className="p-1.5 rounded hover:bg-subtle dark:hover:bg-darkSubtle text-inkMuted hover:text-ink dark:text-darkMuted dark:hover:text-darkInk transition"
            title="Close Settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Provider Tabs */}
        <div className="space-y-2">
          <label className="text-[11px] font-mono uppercase tracking-wider text-inkMuted dark:text-darkMuted font-semibold">
            1. Select AI Provider
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: "groq", label: "Groq LPU", desc: "Ultra-Fast", icon: Zap },
              { id: "gemini", label: "Google Gemini", desc: "Multimodal", icon: Sparkles },
              { id: "openai", label: "OpenAI", desc: "GPT-4o Flagship", icon: Cpu },
              { id: "custom", label: "Custom / Router", desc: "OpenRouter / BaseURL", icon: Globe },
            ].map((p) => {
              const Icon = p.icon;
              const isActive = provider === p.id;
              const hasEnvKey = envKeys[p.id as keyof typeof envKeys];

              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleProviderChange(p.id as any)}
                  className={`p-3 rounded-lg border text-left transition flex flex-col justify-between space-y-1.5 ${
                    isActive
                      ? "border-terracotta bg-terracotta/5 dark:bg-terracotta/10 text-ink dark:text-darkInk shadow-sm"
                      : "border-editorial bg-subtle/50 dark:bg-darkSubtle/50 text-inkMuted dark:text-darkMuted hover:border-terracotta/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Icon className={`w-4 h-4 ${isActive ? "text-terracotta" : "text-inkMuted"}`} />
                    {hasEnvKey && (
                      <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-emerald/15 text-emerald border border-emerald/30 font-bold" title="API Key detected in server .env">
                        .env
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-xs">{p.label}</div>
                    <div className="text-[10px] opacity-75">{p.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Model Selection */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-mono uppercase tracking-wider text-inkMuted dark:text-darkMuted font-semibold">
              2. Choose Model
            </label>
            <button
              type="button"
              onClick={() => setIsCustomMode(!isCustomMode)}
              className="text-[11px] font-mono text-terracotta hover:underline"
            >
              {isCustomMode ? "← Choose from Curated List" : "Enter Custom Model ID →"}
            </button>
          </div>

          {!isCustomMode ? (
            <div className="space-y-1.5">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-editorial bg-surface dark:bg-darkSurface text-ink dark:text-darkInk font-mono text-xs focus:outline-none focus:border-terracotta transition"
              >
                {currentModels.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} — ({m.id})
                  </option>
                ))}
              </select>
              {currentModels.find((m) => m.id === selectedModel)?.desc && (
                <p className="text-[11px] font-mono text-inkMuted dark:text-darkMuted px-1">
                  💡 {currentModels.find((m) => m.id === selectedModel)?.desc}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-1">
              <input
                type="text"
                value={customModel}
                onChange={(e) => setCustomModel(e.target.value)}
                placeholder={provider === "groq" ? "groq/qwen/qwen3.8-27b" : provider === "gemini" ? "gemini/gemini-2.5-flash" : "openai/gpt-4o"}
                className="w-full px-3 py-2.5 rounded-lg border border-editorial bg-surface dark:bg-darkSurface text-ink dark:text-darkInk font-mono text-xs focus:outline-none focus:border-terracotta transition"
              />
              <p className="text-[10px] font-mono text-inkMuted dark:text-darkMuted">
                Prefix format: <code>groq/&lt;model&gt;</code>, <code>gemini/&lt;model&gt;</code>, or <code>openai/&lt;model&gt;</code> for LiteLLM routing.
              </p>
            </div>
          )}
        </div>

        {/* API Key Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-mono uppercase tracking-wider text-inkMuted dark:text-darkMuted font-semibold">
              3. API Key
            </label>
            {envKeys[provider] && !apiKey && (
              <span className="text-[10px] font-mono text-emerald flex items-center space-x-1">
                <Check className="w-3 h-3" />
                <span>Using default key from backend environment</span>
              </span>
            )}
          </div>
          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={
                envKeys[provider]
                  ? "• • • • • • • • (Leave blank to use .env key, or enter custom key)"
                  : provider === "groq"
                  ? "gsk_..."
                  : provider === "gemini"
                  ? "AIzaSy..."
                  : "sk-..."
              }
              className="w-full px-3 py-2.5 pr-10 rounded-lg border border-editorial bg-surface dark:bg-darkSurface text-ink dark:text-darkInk font-mono text-xs focus:outline-none focus:border-terracotta transition"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-2.5 text-inkMuted hover:text-ink dark:text-darkMuted dark:hover:text-darkInk transition"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Custom Base URL (if custom / openrouter) */}
        {provider === "custom" && (
          <div className="space-y-2">
            <label className="text-[11px] font-mono uppercase tracking-wider text-inkMuted dark:text-darkMuted font-semibold">
              Custom Endpoint Base URL (Optional)
            </label>
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://openrouter.ai/api/v1 or http://localhost:11434/v1"
              className="w-full px-3 py-2.5 rounded-lg border border-editorial bg-surface dark:bg-darkSurface text-ink dark:text-darkInk font-mono text-xs focus:outline-none focus:border-terracotta transition"
            />
          </div>
        )}

        {/* Live Test Results Alert */}
        {testResult && (
          <div
            className={`p-3.5 rounded-lg border font-mono text-xs space-y-1 ${
              testResult.success
                ? "bg-emerald/10 border-emerald/30 text-emerald-800 dark:text-emerald-300"
                : "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400"
            }`}
          >
            <div className="flex items-center space-x-2 font-bold">
              {testResult.success ? (
                <>
                  <Check className="w-4 h-4 text-emerald" />
                  <span>Connection Verified ({testResult.latencyMs}ms latency)</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span>Connection Failed</span>
                </>
              )}
            </div>
            {testResult.message && (
              <p className="text-[11px] opacity-90 leading-relaxed font-sans">
                {testResult.message}
              </p>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-editorial">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={isTesting}
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-editorial hover:border-terracotta bg-subtle dark:bg-darkSubtle text-ink dark:text-darkInk font-mono text-xs flex items-center justify-center space-x-2 transition disabled:opacity-50"
          >
            {isTesting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-terracotta" />
                <span>Testing Connection...</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 text-terracotta" />
                <span>⚡ Test Connection</span>
              </>
            )}
          </button>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setSettingsModalOpen(false)}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-lg border border-editorial text-inkMuted dark:text-darkMuted hover:text-ink font-mono text-xs transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-lg bg-ink text-surface dark:bg-surface dark:text-ink font-mono text-xs uppercase tracking-wider font-bold hover:bg-terracotta dark:hover:bg-terracotta hover:text-white transition shadow"
            >
              Save &amp; Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
