"use client";

import React from "react";
import { DagNodeId } from "@/hooks/useDebateStream";
import { useAppStore } from "@/lib/store";
import { Check, Zap, TrendingUp, Palette, ShieldCheck, Database } from "lucide-react";

interface DagPipelineProps {
  activeNode: DagNodeId;
  cycle: number;
  synergyScore: string;
  onFastForward: () => void;
}

export const DagPipeline: React.FC<DagPipelineProps> = ({
  activeNode,
  cycle,
  synergyScore,
  onFastForward,
}) => {
  const { mode } = useAppStore();
  const isBrand = mode === "brand";

  const isCompleted = (node: DagNodeId) => {
    const order: DagNodeId[] = ["intake", "qloo", "analyst", "strategist", "director", "deepeval", "supabase"];
    const activeIdx = order.indexOf(activeNode);
    const targetIdx = order.indexOf(node);
    return targetIdx < activeIdx || activeNode === "supabase";
  };

  const isActive = (node: DagNodeId) => activeNode === node;

  const getNodeClass = (node: DagNodeId, baseColor: string) => {
    if (isActive(node)) {
      return `${baseColor} border font-bold animate-pulse`;
    }
    if (isCompleted(node)) {
      return "bg-emerald/10 text-emerald border border-emerald/30 font-medium";
    }
    return "bg-subtle dark:bg-darkSubtle text-inkMuted dark:text-darkMuted border border-editorial font-medium";
  };

  return (
    <div className="bg-surface dark:bg-darkSurface border border-editorial p-6 rounded shadow-editorial space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-editorial pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald animate-pulse"></span>
            <span className="text-xs font-mono uppercase tracking-widest text-emerald font-bold">
              FIG 2.1 // CYCLIC STATE MACHINE ACTIVE
            </span>
          </div>
          <h2 className="font-serif italic text-3xl text-ink dark:text-darkInk mt-1">
            Multi-Agent Consensus Deliberation &amp; Rejection Loop
          </h2>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <div className="bg-subtle dark:bg-darkSubtle px-3 py-1.5 rounded border border-editorial">
            Cycle: <span className="font-bold text-ink dark:text-darkInk">{cycle} / 2</span> • Consensus:{" "}
            <span className="text-terracotta font-bold">{synergyScore}</span>
          </div>
          <button
            onClick={onFastForward}
            className="px-3 py-1.5 rounded bg-paper dark:bg-darkSubtle border border-editorial hover:border-terracotta transition font-semibold"
          >
            ⏩ Fast-Forward to Consensus
          </button>
        </div>
      </div>

      {/* Animated Directed Acyclic Graph (DAG) */}
      <div className="overflow-x-auto pb-2">
        <div className="flex items-center space-x-2 text-xs font-mono min-w-[760px]">
          {/* Intake */}
          <div className="bg-emerald/10 text-emerald border border-emerald/30 px-3 py-2 rounded flex items-center space-x-1.5 font-medium">
            <Check className="w-3.5 h-3.5" />
            <span>IntakeNode</span>
          </div>
          <span className="text-inkMuted dark:text-darkMuted">→</span>

          {/* Qloo Taste Node */}
          <div className="bg-emerald/10 text-emerald border border-emerald/30 px-3 py-2 rounded flex items-center space-x-1.5 font-medium">
            <Check className="w-3.5 h-3.5" />
            <span>QlooTasteNode</span>
          </div>
          <span className="text-inkMuted dark:text-darkMuted">→</span>

          {/* Cultural Analyst / Subculture Scout */}
          <div
            className={`px-3 py-2 rounded flex items-center space-x-1.5 ${getNodeClass(
              "analyst",
              "bg-cyan/15 text-cyan border-cyan/40"
            )}`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{isBrand ? "SubcultureScout" : "CulturalAnalyst"}</span>
          </div>
          <span className="text-inkMuted dark:text-darkMuted">↔</span>

          {/* Brand / Media Strategist */}
          <div
            className={`px-3 py-2 rounded flex items-center space-x-1.5 ${getNodeClass(
              "strategist",
              "bg-gold/15 text-gold border-gold/40"
            )}`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{isBrand ? "MediaStrategist" : "BrandStrategist"}</span>
          </div>
          <span className="text-inkMuted dark:text-darkMuted">↔</span>

          {/* Creative / Campaign Director */}
          <div
            className={`px-3 py-2 rounded flex items-center space-x-1.5 ${getNodeClass(
              "director",
              "bg-terracotta/15 text-terracotta border-terracotta/40"
            )}`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>{isBrand ? "CampaignDirector" : "CreativeDirector"}</span>
          </div>
          <span className="text-inkMuted dark:text-darkMuted">→</span>

          {/* DeepEval Benchmark */}
          <div
            className={`px-3 py-2 rounded flex items-center space-x-1.5 ${getNodeClass(
              "deepeval",
              "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/40"
            )}`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>DeepEvalNode</span>
          </div>
          <span className="text-inkMuted dark:text-darkMuted">→</span>

          {/* Supabase Persistence */}
          <div
            className={`px-3 py-2 rounded flex items-center space-x-1.5 ${getNodeClass(
              "supabase",
              "bg-emerald/15 text-emerald border-emerald/40"
            )}`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>SupabasePersistence</span>
          </div>
        </div>
      </div>
    </div>
  );
};
