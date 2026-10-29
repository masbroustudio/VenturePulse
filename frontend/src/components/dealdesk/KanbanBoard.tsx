"use client";

import React, { useState } from "react";
import { useDeals } from "@/hooks/useDeals";
import { DealCard } from "@/components/dealdesk/DealCard";
import { PipelineStage, DealCardData } from "@/types/deal";
import { useAppStore } from "@/lib/store";

const COLUMNS: { id: PipelineStage; label: string; badgeColor: string }[] = [
  { id: "Discovered", label: "Discovered", badgeColor: "text-inkMuted dark:text-darkMuted" },
  { id: "Vetted", label: "Vetted", badgeColor: "text-cyan" },
  { id: "Pitch Ready", label: "Pitch Ready", badgeColor: "text-terracotta" },
  { id: "Dispatched", label: "Dispatched", badgeColor: "text-purple-600 dark:text-purple-400" },
];

export const KanbanBoard: React.FC = () => {
  const { deals, metrics, updateStage } = useDeals();
  const { showToast } = useAppStore();

  const [filterDomain, setFilterDomain] = useState<string>("all");
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);

  const filteredDeals = deals.filter((d) => {
    if (filterDomain === "all") return true;
    return d.category.toLowerCase() === filterDomain.toLowerCase();
  });

  const handleDragStart = (e: React.DragEvent, cardId: string) => {
    setDraggedCardId(cardId);
    e.dataTransfer.setData("text/plain", cardId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStage: PipelineStage) => {
    e.preventDefault();
    const cardId = draggedCardId || e.dataTransfer.getData("text/plain");
    if (!cardId) return;

    updateStage({ card_id: cardId, new_stage: targetStage });
    setDraggedCardId(null);
  };

  const handleMoveStage = (cardId: string, nextStage: PipelineStage) => {
    updateStage({ card_id: cardId, new_stage: nextStage });
  };

  const domains = ["all", "apparel", "tech", "beverage", "living"];

  return (
    <div className="space-y-6">
      {/* CRM Header & Live Financial Metrics */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-editorial pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-terracotta font-semibold">
            <span>FIG 3.1 // PIPELINE INTELLIGENCE</span>
          </div>
          <h2 className="font-serif italic text-3xl sm:text-4xl text-ink dark:text-darkInk mt-0.5">
            Brand Partnership &amp; Drop Deal Desk
          </h2>
        </div>

        {/* Metric Summary Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="bg-surface dark:bg-darkSurface border border-editorial p-2.5 rounded">
            <span className="text-inkMuted dark:text-darkMuted block text-[10px]">
              PIPELINE VALUE
            </span>
            <span className="font-serif italic text-lg text-emerald font-bold">
              ${metrics.total_pipeline_value.toLocaleString()}
            </span>
          </div>
          <div className="bg-surface dark:bg-darkSurface border border-editorial p-2.5 rounded">
            <span className="text-inkMuted dark:text-darkMuted block text-[10px]">
              AVG AFFINITY
            </span>
            <span className="font-serif italic text-lg text-terracotta font-bold">
              {metrics.average_affinity.toFixed(1)}x
            </span>
          </div>
          <div className="bg-surface dark:bg-darkSurface border border-editorial p-2.5 rounded">
            <span className="text-inkMuted dark:text-darkMuted block text-[10px]">
              SAFETY RATING
            </span>
            <span className="font-serif italic text-lg text-ink dark:text-darkInk font-bold">
              98/100
            </span>
          </div>
          <div className="bg-surface dark:bg-darkSurface border border-editorial p-2.5 rounded">
            <span className="text-inkMuted dark:text-darkMuted block text-[10px]">
              DISPATCHED COUNT
            </span>
            <span className="font-serif italic text-lg text-purple-600 dark:text-purple-400 font-bold">
              {deals.filter((d) => d.stage === "Dispatched").length} Synced
            </span>
          </div>
        </div>
      </div>

      {/* Filter & Sort Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center space-x-1.5">
          <span className="text-inkMuted dark:text-darkMuted mr-1">Domain:</span>
          {domains.map((dom) => (
            <button
              key={dom}
              onClick={() => setFilterDomain(dom)}
              className={`px-2.5 py-1 rounded capitalize font-medium transition ${
                filterDomain === dom
                  ? "bg-ink text-surface dark:bg-surface dark:text-ink"
                  : "border border-editorial bg-surface dark:bg-darkSurface hover:bg-subtle dark:hover:bg-darkSubtle text-ink dark:text-darkInk"
              }`}
            >
              {dom}
            </button>
          ))}
        </div>

        <div className="text-[11px] text-inkMuted dark:text-darkMuted">
          Drag cards across columns or use stage buttons
        </div>
      </div>

      {/* 4-Column Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {COLUMNS.map((col) => {
          const colDeals = filteredDeals.filter((d) => d.stage === col.id);

          return (
            <div
              key={col.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
              className="bg-subtle/50 dark:bg-darkSubtle/50 border border-editorial rounded-lg p-3 space-y-3 min-h-[460px] flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 border-b border-editorial text-xs font-mono">
                  <span className="font-bold text-ink dark:text-darkInk uppercase tracking-wider">
                    {col.label}
                  </span>
                  <span className={`px-2 py-0.5 rounded bg-surface dark:bg-darkSurface border border-editorial font-bold ${col.badgeColor}`}>
                    {colDeals.length}
                  </span>
                </div>

                {/* Column Cards */}
                <div className="space-y-3">
                  {colDeals.map((deal) => (
                    <DealCard
                      key={deal.card_id}
                      deal={deal}
                      onMoveStage={handleMoveStage}
                      onDragStart={handleDragStart}
                    />
                  ))}
                  {colDeals.length === 0 && (
                    <div className="h-28 border border-dashed border-editorial rounded flex items-center justify-center text-inkMuted dark:text-darkMuted text-xs font-mono">
                      Drop here
                    </div>
                  )}
                </div>
              </div>

              {/* Column Footer */}
              <div className="pt-2 border-t border-editorial text-[10px] font-mono text-inkMuted dark:text-darkMuted text-right">
                {col.id === "Dispatched" ? "Supabase Sync Live" : "Pipeline Stage"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
