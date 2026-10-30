"use client";

import React, { useState } from "react";
import { DealCardData, PipelineStage } from "@/types/deal";
import { useAppStore } from "@/lib/store";
import { RadialDial } from "@/components/ui/RadialDial";
import { ArrowRight, ArrowLeft, CheckCircle2, Trash2, Copy, Check } from "lucide-react";

interface DealCardProps {
  deal: DealCardData;
  onMoveStage?: (cardId: string, nextStage: PipelineStage) => void;
  onDelete?: (cardId: string) => void;
  onDragStart?: (e: React.DragEvent, cardId: string) => void;
}

const STAGES: PipelineStage[] = ["Discovered", "Vetted", "Pitch Ready", "Dispatched"];

export const DealCard: React.FC<DealCardProps> = ({
  deal,
  onMoveStage,
  onDelete,
  onDragStart,
}) => {
  const { setSelectedDeal, mode, showToast } = useAppStore();
  const [copiedPitch, setCopiedPitch] = useState(false);

  const currentStageIdx = STAGES.indexOf(deal.stage);
  const prevStage = currentStageIdx > 0 ? STAGES[currentStageIdx - 1] : null;
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

  const handleRegress = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (prevStage && onMoveStage) {
      onMoveStage(deal.card_id, prevStage);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(deal.card_id);
    }
  };

  const handleCopyPitch = (e: React.MouseEvent) => {
    e.stopPropagation();
    const pitch =
      deal.spec?.outreach_pitch ||
      `According to Qloo's cultural taste graph (250M+ entities), our audience exhibits an extraordinary ${deal.affinity_multiplier} statistical affinity for ${deal.brand_name}. We propose a limited-edition co-creation capsule: "${deal.title || `${deal.brand_name} Limited Drop`}".`;

    navigator.clipboard.writeText(pitch);
    setCopiedPitch(true);
    showToast(`✓ Copied outreach pitch for ${deal.brand_name}!`);
    setTimeout(() => setCopiedPitch(false), 2000);
  };

  return (
    <div
      id={`card-${deal.card_id}`}
      draggable
      onDragStart={(e) => onDragStart && onDragStart(e, deal.card_id)}
      onClick={handleCardClick}
      className={`kanban-card bg-surface dark:bg-darkSurface ${getBorderColor()} p-4 rounded shadow-sm space-y-3 cursor-grab active:cursor-grabbing transition group select-none relative`}
    >
      {/* Top Header: Category, Badges & Delete Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-subtle dark:bg-darkSubtle border border-editorial text-inkMuted dark:text-darkMuted font-semibold">
            {deal.category}
          </span>
          {(deal.session_id || deal.card_id?.startsWith("council_")) && (
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-terracotta/10 text-terracotta border border-terracotta/30 font-bold tracking-tight">
              ★ Council Approved
            </span>
          )}
        </div>
        <div className="flex items-center space-x-1.5">
          <div className="flex items-center space-x-1" title={`${overlapPct}% demographic overlap`}>
            <span className="text-[10px] font-mono font-bold text-terracotta">
              ⚡ {deal.affinity_multiplier}
            </span>
            <RadialDial
              percentage={overlapPct}
              size={24}
              strokeWidth={2.5}
              color={mode === "creator" ? "#ea580c" : "#4338ca"}
            />
          </div>
          {onDelete && (
            <button
              onClick={handleDelete}
              className="p-1 rounded text-inkMuted dark:text-darkMuted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition opacity-0 group-hover:opacity-100"
              title="Delete Deal from CRM"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Brand & Collab Title */}
      <div>
        <div className="font-bold text-sm text-ink dark:text-darkInk group-hover:text-terracotta transition">
          {deal.brand_name}
        </div>
        <div
          className="font-serif italic text-base text-ink dark:text-darkInk mt-1 leading-snug truncate"
          title={deal.title || deal.spec?.title}
        >
          &ldquo;{deal.title || deal.spec?.title || `${deal.brand_name} Capsule Collab`}&rdquo;
        </div>
      </div>

      {/* Deal Size & Actions Toolbar */}
      <div className="flex items-center justify-between pt-2 border-t border-editorial text-[11px] font-mono text-inkMuted dark:text-darkMuted">
        <span className="text-ink dark:text-darkInk font-medium">
          ${deal.gmv ? deal.gmv.toLocaleString() : "48,500"} GMV
        </span>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyPitch}
            className="hover:text-terracotta transition flex items-center space-x-0.5"
            title="Copy Outreach Pitch to Clipboard"
          >
            {copiedPitch ? (
              <Check className="w-3 h-3 text-emerald" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
            <span className="text-[10px]">{copiedPitch ? "Copied" : "Pitch"}</span>
          </button>
          <span className="text-terracotta font-semibold group-hover:underline flex items-center space-x-0.5">
            <span>Spec</span>
            <ArrowRight className="w-3 h-3 inline" />
          </span>
        </div>
      </div>

      {/* Bidirectional Stage Transitions */}
      <div
        className="pt-1 flex items-center justify-between space-x-1"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          {prevStage && onMoveStage ? (
            <button
              onClick={handleRegress}
              className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-subtle dark:bg-darkSubtle hover:bg-ink hover:text-white dark:hover:bg-surface dark:hover:text-ink transition text-inkMuted dark:text-darkMuted border border-editorial flex items-center space-x-0.5"
              title={`Move back to ${prevStage}`}
            >
              <ArrowLeft className="w-2.5 h-2.5" />
              <span>{prevStage}</span>
            </button>
          ) : null}
        </div>

        <div>
          {nextStage && onMoveStage ? (
            <button
              onClick={handleAdvance}
              className="text-[10px] font-mono px-2 py-0.5 rounded bg-subtle dark:bg-darkSubtle hover:bg-terracotta hover:text-white transition text-inkMuted dark:text-darkMuted border border-editorial flex items-center space-x-1 font-medium"
              title={`Advance to ${nextStage}`}
            >
              <span>{nextStage}</span>
              <ArrowRight className="w-2.5 h-2.5" />
            </button>
          ) : (
            <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 font-bold flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Synced</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
