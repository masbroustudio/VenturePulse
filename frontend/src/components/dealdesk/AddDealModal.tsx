"use client";

import React, { useState, useEffect } from "react";
import { PipelineStage, DealCardData } from "@/types/deal";
import { X, Plus, Sparkles } from "lucide-react";

interface AddDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (deal: Partial<DealCardData>) => void;
  initialStage?: PipelineStage;
}

const CATEGORIES = ["apparel", "tech", "beverage", "living", "accessories"];
const STAGES: PipelineStage[] = ["Discovered", "Vetted", "Pitch Ready", "Dispatched"];

export const AddDealModal: React.FC<AddDealModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialStage = "Discovered",
}) => {
  const [brandName, setBrandName] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("apparel");
  const [stage, setStage] = useState<PipelineStage>(initialStage);
  const [affinity, setAffinity] = useState("7.8x");
  const [msrp, setMsrp] = useState(185);
  const [units, setUnits] = useState(500);

  useEffect(() => {
    if (isOpen) {
      setStage(initialStage);
    }
  }, [isOpen, initialStage]);

  if (!isOpen) return null;

  const gmv = msrp * units;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName.trim()) return;

    onSubmit({
      card_id: `custom_${Date.now().toString(36)}`,
      brand_name: brandName.trim(),
      title: title.trim() || `${brandName.trim()} Limited Drop`,
      category,
      stage,
      affinity_multiplier: affinity.includes("x") ? affinity : `${affinity}x`,
      synergy_score: 0.94,
      msrp,
      run_units: units,
      gmv,
      spec: {
        title: title.trim() || `${brandName.trim()} Limited Drop`,
        brand_partner: brandName.trim(),
        category,
        affinity_multiplier: affinity,
        description: `Custom collaboration curated in Deal Desk for ${category} domain.`,
        materials: ["Custom Specification Material", "Hardware Fixtures"],
        colorways: ["Signature Colorway"],
        msrp_usd: msrp,
        run_units: units,
        projected_gmv: gmv,
        creator_royalty_pct: 0.18,
        projected_royalty: gmv * 0.18,
        outreach_pitch: `According to Qloo's cultural taste graph, our audience exhibits a verified ${affinity} statistical affinity for ${brandName}.`,
      },
    });

    // Reset fields
    setBrandName("");
    setTitle("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-surface dark:bg-darkSurface border border-editorial max-w-lg w-full rounded-xl p-6 sm:p-8 space-y-6 shadow-2xl font-mono text-xs text-ink dark:text-darkInk">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-editorial pb-4">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded bg-terracotta/10 text-terracotta border border-terracotta/20">
              <Plus className="w-4 h-4" />
            </span>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-terracotta font-semibold">
                FIG 3.2 // DEAL DESK INTAKE
              </div>
              <h3 className="font-serif italic text-xl text-ink dark:text-darkInk">
                Add Custom Brand Deal
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-inkMuted dark:text-darkMuted hover:text-ink dark:hover:text-darkInk transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-inkMuted dark:text-darkMuted text-[10px] uppercase font-bold mb-1">
              Brand Partner Name *
            </label>
            <input
              type="text"
              required
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="e.g. Acne Studios, Teenage Engineering, Snow Peak"
              className="w-full bg-paper dark:bg-darkSubtle border border-editorial rounded p-2.5 text-xs text-ink dark:text-darkInk focus:outline-none focus:border-terracotta"
            />
          </div>

          <div>
            <label className="block text-inkMuted dark:text-darkMuted text-[10px] uppercase font-bold mb-1">
              Collaboration Title / Capsule Drop Concept
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 14oz Raw Selvedge Chore Coat"
              className="w-full bg-paper dark:bg-darkSubtle border border-editorial rounded p-2.5 text-xs text-ink dark:text-darkInk focus:outline-none focus:border-terracotta"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-inkMuted dark:text-darkMuted text-[10px] uppercase font-bold mb-1">
                Domain / Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-paper dark:bg-darkSubtle border border-editorial rounded p-2.5 text-xs text-ink dark:text-darkInk focus:outline-none focus:border-terracotta capitalize"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-inkMuted dark:text-darkMuted text-[10px] uppercase font-bold mb-1">
                Initial Pipeline Stage
              </label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as PipelineStage)}
                className="w-full bg-paper dark:bg-darkSubtle border border-editorial rounded p-2.5 text-xs text-ink dark:text-darkInk focus:outline-none focus:border-terracotta"
              >
                {STAGES.map((stg) => (
                  <option key={stg} value={stg}>
                    {stg}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-inkMuted dark:text-darkMuted text-[10px] uppercase font-bold mb-1">
                Qloo Affinity
              </label>
              <input
                type="text"
                value={affinity}
                onChange={(e) => setAffinity(e.target.value)}
                placeholder="7.8x"
                className="w-full bg-paper dark:bg-darkSubtle border border-editorial rounded p-2.5 text-xs text-ink dark:text-darkInk focus:outline-none focus:border-terracotta font-bold text-terracotta"
              />
            </div>

            <div>
              <label className="block text-inkMuted dark:text-darkMuted text-[10px] uppercase font-bold mb-1">
                Retail MSRP ($)
              </label>
              <input
                type="number"
                min="1"
                value={msrp}
                onChange={(e) => setMsrp(Number(e.target.value))}
                className="w-full bg-paper dark:bg-darkSubtle border border-editorial rounded p-2.5 text-xs text-ink dark:text-darkInk focus:outline-none focus:border-terracotta"
              />
            </div>

            <div>
              <label className="block text-inkMuted dark:text-darkMuted text-[10px] uppercase font-bold mb-1">
                Run Units
              </label>
              <input
                type="number"
                min="10"
                value={units}
                onChange={(e) => setUnits(Number(e.target.value))}
                className="w-full bg-paper dark:bg-darkSubtle border border-editorial rounded p-2.5 text-xs text-ink dark:text-darkInk focus:outline-none focus:border-terracotta"
              />
            </div>
          </div>

          {/* Live GMV Preview Box */}
          <div className="bg-subtle dark:bg-darkSubtle border border-editorial rounded p-3 flex items-center justify-between">
            <span className="text-inkMuted dark:text-darkMuted text-[11px]">
              Calculated Pipeline GMV:
            </span>
            <span className="font-serif italic text-base font-bold text-emerald">
              ${gmv.toLocaleString()} USD
            </span>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-editorial flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border border-editorial hover:bg-subtle dark:hover:bg-darkSubtle text-inkMuted dark:text-darkMuted transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded bg-ink text-surface dark:bg-surface dark:text-ink font-bold hover:bg-terracotta dark:hover:bg-terracotta hover:text-white transition shadow flex items-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Add to Deal Desk</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
