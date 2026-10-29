"use client";

import React, { useState } from "react";
import { Zap } from "lucide-react";

interface FounderBarProps {
  onInjectConstraint: (constraint: string) => Promise<void> | void;
}

export const FounderBar: React.FC<FounderBarProps> = ({ onInjectConstraint }) => {
  const [constraint, setConstraint] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!constraint.trim()) return;
    setSubmitting(true);
    try {
      await onInjectConstraint(constraint.trim());
      setConstraint("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-surface dark:bg-darkSurface border border-editorial p-4 rounded shadow-editorial space-y-2">
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-terracotta font-semibold flex items-center space-x-1.5">
          <span>🎙️ Founder / Evaluator Mid-Debate Intervention Bar</span>
        </span>
        <span className="text-inkMuted dark:text-darkMuted text-[11px]">
          Inject live constraints into the LangGraph loop
        </span>
      </div>

      <form onSubmit={handleSubmit} className="flex items-center space-x-3">
        <input
          type="text"
          value={constraint}
          onChange={(e) => setConstraint(e.target.value)}
          placeholder="e.g. 'Keep retail price under $150 USD' or 'Require GOTS-certified organic selvedge'..."
          className="flex-1 bg-paper dark:bg-darkSubtle border border-editorial rounded px-3.5 py-2 text-xs font-mono text-ink dark:text-darkInk focus:outline-none focus:border-terracotta transition"
        />
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 rounded bg-ink text-surface dark:bg-surface dark:text-ink font-mono text-xs font-bold uppercase tracking-wider hover:bg-terracotta dark:hover:bg-terracotta hover:text-white transition shadow flex items-center space-x-1.5 whitespace-nowrap disabled:opacity-50"
        >
          <span>Inject Constraint</span>
          <Zap className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
