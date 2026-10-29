"use client";

import React, { useEffect, useRef } from "react";
import { TurnMessage } from "@/types/agent";
import { useAppStore } from "@/lib/store";
import { Check, ArrowRight, AlertTriangle, ShieldCheck } from "lucide-react";

interface DebateFeedProps {
  turns: TurnMessage[];
  isConsensus: boolean;
  onEnterDealDesk: () => void;
}

export const DebateFeed: React.FC<DebateFeedProps> = ({
  turns,
  isConsensus,
  onEnterDealDesk,
}) => {
  const terminalEndRef = useRef<HTMLDivElement | null>(null);
  const { mode } = useAppStore();

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [turns]);

  const getBorderColor = (role: string) => {
    switch (role) {
      case "cultural_analyst":
        return "border-cyan";
      case "brand_strategist":
        return "border-gold";
      case "creative_director":
      default:
        return "border-terracotta";
    }
  };

  const getTextColor = (role: string) => {
    switch (role) {
      case "cultural_analyst":
        return "text-cyan";
      case "brand_strategist":
        return "text-gold";
      case "creative_director":
      default:
        return "text-terracotta";
    }
  };

  return (
    <div className="space-y-6">
      {/* Live Terminal Dialogue Stream Container */}
      <div className="bg-surface dark:bg-darkSurface border border-editorial rounded p-6 space-y-5 max-h-[520px] overflow-y-auto font-mono text-xs shadow-editorial">
        {turns.length === 0 && (
          <div className="space-y-1 text-xs font-mono text-inkMuted dark:text-darkMuted pl-4 border-l-2 border-emerald animate-pulse">
            <span>⚡ Initializing Multi-Agent Deliberation: Connecting to LangGraph State Machine...</span>
          </div>
        )}

        {turns.map((turn, index) => {
          const isRejection = turn.consensus_status === "CONFLICT_REJECTED";
          const isRefined = turn.consensus_status === "REFINED" || turn.cycle === 2;

          return (
            <div
              key={`turn-${index}`}
              className={`space-y-2 border-l-2 ${getBorderColor(
                turn.role
              )} pl-4 transition-all duration-300`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className={`font-bold ${getTextColor(turn.role)}`}>
                    [Turn {index + 1} • Cycle {turn.cycle}] {turn.agent_name}
                  </span>
                  {isRejection && (
                    <span className="text-[10px] bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 px-2 py-0.5 rounded border border-red-300 font-bold flex items-center space-x-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span>
                        REJECTION: Synergy {turn.synergy_score ? `${Math.round(turn.synergy_score * 100)}%` : "71%"} &lt; 85% Threshold
                      </span>
                    </span>
                  )}
                  {turn.consensus_status === "APPROVED" && (
                    <span className="text-[10px] bg-emerald/15 text-emerald px-2 py-0.5 rounded border border-emerald/40 font-bold flex items-center space-x-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>APPROVED: Consensus Converged</span>
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-inkMuted dark:text-darkMuted">
                  {isRefined && turn.role === "cultural_analyst"
                    ? "Cycle 2 Refinement (94% Synergy)"
                    : "Qloo 250M+ Gateway"}
                </span>
              </div>

              <p className="text-ink dark:text-darkInk leading-relaxed font-sans text-xs">
                {turn.content}
              </p>

              {turn.thought_reasoning && (
                <details className="bg-subtle dark:bg-darkSubtle p-2 rounded border border-editorial text-[11px] text-inkMuted dark:text-darkMuted cursor-pointer group">
                  <summary className="font-bold text-ink dark:text-darkInk hover:text-terracotta transition select-none">
                    Reasoning &amp; Tool Trace
                  </summary>
                  <pre
                    className={`mt-2 text-[10px] ${getTextColor(
                      turn.role
                    )} overflow-x-auto whitespace-pre-wrap font-mono`}
                  >
                    {turn.thought_reasoning}
                  </pre>
                </details>
              )}
            </div>
          );
        })}
        <div ref={terminalEndRef} />
      </div>

      {/* Consensus Action Banner */}
      {isConsensus && (
        <div className="bg-surface dark:bg-darkSurface border border-terracotta/40 p-5 rounded flex flex-col sm:flex-row items-center justify-between gap-4 shadow-editorial transition-all duration-300">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-terracotta/15 text-terracotta flex items-center justify-center font-bold text-sm">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <div className="font-serif italic text-xl text-ink dark:text-darkInk">
                Consensus Achieved (94% Cultural Synergy)
              </div>
              <div className="text-xs text-inkMuted dark:text-darkMuted font-mono">
                Verified Qloo Partners Persisted to Supabase PostgreSQL • Ready for CRM Pipeline
              </div>
            </div>
          </div>

          <button
            onClick={onEnterDealDesk}
            className="w-full sm:w-auto px-6 py-2.5 rounded bg-ink text-surface dark:bg-surface dark:text-ink font-mono text-xs uppercase tracking-wider font-bold hover:bg-terracotta dark:hover:bg-terracotta hover:text-white transition shadow flex items-center justify-center space-x-2"
          >
            <span>Enter Deal Desk</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
