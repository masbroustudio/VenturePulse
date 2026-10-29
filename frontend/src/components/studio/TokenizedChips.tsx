"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Sliders, Plus, Check } from "lucide-react";

export function TokenizedChips() {
  const { activeProfile, setChipWeight, showToast } = useAppStore();
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [newAnchorInput, setNewAnchorInput] = useState("");

  const chips = activeProfile.chips || [];

  const handleWeightChange = (idx: number, newWeight: number) => {
    setChipWeight(idx, newWeight);
  };

  const addCustomAnchor = () => {
    if (!newAnchorInput.trim()) return;
    const name = newAnchorInput.trim();
    activeProfile.chips.push({
      name,
      domain: "aesthetic",
      urn: `urn:entity:custom:${name.toLowerCase().replace(/\s+/g, "_")}`,
      weight: 0.9,
    });
    setNewAnchorInput("");
    showToast(`Added custom taste anchor: ${name}`);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-[11px] font-mono uppercase tracking-wider text-inkMuted dark:text-darkMuted font-bold">
          Taste Anchors (Resolved Qloo URNs & Weights)
        </label>
        <span className="text-[10px] font-mono text-inkMuted">Click to adjust weight</span>
      </div>

      <div className="space-y-2">
        {chips.map((chip, idx) => {
          const isEditing = editingIdx === idx;
          const domainColor =
            chip.domain === "music"
              ? "text-terracotta bg-terracotta/10 border-terracotta/30"
              : chip.domain === "cinema"
              ? "text-gold bg-gold/10 border-gold/30"
              : "text-emerald bg-emerald/10 border-emerald/30";

          return (
            <div
              key={`${chip.name}-${idx}`}
              className="p-2.5 rounded bg-surface dark:bg-darkSurface border border-editorial hover:border-terracotta/50 transition"
            >
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setEditingIdx(isEditing ? null : idx)}
              >
                <div className="flex items-center space-x-2 truncate">
                  <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded border font-mono ${domainColor}`}>
                    {chip.domain}
                  </span>
                  <span className="font-bold text-xs text-ink dark:text-darkInk truncate">{chip.name}</span>
                  <span className="text-[10px] text-inkMuted dark:text-darkMuted truncate">
                    ({chip.urn.replace("urn:entity:", "")})
                  </span>
                </div>

                <div className="flex items-center space-x-1.5 flex-shrink-0">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-subtle dark:bg-darkSubtle border border-editorial text-terracotta font-bold font-mono">
                    {chip.weight.toFixed(2)}w
                  </span>
                  <Sliders className="w-3 h-3 text-inkMuted" />
                </div>
              </div>

              {/* Collapsible Slider Popover */}
              {isEditing && (
                <div className="mt-2.5 pt-2 border-t border-editorial flex items-center space-x-3 text-xs font-mono animate-fade-in">
                  <span className="text-inkMuted text-[10px]">Weight:</span>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={chip.weight}
                    onChange={(e) => handleWeightChange(idx, parseFloat(e.target.value))}
                    className="flex-1 accent-terracotta cursor-pointer"
                  />
                  <span className="font-bold text-terracotta w-10 text-right">{chip.weight.toFixed(2)}w</span>
                  <button
                    onClick={() => setEditingIdx(null)}
                    className="p-1 rounded bg-subtle hover:bg-editorial text-ink"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Inline Quick Add */}
      <div className="flex items-center space-x-2 pt-1">
        <input
          type="text"
          placeholder="+ Add custom seed anchor..."
          value={newAnchorInput}
          onChange={(e) => setNewAnchorInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addCustomAnchor()}
          className="flex-1 px-3 py-1.5 rounded bg-subtle dark:bg-darkSubtle border border-editorial text-xs font-mono text-ink dark:text-darkInk focus:outline-none focus:border-terracotta"
        />
        <button
          onClick={addCustomAnchor}
          className="px-3 py-1.5 rounded bg-ink text-surface dark:bg-surface dark:text-ink font-mono text-xs font-bold hover:bg-terracotta transition"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
