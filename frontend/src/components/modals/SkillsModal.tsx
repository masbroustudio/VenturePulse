"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store";
import { X, Copy, Check, Package, Terminal } from "lucide-react";

export const SkillsModal: React.FC = () => {
  const { isSkillsModalOpen, setSkillsModalOpen, showToast } = useAppStore();
  const [copied, setCopied] = useState(false);

  if (!isSkillsModalOpen) return null;

  const cliCommand = "npx skills add venture-pulse/qloo-skill";

  const handleCopy = () => {
    navigator.clipboard.writeText(cliCommand);
    setCopied(true);
    showToast("Copied CLI command to clipboard!");
    setTimeout(() => setCopied(false), 2400);
  };

  const toolProtocols = [
    { name: "1. qloo_taste_explorer", desc: "Traverse 250M+ entity graph across music, cinema, design" },
    { name: "2. subcultural_discovery", desc: "Map brand identity to high-affinity subcultures & creators" },
    { name: "3. market_feasibility", desc: "Evaluate CPM, budget tier fit, and audience overlap" },
    { name: "4. creative_synthesizer", desc: "Synthesize CAD specs, materials, and limited edition drops" },
    { name: "5. unit_economics_calc", desc: "Audit MSRP, production run, COGS, and royalty margins" },
    { name: "6. pitch_architect", desc: "Generate grounded cold outreach proposals with empirical lift" },
    { name: "7. counter_proof_eval", desc: "Benchmark against ungrounded vanilla LLMs with DeepEval" },
    { name: "8. crm_webhook_dispatch", desc: "Sync validated opportunities to Supabase / HubSpot deal desk" },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-surface dark:bg-darkSurface border border-editorial max-w-2xl w-full rounded-xl p-6 sm:p-8 space-y-5 shadow-2xl font-mono text-xs">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-editorial pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded bg-emerald/15 text-emerald flex items-center justify-center font-bold">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif italic text-xl text-ink dark:text-darkInk">
                skills.sh Agent Registry Package
              </h3>
              <span className="text-[10px] text-inkMuted dark:text-darkMuted uppercase">
                v1.1.0 // Open AI Coding Skill Protocol
              </span>
            </div>
          </div>
          <button
            onClick={() => setSkillsModalOpen(false)}
            className="text-inkMuted dark:text-darkMuted hover:text-ink dark:hover:text-darkInk p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-inkMuted dark:text-darkMuted font-sans text-xs leading-relaxed">
          Equip any AI coding agent (Antigravity, Claude Code, Cursor, Windsurf) with Qloo&apos;s 250M+ entity Taste Graph using the official CLI standard:
        </p>

        {/* CLI Command Box */}
        <div className="bg-paper dark:bg-darkSubtle border border-editorial p-3 rounded flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-terracotta" />
            <code className="text-terracotta font-bold text-xs">{cliCommand}</code>
          </div>
          <button
            onClick={handleCopy}
            className="px-3 py-1 bg-ink text-surface dark:bg-surface dark:text-ink rounded text-[10px] uppercase font-bold hover:bg-terracotta transition flex items-center space-x-1"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? "Copied" : "Copy CLI"}</span>
          </button>
        </div>

        {/* 8 Modular Protocols */}
        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-wider text-inkMuted dark:text-darkMuted font-bold">
            8 Modular Zod Tool Protocols:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            {toolProtocols.map((tool) => (
              <div
                key={tool.name}
                className="p-2.5 rounded bg-subtle dark:bg-darkSubtle border border-editorial space-y-0.5"
              >
                <div className="font-bold text-ink dark:text-darkInk">{tool.name}</div>
                <div className="text-[10px] text-inkMuted dark:text-darkMuted font-sans">
                  {tool.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-editorial flex items-center justify-between text-[11px]">
          <span className="text-inkMuted dark:text-darkMuted">
            Verified for Qloo Hackathon 2026
          </span>
          <button
            onClick={() => setSkillsModalOpen(false)}
            className="px-4 py-2 bg-subtle dark:bg-darkSubtle rounded border border-editorial hover:border-terracotta transition font-semibold"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
