"use client";

import { useAppStore } from "@/lib/store";
import { Terminal, Copy, ExternalLink, ShieldCheck } from "lucide-react";

export function SwissFooter() {
  const { showToast, setSkillsModalOpen } = useAppStore();

  const copySkillsCmd = () => {
    navigator.clipboard.writeText("npx skills add venture-pulse/qloo-skill");
    showToast("Copied skills.sh CLI command to clipboard!");
  };

  return (
    <footer className="border-t border-editorial bg-subtle dark:bg-darkSubtle/60 py-6 px-4 font-mono text-xs transition-colors mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: skills.sh CLI Integration */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-1.5 text-inkMuted dark:text-darkMuted text-[11px]">
            <Terminal className="w-3.5 h-3.5 text-terracotta" />
            <span className="font-bold text-ink dark:text-darkInk">skills.sh Verified Package</span>
          </div>

          <div className="flex items-center space-x-2 bg-surface dark:bg-darkSurface border border-editorial px-2.5 py-1 rounded text-[11px] text-ink dark:text-darkInk">
            <code className="text-terracotta font-bold">npx skills add venture-pulse/qloo-skill</code>
            <button
              onClick={copySkillsCmd}
              className="text-inkMuted hover:text-ink dark:hover:text-darkInk transition"
              title="Copy skills.sh CLI command"
            >
              <Copy className="w-3 h-3" />
            </button>
          </div>

          <button
            onClick={() => setSkillsModalOpen(true)}
            className="text-[11px] text-inkMuted dark:text-darkMuted hover:text-terracotta underline flex items-center space-x-1"
          >
            <span>View 8 Tool Schemas</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </button>
        </div>

        {/* Right: Architectural Grounding Metadata */}
        <div className="flex items-center space-x-4 text-[10px] text-inkMuted dark:text-darkMuted">
          <div className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald"></span>
            <span>Qloo 250M+ Entity Taste Graph</span>
          </div>
          <span>•</span>
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-3 h-3 text-emerald" />
            <span>Adversarial 2-Cycle Consensus</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
