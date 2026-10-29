"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store";
import { X, Activity, Server, Zap } from "lucide-react";

export const TelemetryDrawer: React.FC = () => {
  const { isTelemetryOpen, setTelemetryOpen, activeProfile, backendOnline } = useAppStore();
  const [cacheMode, setCacheMode] = useState<"lru" | "live" | "fallback">("live");

  if (!isTelemetryOpen) return null;

  const mockPayload = {
    status: 200,
    gateway: "hackathon.api.qloo.com",
    active_profile: activeProfile.name,
    cached_entities: 250000000,
    query_spans: [
      { endpoint: "/v2/search", latency_ms: 42, status: "CACHE_HIT" },
      { endpoint: "/v2/insights", latency_ms: 188, status: "200_OK" },
    ],
    top_latent_matches: activeProfile.graph.brands.map((b) => ({
      entity_urn: `urn:entity:brand:${b.id}`,
      name: b.name,
      affinity_multiplier: b.affinity,
      cosine_similarity: (1 - Math.random() * 0.15).toFixed(3),
    })),
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end animate-fade-in">
      <div className="w-full sm:w-[440px] bg-surface dark:bg-darkSurface border-l border-editorial p-6 shadow-2xl font-mono text-xs space-y-5 overflow-y-auto h-full flex flex-col justify-between">
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-editorial pb-3">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan animate-pulse"></span>
              <span className="font-bold text-ink dark:text-darkInk flex items-center space-x-1.5">
                <Activity className="w-4 h-4 text-cyan" />
                <span>LangFuse &amp; Supabase Traces</span>
              </span>
            </div>
            <button
              onClick={() => setTelemetryOpen(false)}
              className="text-inkMuted dark:text-darkMuted hover:text-ink dark:hover:text-darkInk p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 3-Way Cache Mode Toggle */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] text-inkMuted dark:text-darkMuted uppercase">
              <span>Gateway Mode Simulator:</span>
              <span className="text-cyan font-bold">
                {cacheMode === "live" ? "LIVE QLOO API" : cacheMode === "lru" ? "LRU CACHE HIT (<5ms)" : "OFFLINE FALLBACK"}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1 bg-subtle dark:bg-darkSubtle p-1 rounded border border-editorial text-[10px]">
              <button
                onClick={() => setCacheMode("lru")}
                className={`py-1 rounded font-bold transition ${
                  cacheMode === "lru"
                    ? "bg-surface dark:bg-darkSurface text-ink dark:text-darkInk shadow-sm"
                    : "text-inkMuted dark:text-darkMuted hover:text-ink"
                }`}
              >
                LRU Cache
              </button>
              <button
                onClick={() => setCacheMode("live")}
                className={`py-1 rounded font-bold transition ${
                  cacheMode === "live"
                    ? "bg-surface dark:bg-darkSurface text-ink dark:text-darkInk shadow-sm"
                    : "text-inkMuted dark:text-darkMuted hover:text-ink"
                }`}
              >
                Live API
              </button>
              <button
                onClick={() => setCacheMode("fallback")}
                className={`py-1 rounded font-bold transition ${
                  cacheMode === "fallback"
                    ? "bg-surface dark:bg-darkSurface text-ink dark:text-darkInk shadow-sm"
                    : "text-inkMuted dark:text-darkMuted hover:text-ink"
                }`}
              >
                Fallback
              </button>
            </div>
          </div>

          {/* Chronological Gantt Span Waterfall */}
          <div className="space-y-2">
            <span className="text-[10px] text-inkMuted dark:text-darkMuted uppercase block font-semibold">
              Chronological Execution Spans
            </span>

            <div className="space-y-2 bg-paper dark:bg-darkSubtle p-3 rounded border border-editorial">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span>GET /v2/search (Resolution)</span>
                  <span className="text-emerald font-bold">42 ms</span>
                </div>
                <div className="w-full bg-subtle dark:bg-darkSurface h-1.5 rounded overflow-hidden">
                  <div className="bg-cyan h-full" style={{ width: "25%" }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span>GET /v2/insights (Cross-Domain)</span>
                  <span className="text-emerald font-bold">188 ms</span>
                </div>
                <div className="w-full bg-subtle dark:bg-darkSurface h-1.5 rounded overflow-hidden">
                  <div className="bg-terracotta h-full" style={{ width: "65%" }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span>LangGraph Council (Consensus Loop)</span>
                  <span className="text-emerald font-bold">210 ms</span>
                </div>
                <div className="w-full bg-subtle dark:bg-darkSurface h-1.5 rounded overflow-hidden">
                  <div className="bg-gold h-full" style={{ width: "75%" }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span>Supabase pgvector (Cosine Matching)</span>
                  <span className="text-emerald font-bold">12 ms</span>
                </div>
                <div className="w-full bg-subtle dark:bg-darkSurface h-1.5 rounded overflow-hidden">
                  <div className="bg-emerald h-full" style={{ width: "15%" }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Cosine Similarity Visual Inspector */}
          <div className="space-y-2">
            <span className="text-[10px] text-inkMuted dark:text-darkMuted uppercase block font-semibold">
              pgvector Latent Cosine Similarity
            </span>
            <div className="space-y-2 bg-paper dark:bg-darkSubtle p-3 rounded border border-editorial">
              {activeProfile.graph.brands.map((b, idx) => (
                <div key={b.id} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-bold text-ink dark:text-darkInk">{b.name}</span>
                    <span className="text-terracotta font-semibold">Dist: {(0.08 + idx * 0.04).toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-subtle dark:bg-darkSurface h-1.5 rounded overflow-hidden">
                    <div
                      className="bg-emerald h-full"
                      style={{ width: `${Math.max(30, 95 - idx * 12)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Raw Qloo Payload JSON */}
          <div className="space-y-1">
            <span className="text-[10px] text-inkMuted dark:text-darkMuted uppercase block font-semibold">
              Raw Qloo Insights Payload
            </span>
            <pre className="bg-paper dark:bg-darkSubtle p-2.5 rounded border border-editorial text-[10px] overflow-x-auto text-ink dark:text-darkInk max-h-40">
              {JSON.stringify(mockPayload, null, 2)}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-editorial text-[10px] text-inkMuted dark:text-darkMuted flex items-center justify-between">
          <span>Backend: {backendOnline ? "127.0.0.1:8000 (Live)" : "Local Proxy"}</span>
          <button
            onClick={() => setTelemetryOpen(false)}
            className="px-3 py-1 bg-subtle dark:bg-darkSubtle rounded border border-editorial hover:border-terracotta"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
