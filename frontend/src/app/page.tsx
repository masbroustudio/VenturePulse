"use client";

import React, { useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { FlowBanner } from "@/components/layout/FlowBanner";
import { PresetDock } from "@/components/studio/PresetDock";
import { IntakeForm } from "@/components/studio/IntakeForm";
import { EgoGraphSvg } from "@/components/studio/EgoGraphSvg";
import { DagPipeline } from "@/components/council/DagPipeline";
import { DebateFeed } from "@/components/council/DebateFeed";
import { FounderBar } from "@/components/council/FounderBar";
import { KanbanBoard } from "@/components/dealdesk/KanbanBoard";
import { ChatWorkspace } from "@/components/chat/ChatWorkspace";
import { useDebateStream } from "@/hooks/useDebateStream";
import { Sparkles, ArrowRight, ShieldCheck, Zap } from "lucide-react";

export default function HomePage() {
  const { activeView, mode, setActiveView, setBackendOnline } = useAppStore();

  const {
    turns,
    activeDagNode,
    cycle,
    synergyScore,
    isConsensus,
    startDebate,
    fastForward,
    injectConstraint,
  } = useDebateStream();

  // Check backend health on mount
  useEffect(() => {
    fetch("/api/health")
      .then((res) => {
        if (res.ok) setBackendOnline(true);
      })
      .catch(() => {
        setBackendOnline(false);
      });
  }, [setBackendOnline]);

  // Auto-start debate if entering debate view with 0 turns
  useEffect(() => {
    if (activeView === "debate" && turns.length === 0) {
      startDebate();
    }
  }, [activeView, turns.length, startDebate]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 3-Step Guided Workflow Banner */}
      <FlowBanner />

      {/* ======================================================== */}
      {/* VIEW 1: STUDIO INTAKE & TASTE GRAPH                      */}
      {/* ======================================================== */}
      {activeView === "wizard" && (
        <section className="space-y-6">
          {/* Hero Editorial Header */}
          <div className="border-b border-editorial pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-terracotta tracking-widest font-bold">
                {mode === "creator"
                  ? "SYSTEM 1.0 // TASTE-DRIVEN VENTURE CREATION"
                  : "SYSTEM 2.0 // SUBCULTURAL DISCOVERY FOR HOUSES"}
              </span>
              <h1 className="font-serif italic text-4xl sm:text-5xl text-ink dark:text-darkInk tracking-tight">
                {mode === "creator"
                  ? "Venture Pulse Studio"
                  : "Brand Intelligence Terminal"}
              </h1>
              <p className="text-xs text-inkMuted dark:text-darkMuted font-sans max-w-2xl leading-relaxed pt-1">
                {mode === "creator"
                  ? "Traverse Qloo's 250M+ entity Taste Graph across music, cinema, design, and dining. Venture Pulse calculates non-obvious cross-domain taste bridges, runs an adversarial LangGraph council, and crafts physical co-branded product drops with verified unit economics."
                  : "Discover hidden cultural adjacencies for brand houses and heritage labels. Identify authentic indie creator partners, calculate cross-domain brand affinities, and structure risk-mitigated licensing capsules."}
              </p>
            </div>

            <div className="flex items-center space-x-3 text-xs font-mono">
              <div className="bg-surface dark:bg-darkSurface border border-editorial px-3 py-2 rounded">
                <span className="text-inkMuted dark:text-darkMuted block text-[10px]">
                  COVERAGE
                </span>
                <span className="text-terracotta font-bold">250M+ Entities</span>
              </div>
              <div className="bg-surface dark:bg-darkSurface border border-editorial px-3 py-2 rounded">
                <span className="text-inkMuted dark:text-darkMuted block text-[10px]">
                  EMPIRICAL ACCURACY
                </span>
                <span className="text-emerald font-bold">98.4%</span>
              </div>
            </div>
          </div>

          {/* Archetype Preset Dock */}
          <PresetDock />

          {/* Swiss Brutalist Bento Grid Layout */}
          <div className="border border-editorial rounded-lg overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-editorial">
            <IntakeForm />
            <EgoGraphSvg />
          </div>
        </section>
      )}

      {/* ======================================================== */}
      {/* VIEW 2: LANGGRAPH COUNCIL & LIVE TRACE                   */}
      {/* ======================================================== */}
      {activeView === "debate" && (
        <section className="space-y-6">
          <DagPipeline
            activeNode={activeDagNode}
            cycle={cycle}
            synergyScore={synergyScore}
            onFastForward={fastForward}
          />

          <DebateFeed
            turns={turns}
            isConsensus={isConsensus}
            onEnterDealDesk={() => setActiveView("kanban")}
          />

          <FounderBar onInjectConstraint={injectConstraint} />
        </section>
      )}

      {/* ======================================================== */}
      {/* VIEW 3: ACTIONABLE BRAND CRM PIPELINE                    */}
      {/* ======================================================== */}
      {activeView === "kanban" && (
        <section className="space-y-6">
          <KanbanBoard />
        </section>
      )}

      {/* ======================================================== */}
      {/* VIEW 4: CONVERSATIONAL CULTURAL COPILOT                  */}
      {/* ======================================================== */}
      {activeView === "chat" && (
        <section className="space-y-6">
          <ChatWorkspace />
        </section>
      )}
    </div>
  );
}
