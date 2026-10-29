"use client";

import React from "react";
import { DealCardData, PipelineStage } from "@/types/deal";
import { useAppStore } from "@/lib/store";
import { RadialDial } from "@/components/ui/RadialDial";
import { ArrowRight, CheckCircle2 } from "lucide-react";

interface DealCardProps {
  deal: DealCardData;
  onMoveStage?: (cardId: string, nextStage: PipelineStage) => void;
  onDragStart?: (e: React.DragEvent, cardId: string) => void;
}

const STAGES: PipelineStage[] = ["Discovered", "Vetted", "Pitch Ready", "Dispatched"];

export const DealCard: React.FC<DealCardProps> = ({
  deal,
  onMoveStage,
  onDragStart,
}) => {
  const { setSelectedDeal, mode } = useAppStore();

  const currentStageIdx = STAGES.indexOf(deal.stage);
  const nextStage = currentStageIdx < STAGES.length - 1 ? STAGES[currentStageIdx + 1] : null;

  const overlapPct = Math.round((deal.synergy_score || 0.92) * 100);

  const getBorderColor = () => {
    switch (deal.stage) {
      case "Pitch Ready":
        return "border-2 border-terracotta";
      case "Dispatched":
        return "border border-editorial opacity-85 hover:opacity-100";
      default:
        return "border border-editorial hover:border-gold/50";
    }
  };

  const handleCardClick = () => {
    setSelectedDeal(deal);
  };

  const handleAdvance = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (nextStage && onMoveStage) {
      onMoveStage(deal.card_id, nextStage);
    }
  };

  return (
    <div
      id={`card-${deal.card_id}`}
      draggable
      onDragStart={(e) => onDragStart && onDragStart(e, deal.card_id)}
      onClick={handleCardClick}
      className={`kanban-card bg-surface dark:bg-darkSurface ${getBorderColor()} p-4 rounded shadow-sm space-y-3 cursor-grab active:cursor-grabbing transition group select-none`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-subtle dark:bg-darkSubtle border border-editorial text-inkMuted dark:text-darkMuted font-semibold">
          {deal.category}
        </span>
        <div className="flex items-center space-x-1.5" title={`${overlapPct}% demographic overlap`}>
          <span className="text-[10px] font-mono font-bold text-terracotta">
            ⚡ {deal.affinity_multiplier}
          </span>
          <RadialDial
            percentage={overlapPct}
            size={28}
            strokeWidth={2.5}
            color={mode === "creator" ? "#ea580c" : "#4338ca"}
          />
        </div>
      </div>

      {/* Brand & Collab Title */}
      <div>
        <div className="font-bold text-sm text-ink dark:text-darkInk group-hover:text-terracotta transition">
          {deal.brand_name}
        </div>
        <div className="font-serif italic text-base text-ink dark:text-darkInk mt-1 leading-snug truncate" title={deal.title || deal.spec?.title}>
          &ldquo;{deal.title || deal.spec?.title || `${deal.brand_name} Capsule Collab`}&rdquo;
        </div>
      </div>

      {/* Deal Size & Inspect Spec */}
      <div className="flex items-center justify-between pt-2 border-t border-editorial text-[11px] font-mono text-inkMuted dark:text-darkMuted">
        <span className="text-ink dark:text-darkInk font-medium">
          ${deal.gmv ? deal.gmv.toLocaleString() : "48,500"} GMV
        </span>
        <span className="text-terracotta font-semibold group-hover:underline flex items-center space-x-0.5">
          <span>Inspect Spec</span>
          <ArrowRight className="w-3 h-3 inline" />
        </span>
      </div>

      {/* Action Stage Transition */}
      <div className="pt-1 flex items-center justify-end space-x-1" onClick={(e) => e.stopPropagation()}>
        {nextStage ? (
          <button
            onClick={handleAdvance}
            className="text-[10px] font-mono px-2 py-0.5 rounded bg-subtle dark:bg-darkSubtle hover:bg-terracotta hover:text-white transition text-inkMuted dark:text-darkMuted border border-editorial flex items-center space-x-1"
          >
            <span>Move to {nextStage}</span>
            <ArrowRight className="w-2.5 h-2.5" />
          </button>
        ) : (
          <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 font-bold flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Synced to Supabase</span>
          </span>
        )}
      </div>
    </div>
  );
};
