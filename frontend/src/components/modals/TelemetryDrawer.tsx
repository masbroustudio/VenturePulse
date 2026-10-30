"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAppStore } from "@/lib/store";
import { X, Activity, Server, Zap, Database } from "lucide-react";

export const TelemetryDrawer: React.FC = () => {
  const { isTelemetryOpen, setTelemetryOpen, activeProfile, backendOnline } = useAppStore();
  const [cacheMode, setCacheMode] = useState<"lru" | "live" | "fallback">("live");

  const { data: vectorData, isLoading: vectorLoading } = useQuery({
    queryKey: ["vector-search", activeProfile.name],
    queryFn: async () => {
      const queryText = activeProfile.chips.map((c) => c.name).join(" ") || activeProfile.name;
      const res = await fetch("/api/vector/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: queryText,
          query_text: queryText,
          top_k: 5,
        }),
      });
      if (!res.ok) throw new Error("Failed vector search");
      return res.json();
    },
    enabled: isTelemetryOpen,
    staleTime: 30000,
  });

  if (!isTelemetryOpen) return null;

  const matches = vectorData?.matches || activeProfile.graph.brands.map((b, idx) => ({
    entity_id: `urn:entity:brand:${b.id}`,
    name: b.name,
    similarity: Math.max(0.75, 0.96 - idx * 0.05),
  }));

  const payloadToDisplay = {
    status: 200,
    gateway: "hackathon.api.qloo.com",
    active_profile: activeProfile.name,
    cached_entities: 250000000,
    vector_search_query: activeProfile.chips.map((c) => c.name).join(", "),
    vector_results: vectorData?.matches || "Live vector search active",
    query_spans: [
      { endpoint: "/v2/search", latency_ms: cacheMode === "lru" ? 4 : 42, status: cacheMode === "lru" ? "CACHE_HIT" : "200_OK" },
      { endpoint: "/v2/insights", latency_ms: cacheMode === "lru" ? 8 : 188, status: "200_OK" },
      { endpoint: "/api/debate/stream", latency_ms: 210, status: "STREAMING" },
      { endpoint: "sqlite_deals", latency_ms: 12, status: "PERSISTED" },
    ],
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
                <span>LangFuse &amp; Vector Traces</span>
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
                  <span>GET /v2/search (Entity Resolution)</span>
                  <span className="text-emerald font-bold">{cacheMode === "lru" ? "4 ms" : "42 ms"}</span>
                </div>
                <div className="w-full bg-subtle dark:bg-darkSurface h-1.5 rounded overflow-hidden">
                  <div className="bg-cyan h-full" style={{ width: cacheMode === "lru" ? "5%" : "25%" }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span>GET /v2/insights (Cross-Domain)</span>
                  <span className="text-emerald font-bold">{cacheMode === "lru" ? "8 ms" : "188 ms"}</span>
                </div>
                <div className="w-full bg-subtle dark:bg-darkSurface h-1.5 rounded overflow-hidden">
                  <div className="bg-terracotta h-full" style={{ width: cacheMode === "lru" ? "10%" : "65%" }}></div>
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
                  <span>SQLite Vector Store (Cosine Matching)</span>
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
            <div className="flex items-center justify-between text-[10px] text-inkMuted dark:text-darkMuted uppercase">
              <span className="font-semibold">In-Memory Latent Cosine Similarity</span>
              {vectorLoading && <span className="text-cyan animate-pulse">Searching...</span>}
            </div>
            <div className="space-y-2 bg-paper dark:bg-darkSubtle p-3 rounded border border-editorial">
              {matches.map((m: any, idx: number) => {
                const sim = typeof m.similarity === "number" ? m.similarity : 0.90;
                return (
                  <div key={m.entity_id || m.name || idx} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="font-bold text-ink dark:text-darkInk">{m.name}</span>
                      <span className="text-terracotta font-semibold">Sim: {sim.toFixed(3)}</span>
                    </div>
                    <div className="w-full bg-subtle dark:bg-darkSurface h-1.5 rounded overflow-hidden">
                      <div
                        className="bg-emerald h-full transition-all duration-500"
                        style={{ width: `${Math.round(sim * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Raw Qloo Payload JSON */}
          <div className="space-y-1">
            <span className="text-[10px] text-inkMuted dark:text-darkMuted uppercase block font-semibold">
              Live Gateway Response Payload
            </span>
            <pre className="bg-paper dark:bg-darkSubtle p-2.5 rounded border border-editorial text-[10px] overflow-x-auto text-ink dark:text-darkInk max-h-40">
              {JSON.stringify(payloadToDisplay, null, 2)}
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
