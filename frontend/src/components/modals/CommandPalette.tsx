"use client";

import React, { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import {
  Compass,
  MessageSquare,
  Kanban,
  Repeat,
  Moon,
  Sun,
  ShieldCheck,
  Activity,
  Package,
} from "lucide-react";

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setCommandPaletteOpen,
    setActiveView,
    toggleMode,
    toggleTheme,
    theme,
    mode,
    applyPreset,
    activePresetIdx,
    setProofModalOpen,
    setTelemetryOpen,
    setSkillsModalOpen,
    showToast,
  } = useAppStore();

  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === "Escape" && isCommandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const actions = [
    {
      id: "view-wizard",
      title: "Jump to View 1: Studio & Ego Graph",
      category: "Navigation",
      icon: <Compass className="w-4 h-4 text-terracotta" />,
      run: () => {
        setActiveView("wizard");
        setCommandPaletteOpen(false);
        showToast("Switched to View 1: Studio");
      },
    },
    {
      id: "view-debate",
      title: "Jump to View 2: LangGraph Council",
      category: "Navigation",
      icon: <MessageSquare className="w-4 h-4 text-cyan" />,
      run: () => {
        setActiveView("debate");
        setCommandPaletteOpen(false);
        showToast("Switched to View 2: Council");
      },
    },
    {
      id: "view-kanban",
      title: "Jump to View 3: Deal Desk (Kanban)",
      category: "Navigation",
      icon: <Kanban className="w-4 h-4 text-emerald" />,
      run: () => {
        setActiveView("kanban");
        setCommandPaletteOpen(false);
        showToast("Switched to View 3: Deal Desk");
      },
    },
    {
      id: "toggle-mode",
      title: `Toggle Operating Mode (Current: ${mode === "creator" ? "Creator" : "Brand"})`,
      category: "System",
      icon: <Repeat className="w-4 h-4 text-indigo-500" />,
      run: () => {
        toggleMode();
        setCommandPaletteOpen(false);
      },
    },
    {
      id: "next-preset",
      title: "Cycle Next Archetype Preset",
      category: "Presets",
      icon: <Compass className="w-4 h-4 text-gold" />,
      run: () => {
        const nextIdx = (activePresetIdx + 1) % 4;
        applyPreset(nextIdx);
        setCommandPaletteOpen(false);
      },
    },
    {
      id: "toggle-theme",
      title: `Toggle Theme (Current: ${theme})`,
      category: "Appearance",
      icon: theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />,
      run: () => {
        toggleTheme();
        setCommandPaletteOpen(false);
      },
    },
    {
      id: "open-proof",
      title: "Open LMSYS Diff Arena & DeepEval Scores",
      category: "Benchmarks",
      icon: <ShieldCheck className="w-4 h-4 text-emerald" />,
      run: () => {
        setCommandPaletteOpen(false);
        setProofModalOpen(true);
      },
    },
    {
      id: "open-telemetry",
      title: "Open Telemetry & Execution Spans Drawer",
      category: "Telemetry",
      icon: <Activity className="w-4 h-4 text-cyan" />,
      run: () => {
        setCommandPaletteOpen(false);
        setTelemetryOpen(true);
      },
    },
    {
      id: "open-skills",
      title: "View skills.sh Agent Tool Registry (8 Tools)",
      category: "Agent Protocols",
      icon: <Package className="w-4 h-4 text-purple-500" />,
      run: () => {
        setCommandPaletteOpen(false);
        setSkillsModalOpen(true);
      },
    },
  ];

  const filtered = actions.filter((a) =>
    a.title.toLowerCase().includes(query.toLowerCase()) ||
    a.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-start justify-center pt-24 p-4 animate-fade-in">
      <div className="bg-surface dark:bg-darkSurface border border-editorial max-w-lg w-full rounded-xl shadow-2xl overflow-hidden font-mono text-xs">
        {/* Search Input Bar */}
        <div className="p-3 border-b border-editorial flex items-center space-x-2">
          <span className="text-terracotta font-bold">⌘</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or jump to view..."
            autoFocus
            className="w-full bg-transparent text-ink dark:text-darkInk focus:outline-none placeholder:text-inkMuted dark:placeholder:text-darkMuted"
          />
          <kbd className="text-[10px] text-inkMuted dark:text-darkMuted bg-subtle dark:bg-darkSubtle px-1.5 py-0.5 rounded border border-editorial">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-72 overflow-y-auto p-2 space-y-1">
          {filtered.map((item) => (
            <button
              key={item.id}
              onClick={item.run}
              className="w-full p-2.5 rounded hover:bg-subtle dark:hover:bg-darkSubtle text-left flex items-center justify-between group transition"
            >
              <div className="flex items-center space-x-2.5">
                {item.icon}
                <span className="text-ink dark:text-darkInk group-hover:text-terracotta transition font-medium">
                  {item.title}
                </span>
              </div>
              <span className="text-[10px] text-inkMuted dark:text-darkMuted bg-paper dark:bg-darkSurface px-2 py-0.5 rounded border border-editorial">
                {item.category}
              </span>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="p-4 text-center text-inkMuted dark:text-darkMuted">
              No matching commands
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
