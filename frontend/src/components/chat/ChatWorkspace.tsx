"use client";

import React, { useRef, useEffect } from "react";
import { useCopilotChat, CopilotProposalArtifact } from "@/hooks/useCopilotChat";
import { useAppStore } from "@/lib/store";
import {
  Send,
  Sparkles,
  RotateCcw,
  LayoutGrid,
  Check,
  Plus,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Palette,
  ExternalLink,
  Zap,
} from "lucide-react";

export const ChatWorkspace: React.FC = () => {
  const { mode, activeProfile, setActiveView, setSelectedDeal } = useAppStore();
  const {
    messages,
    input,
    setInput,
    isStreaming,
    sendMessage,
    resetChat,
    starterPrompts,
    addDealToDealDesk,
  } = useCopilotChat();

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInspectInLookbook = (artifact: CopilotProposalArtifact) => {
    setSelectedDeal({
      card_id: `deal_chat_${Date.now()}`,
      brand_name: artifact.brand_name,
      title: artifact.title,
      category: artifact.category,
      affinity_multiplier: artifact.affinity_multiplier,
      synergy_score: 0.94,
      stage: "Discovered",
      msrp: artifact.unit_economics.msrp,
      run_units: artifact.unit_economics.units,
      gmv: artifact.unit_economics.gmv,
      spec: {
        title: artifact.title,
        brand_partner: artifact.brand_name,
        category: artifact.category,
        affinity_multiplier: artifact.affinity_multiplier,
        description: artifact.rationale,
        materials: artifact.materials,
        colorways: artifact.colorways,
        msrp_usd: artifact.unit_economics.msrp,
        run_units: artifact.unit_economics.units,
        projected_gmv: artifact.unit_economics.gmv,
        creator_royalty_pct: artifact.unit_economics.royalty_pct / 100,
        projected_royalty: artifact.unit_economics.royalty_payout,
        outreach_pitch: `According to Qloo's cultural intelligence graph (250M+ entities), our audience exhibits an extraordinary ${artifact.affinity_multiplier} statistical affinity for ${artifact.brand_name}.`,
      },
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Workspace Header */}
      <div className="border-b border-editorial pb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-terracotta font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald animate-pulse"></span>
            <span>FIG 4.1 // CONVERSATIONAL CULTURAL INTELLIGENCE</span>
          </div>
          <h1 className="font-serif italic text-3xl sm:text-4xl text-ink dark:text-darkInk mt-0.5">
            Cultural Strategist Copilot
          </h1>
          <p className="text-xs text-inkMuted dark:text-darkMuted font-sans pt-1">
            Grounded in Qloo&apos;s 250M+ entity Taste Graph. Brainstorm high-affinity brands, audit physical unit economics, and dispatch drops directly to Deal Desk.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <button
            onClick={resetChat}
            className="px-2.5 py-1.5 rounded border border-editorial bg-surface dark:bg-darkSurface hover:bg-subtle dark:hover:bg-darkSubtle text-inkMuted dark:text-darkMuted hover:text-ink dark:hover:text-darkInk transition flex items-center space-x-1"
            title="Reset conversation"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
          <button
            onClick={() => setActiveView("wizard")}
            className="px-3 py-1.5 rounded bg-ink text-surface dark:bg-surface dark:text-ink font-bold hover:bg-terracotta dark:hover:bg-terracotta hover:text-white transition shadow flex items-center space-x-1.5"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-terracotta" />
            <span>Studio Workspace</span>
          </button>
        </div>
      </div>

      {/* Split-Pane Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Main: Conversational Stream & Input (8 Cols) */}
        <div className="lg:col-span-8 bg-surface dark:bg-darkSurface border border-editorial rounded-lg shadow-editorial flex flex-col h-[720px] justify-between overflow-hidden">
          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 font-mono text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`space-y-3 ${
                  msg.role === "user"
                    ? "pl-8 text-right"
                    : "pr-4 text-left border-l-2 border-terracotta/40 pl-3.5"
                }`}
              >
                {/* Message Header */}
                <div
                  className={`flex items-center space-x-2 text-[10px] text-inkMuted dark:text-darkMuted ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <span className="font-bold text-ink dark:text-darkInk">
                    {msg.role === "user" ? "You" : "Venture Pulse Copilot"}
                  </span>
                  <span>• {msg.timestamp}</span>
                </div>

                {/* Tool Call Notification */}
                {msg.tool_call && (
                  <div className="inline-flex items-center space-x-1.5 bg-cyan/10 text-cyan border border-cyan/30 px-2.5 py-1 rounded text-[10px] font-bold">
                    <Zap className="w-3 h-3 animate-pulse" />
                    <span>Tool: {msg.tool_call.tool}</span>
                    <span className="text-inkMuted dark:text-darkMuted font-normal">
                      ({msg.tool_call.query})
                    </span>
                  </div>
                )}

                {/* Message Content */}
                <div
                  className={`p-3.5 rounded text-xs font-sans leading-relaxed ${
                    msg.role === "user"
                      ? "bg-paper dark:bg-darkSubtle border border-editorial text-ink dark:text-darkInk inline-block max-w-xl text-left"
                      : "text-ink dark:text-darkInk bg-transparent"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>

                {/* Rich Artifact: Interactive Proposal Card */}
                {msg.artifact && (
                  <div className="mt-4 p-4 rounded-lg bg-paper dark:bg-darkSubtle border border-editorial space-y-4 font-mono text-xs shadow-sm">
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-editorial pb-2.5">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded bg-terracotta/10 text-terracotta border border-terracotta/20 text-[10px] uppercase font-bold">
                          {msg.artifact.category}
                        </span>
                        <span className="font-serif italic text-lg text-ink dark:text-darkInk font-bold">
                          {msg.artifact.brand_name}
                        </span>
                      </div>
                      <div className="text-terracotta font-bold text-sm">
                        ⚡ {msg.artifact.affinity_multiplier} Affinity Lift
                      </div>
                    </div>

                    {/* Proposal Title */}
                    <div>
                      <div className="text-[10px] uppercase text-inkMuted dark:text-darkMuted">
                        Co-Branded Capsule Concept
                      </div>
                      <div className="font-serif italic text-xl text-ink dark:text-darkInk font-bold mt-0.5">
                        &ldquo;{msg.artifact.title}&rdquo;
                      </div>
                    </div>

                    {/* 1. Affinity Comparison Visual Bar Chart */}
                    <div className="space-y-1.5 pt-2 border-t border-editorial">
                      <div className="flex items-center justify-between text-[10px] text-inkMuted dark:text-darkMuted uppercase">
                        <span className="flex items-center space-x-1 font-semibold">
                          <TrendingUp className="w-3 h-3 text-emerald" />
                          <span>Qloo Affinity Comparison</span>
                        </span>
                        <span>Candidate vs. Control</span>
                      </div>
                      <div className="space-y-1.5 bg-surface dark:bg-darkSurface p-2.5 rounded border border-editorial">
                        {msg.artifact.affinity_comparison.map((item) => (
                          <div key={item.name} className="space-y-0.5">
                            <div className="flex justify-between text-[11px]">
                              <span className="font-medium text-ink dark:text-darkInk">
                                {item.name}
                              </span>
                              <span className="text-terracotta font-bold">{item.affinity}</span>
                            </div>
                            <div className="w-full bg-subtle dark:bg-darkSubtle h-1.5 rounded overflow-hidden">
                              <div
                                className="bg-emerald h-full transition-all duration-500"
                                style={{ width: `${item.score}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 2. Unit Economics Financial Breakdown Table */}
                    <div className="space-y-1.5 pt-2 border-t border-editorial">
                      <div className="flex items-center justify-between text-[10px] text-inkMuted dark:text-darkMuted uppercase">
                        <span className="flex items-center space-x-1 font-semibold">
                          <DollarSign className="w-3 h-3 text-emerald" />
                          <span>Audited Unit Economics Breakdown</span>
                        </span>
                        <span>{msg.artifact.unit_economics.royalty_pct}% Creator Royalty</span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-[11px] text-left border border-editorial rounded overflow-hidden">
                          <thead className="bg-surface dark:bg-darkSurface text-inkMuted dark:text-darkMuted text-[10px] uppercase border-b border-editorial">
                            <tr>
                              <th className="p-2">Target MSRP</th>
                              <th className="p-2">Run Units</th>
                              <th className="p-2">Gross GMV</th>
                              <th className="p-2">Est. COGS</th>
                              <th className="p-2 text-right">Net Payout</th>
                            </tr>
                          </thead>
                          <tbody className="bg-paper dark:bg-darkSubtle divide-y divide-editorial">
                            <tr>
                              <td className="p-2 font-bold text-ink dark:text-darkInk">
                                ${msg.artifact.unit_economics.msrp}
                              </td>
                              <td className="p-2">{msg.artifact.unit_economics.units}</td>
                              <td className="p-2 font-bold text-ink dark:text-darkInk">
                                ${msg.artifact.unit_economics.gmv.toLocaleString()}
                              </td>
                              <td className="p-2 text-inkMuted dark:text-darkMuted">
                                ${msg.artifact.unit_economics.cogs.toLocaleString()}
                              </td>
                              <td className="p-2 text-right font-bold text-emerald">
                                ${msg.artifact.unit_economics.royalty_payout.toLocaleString()}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Materials & Colorways */}
                    <div className="space-y-1 pt-1 text-[11px]">
                      <span className="text-[10px] text-inkMuted dark:text-darkMuted uppercase block">
                        Specified Materials:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.artifact.materials.map((mat) => (
                          <span
                            key={mat}
                            className="px-2 py-0.5 rounded bg-surface dark:bg-darkSurface border border-editorial text-ink dark:text-darkInk text-[10px]"
                          >
                            {mat}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Interactive Action Buttons */}
                    <div className="pt-3 border-t border-editorial flex flex-wrap items-center justify-between gap-2">
                      <button
                        onClick={() => handleInspectInLookbook(msg.artifact!)}
                        className="text-terracotta hover:underline font-bold text-xs flex items-center space-x-1"
                      >
                        <span>Inspect Spec in Lookbook</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() => addDealToDealDesk(msg.artifact!)}
                        className="px-4 py-2 rounded bg-ink text-surface dark:bg-surface dark:text-ink font-mono text-xs uppercase font-bold hover:bg-terracotta dark:hover:bg-terracotta hover:text-white transition shadow flex items-center space-x-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to Deal Desk</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Area: Starter Prompts + Input Bar */}
          <div className="p-4 border-t border-editorial bg-paper dark:bg-darkSubtle space-y-3">
            {/* 4 Mode-Aware Starter Prompts */}
            <div className="flex flex-wrap gap-1.5">
              {starterPrompts.map((prompt, i) => (
                <button
                  key={i}
                  disabled={isStreaming}
                  onClick={() => sendMessage(prompt)}
                  className="text-[10px] font-mono px-2.5 py-1 rounded bg-surface dark:bg-darkSurface border border-editorial hover:border-terracotta text-ink dark:text-darkInk transition truncate max-w-[280px] sm:max-w-none text-left disabled:opacity-50"
                  title={prompt}
                >
                  ⚡ {prompt}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <div className="flex items-end space-x-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Cultural Copilot (e.g. 'Propose a Japanese selvedge jacket with Acne Studios')..."
                rows={2}
                className="flex-1 bg-surface dark:bg-darkSurface border border-editorial rounded-lg p-2.5 text-xs font-mono text-ink dark:text-darkInk focus:outline-none focus:border-terracotta resize-none transition"
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isStreaming}
                className="h-10 px-4 rounded bg-ink text-surface dark:bg-surface dark:text-ink font-mono text-xs font-bold uppercase tracking-wider hover:bg-terracotta dark:hover:bg-terracotta hover:text-white transition shadow flex items-center space-x-1.5 disabled:opacity-40"
              >
                <span>Send</span>
                <Send className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Live Qloo Entity Inspector & Active Context (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-surface dark:bg-darkSurface border border-editorial rounded-lg p-5 shadow-editorial space-y-4 font-mono text-xs">
            <div className="border-b border-editorial pb-2.5 flex items-center justify-between">
              <span className="text-[10px] uppercase text-inkMuted dark:text-darkMuted font-bold">
                Active Entity Topology
              </span>
              <span className="text-[10px] bg-terracotta/10 text-terracotta px-2 py-0.5 rounded border border-terracotta/20 font-bold uppercase">
                {mode} Mode
              </span>
            </div>

            <div>
              <div className="font-serif italic text-2xl text-ink dark:text-darkInk">
                {activeProfile.name}
              </div>
              <div className="text-[11px] text-inkMuted dark:text-darkMuted mt-0.5">
                Category: <strong>{activeProfile.category}</strong> • Tier: <strong>{activeProfile.tier}</strong>
              </div>
            </div>

            {/* Declared Anchors */}
            <div className="space-y-2 pt-2 border-t border-editorial">
              <span className="text-[10px] uppercase text-inkMuted dark:text-darkMuted block font-bold">
                Declared Cultural Anchors:
              </span>
              <div className="space-y-1.5">
                {activeProfile.chips.map((chip) => (
                  <div
                    key={chip.name}
                    className="p-2 rounded bg-paper dark:bg-darkSubtle border border-editorial flex items-center justify-between text-[11px]"
                  >
                    <span className="font-bold text-ink dark:text-darkInk">{chip.name}</span>
                    <span className="text-terracotta font-semibold">{chip.weight}w</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Candidate Graph Partners */}
            <div className="space-y-2 pt-2 border-t border-editorial">
              <span className="text-[10px] uppercase text-inkMuted dark:text-darkMuted block font-bold">
                Qloo 250M+ Top Latent Matches:
              </span>
              <div className="space-y-1.5">
                {activeProfile.graph.brands.map((b) => (
                  <div
                    key={b.id}
                    className="p-2 rounded bg-paper dark:bg-darkSubtle border border-editorial flex items-center justify-between text-[11px]"
                  >
                    <span className="font-medium text-ink dark:text-darkInk">{b.name}</span>
                    <span className="text-emerald font-bold">{b.affinity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Jump to Council Deliberation */}
            <div className="pt-2 border-t border-editorial">
              <button
                onClick={() => setActiveView("debate")}
                className="w-full py-2.5 px-4 rounded bg-subtle dark:bg-darkSubtle border border-editorial hover:border-terracotta text-ink dark:text-darkInk font-mono text-xs font-semibold transition flex items-center justify-center space-x-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-terracotta" />
                <span>Launch Council Deliberation →</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
