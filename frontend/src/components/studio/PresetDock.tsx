"use client";

import { useAppStore } from "@/lib/store";
import { CREATOR_PRESETS, BRAND_PRESETS } from "@/lib/presets";
import { Zap } from "lucide-react";

export function PresetDock() {
  const { mode, activePresetIdx, applyPreset } = useAppStore();
  const presets = mode === "creator" ? CREATOR_PRESETS : BRAND_PRESETS;
  const isBrand = mode === "brand";

  return (
    <div className="border border-editorial rounded bg-surface dark:bg-darkSurface p-4 shadow-sm transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-editorial gap-2">
        <div className="flex items-center space-x-2">
          <Zap className={`w-3.5 h-3.5 ${isBrand ? "text-brandIndigo" : "text-terracotta"}`} />
          <span className={`font-mono text-xs font-bold uppercase tracking-wider ${isBrand ? "text-brandIndigo" : "text-terracotta"}`}>
            {isBrand ? "⚡ PRESET DOCK // LIFESTYLE BRANDS" : "⚡ PRESET DOCK // CREATOR ARCHETYPES"}
          </span>
        </div>
        <span className="text-[10px] font-mono text-inkMuted dark:text-darkMuted">
          {isBrand ? "// 4 Heritage Brands Seeking High-Affinity Communities" : "// 4 Diverse Studios with Resolved Qloo Latent Clusters"}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {presets.map((preset, idx) => {
          const isActive = activePresetIdx === idx;
          return (
            <button
              key={preset.id}
              onClick={() => applyPreset(idx)}
              className={`text-left p-3 rounded border font-mono transition group relative ${
                isActive
                  ? isBrand
                    ? "border-brandIndigo bg-brandIndigo/10 text-ink dark:text-darkInk shadow-sm"
                    : "border-terracotta bg-terracotta/10 text-ink dark:text-darkInk shadow-sm"
                  : "border-editorial bg-subtle dark:bg-darkSubtle hover:border-terracotta/60 text-inkMuted dark:text-darkMuted hover:text-ink dark:hover:text-darkInk"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[10px] font-bold ${isActive ? (isBrand ? "text-brandIndigo" : "text-terracotta") : "text-inkMuted"}`}>
                  0{idx + 1} //
                </span>
                {isActive && (
                  <span className={`w-1.5 h-1.5 rounded-full ${isBrand ? "bg-brandIndigo" : "bg-terracotta"} animate-pulse`}></span>
                )}
              </div>
              <div className="font-serif italic text-sm text-ink dark:text-darkInk font-medium group-hover:underline truncate">
                {preset.name}
              </div>
              <div className="text-[10px] text-inkMuted dark:text-darkMuted truncate mt-0.5">
                {preset.category}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
