"use client";

import { useAppStore } from "@/lib/store";

export function FlowBanner() {
  const { mode, toggleMode } = useAppStore();
  const isBrand = mode === "brand";

  return (
    <div
      className={`border-b border-editorial px-4 py-2 text-xs font-mono transition-colors ${
        isBrand ? "bg-brandIndigo/5 dark:bg-brandIndigo/10" : "bg-terracotta/5 dark:bg-terracotta/10"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2 truncate">
          <span
            className={`px-1.5 py-0.5 rounded text-white font-bold text-[10px] uppercase ${
              isBrand ? "bg-brandIndigo" : "bg-terracotta"
            }`}
          >
            {isBrand ? "BRAND COUNTER-DISCOVERY WORKFLOW" : "CREATOR WORKFLOW"}
          </span>
          <span className="text-ink dark:text-darkInk truncate font-medium">
            {isBrand
              ? "Uncovering untapped micro-creator subcultures, indie podcasts, and gaming communities where your brand indexes >6x above baseline."
              : "Translating creator aesthetic DNA into verified lifestyle brand sponsors & co-branded merchandise drops."}
          </span>
        </div>
        <button
          onClick={toggleMode}
          className={`hover:underline font-bold text-[11px] whitespace-nowrap ml-2 ${
            isBrand ? "text-brandIndigo" : "text-terracotta"
          }`}
        >
          {isBrand ? "← Flip to Creator Mode" : "Flip to Brand Mode →"}
        </button>
      </div>
    </div>
  );
}
