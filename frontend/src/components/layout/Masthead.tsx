"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { Moon, Sun, Activity, Zap, Search, ShieldCheck, MessageSquare, LayoutGrid, Network, Server, Settings } from "lucide-react";

export function Masthead() {
  const {
    mode,
    theme,
    activeView,
    backendOnline,
    toggleMode,
    toggleTheme,
    toggleChatView,
    setActiveView,
    setProofModalOpen,
    setTelemetryOpen,
    setCommandPaletteOpen,
    setSettingsModalOpen,
    setBackendOnline,
    showToast,
    activeProfile,
  } = useAppStore();

  const [checking, setChecking] = useState(false);

  // Ping FastAPI backend health
  const checkBackend = async (interactive = false) => {
    setChecking(true);
    try {
      const res = await fetch("/api/health", { signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        setBackendOnline(true);
        if (interactive) showToast("🟢 Connected to live FastAPI backend at http://127.0.0.1:8000 (Groq LLM Active)");
      } else {
        setBackendOnline(false);
        if (interactive) showToast("ℹ️ FastAPI backend returned non-200. Operating in offline simulation mode.");
      }
    } catch {
      setBackendOnline(false);
      if (interactive) showToast("ℹ️ FastAPI backend offline (http://127.0.0.1:8000). Operating in offline simulation mode.");
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkBackend(false);
  }, []);

  const isBrand = mode === "brand";

  return (
    <header className="border-b border-editorial bg-surface/90 dark:bg-darkBg/90 backdrop-blur sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Logo & Grounding Beacon */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveView("wizard")}>
          <div
            className={`w-9 h-9 rounded border border-editorial bg-subtle dark:bg-darkSubtle flex items-center justify-center font-mono font-bold text-sm shadow-sm transition-colors ${
              isBrand ? "text-brandIndigo" : "text-terracotta"
            }`}
          >
            VP
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-serif italic text-2xl tracking-tight text-ink dark:text-darkInk">Venture Pulse</span>

            {/* Qloo 250M+ Taste Graph Icon Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setTelemetryOpen(true);
                showToast("Opened Qloo 250M+ Telemetry & Vector Drawer");
              }}
              className="inline-flex items-center space-x-1.5 px-2 py-1 rounded bg-subtle dark:bg-darkSubtle border border-editorial hover:border-terracotta text-inkMuted dark:text-darkMuted hover:text-ink dark:hover:text-darkInk transition shadow-sm"
              title="Qloo Taste Graph (250M+ Entities) • Click to open Telemetry & Vector Drawer"
            >
              <Network className="w-3.5 h-3.5 text-terracotta" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse"></span>
            </button>

            {/* Live FastAPI + Groq status icon button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                checkBackend(true);
              }}
              className="inline-flex items-center space-x-1.5 px-2 py-1 rounded bg-subtle dark:bg-darkSubtle border border-editorial hover:border-terracotta text-inkMuted dark:text-darkMuted hover:text-ink dark:hover:text-darkInk transition shadow-sm"
              title={
                checking
                  ? "Checking FastAPI Backend (http://127.0.0.1:8000)..."
                  : backendOnline
                  ? "FastAPI + Groq Live (Connected) • Click to re-test"
                  : "FastAPI Backend Offline (Simulated Mode) • Click to reconnect"
              }
            >
              <Server
                className={`w-3.5 h-3.5 ${
                  backendOnline ? "text-emerald" : "text-inkMuted dark:text-darkMuted"
                }`}
              />
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  checking
                    ? "bg-gold animate-ping"
                    : backendOnline
                    ? "bg-emerald animate-pulse"
                    : "bg-zinc-400"
                }`}
              ></span>
            </button>
          </div>
        </div>

        {/* Center: State Stepper Navigation */}
        <nav className="hidden md:flex items-center space-x-1 bg-subtle dark:bg-darkSubtle border border-editorial p-1 rounded text-xs font-mono">
          <button
            onClick={() => setActiveView("wizard")}
            className={`px-3 py-1.5 rounded transition font-medium ${
              activeView === "wizard"
                ? "bg-surface dark:bg-darkSurface text-ink dark:text-darkInk border border-editorial shadow-sm"
                : "text-inkMuted dark:text-darkMuted hover:text-ink dark:hover:text-darkInk"
            }`}
          >
            1. Studio & Ego Graph
          </button>
          <button
            onClick={() => setActiveView("debate")}
            className={`px-3 py-1.5 rounded transition font-medium ${
              activeView === "debate"
                ? "bg-surface dark:bg-darkSurface text-ink dark:text-darkInk border border-editorial shadow-sm"
                : "text-inkMuted dark:text-darkMuted hover:text-ink dark:hover:text-darkInk"
            }`}
          >
            2. LangGraph Council
          </button>
          <button
            onClick={() => setActiveView("kanban")}
            className={`px-3 py-1.5 rounded transition font-medium ${
              activeView === "kanban"
                ? "bg-surface dark:bg-darkSurface text-ink dark:text-darkInk border border-editorial shadow-sm"
                : "text-inkMuted dark:text-darkMuted hover:text-ink dark:hover:text-darkInk"
            }`}
          >
            3. Deal Desk
          </button>
        </nav>

        {/* Right: Sleek Consolidated Utilities (Decluttered) */}
        <div className="flex items-center space-x-2">
          {/* ⌘K Command Palette Pill */}
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="hidden sm:inline-flex items-center space-x-2 text-xs font-mono px-3 py-1.5 rounded border border-editorial bg-subtle dark:bg-darkSubtle hover:border-terracotta text-inkMuted dark:text-darkMuted transition"
            title="Press ⌘K or Ctrl+K anywhere"
          >
            <Search className="w-3 h-3 text-inkMuted" />
            <span>⌘K Actions</span>
            <kbd className="text-[10px] bg-surface dark:bg-darkSurface px-1.5 py-0.5 rounded border border-editorial">
              ⌘K
            </kbd>
          </button>

          {/* Prominent Mode Switcher Pill */}
          <button
            onClick={toggleMode}
            className={`text-xs font-mono px-3 py-1.5 rounded border transition flex items-center space-x-1.5 font-bold ${
              isBrand
                ? "border-brandIndigo/50 bg-brandIndigo/10 text-brandIndigo"
                : "border-terracotta/50 bg-terracotta/10 text-terracotta"
            }`}
            title="Switch between Creator Mode and Brand Counter-Discovery Mode"
          >
            <span>{isBrand ? "🏢" : "👤"}</span>
            <span>{isBrand ? "Brand Mode" : "Creator Mode"}</span>
            <span className="text-[10px] text-inkMuted dark:text-darkMuted font-normal">⮂</span>
          </button>

          {/* Switch between Studio Workspace and Chat Copilot (Immediately after Creator/Brand Mode) */}
          <button
            onClick={toggleChatView}
            className={`text-xs font-mono px-3 py-1.5 rounded border transition flex items-center space-x-1.5 font-bold shadow-sm ${
              activeView === "chat"
                ? "border-terracotta/40 bg-terracotta/10 text-terracotta hover:bg-terracotta/20"
                : "border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-300 hover:bg-purple-500/20"
            }`}
            title={activeView === "chat" ? "Switch to Studio Workspace" : "Switch to Chat Copilot"}
          >
            {activeView === "chat" ? (
              <>
                <LayoutGrid className="w-3.5 h-3.5 text-terracotta" />
                <span className="hidden sm:inline">Studio Workspace</span>
              </>
            ) : (
              <>
                <MessageSquare className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span className="hidden sm:inline">Chat Copilot</span>
              </>
            )}
          </button>

          {/* Telemetry Drawer */}
          <button
            onClick={() => setTelemetryOpen(true)}
            className="text-xs font-mono px-2.5 py-1.5 rounded border border-editorial bg-surface dark:bg-darkSurface hover:bg-subtle text-ink dark:text-darkInk transition hidden sm:inline-flex items-center space-x-1"
            title="Span Waterfall & pgvector Telemetry"
          >
            <Zap className="w-3.5 h-3.5 text-gold" />
            <span>Traces</span>
          </button>

          {/* Proof Benchmark Lab (Icon-Only, immediately before Theme Switcher) */}
          <button
            onClick={() => setProofModalOpen(true)}
            className="w-8 h-8 rounded border border-editorial bg-surface dark:bg-darkSurface flex items-center justify-center text-ink dark:text-darkInk hover:border-emerald transition text-xs hidden sm:flex"
            title="Proof Benchmark Lab (LMSYS Arena Diff & DeepEval Scores)"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald" />
          </button>

          {/* Light / Dark Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded border border-editorial bg-surface dark:bg-darkSurface flex items-center justify-center text-ink dark:text-darkInk hover:bg-subtle transition text-xs"
            title="Toggle Light / Dark Mode"
          >
            {theme === "light" ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
          </button>

          {/* LLM Engine & Provider Settings (Immediately after Theme Switcher) */}
          <button
            onClick={() => setSettingsModalOpen(true)}
            className="w-8 h-8 rounded border border-editorial bg-surface dark:bg-darkSurface flex items-center justify-center text-ink dark:text-darkInk hover:border-terracotta hover:text-terracotta transition text-xs shadow-sm"
            title="LLM Engine & Provider Settings (Groq, Gemini, OpenAI, Custom)"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
