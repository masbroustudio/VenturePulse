"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store";
import { TokenizedChips } from "@/components/studio/TokenizedChips";
import { ArrowRight, Sparkles } from "lucide-react";

export const IntakeForm: React.FC = () => {
  const {
    mode,
    activeProfile,
    setProfileName,
    setProfileCategory,
    setProfileTier,
    addProfileChip,
    setActiveView,
    showToast,
  } = useAppStore();

  const [newAnchorInput, setNewAnchorInput] = useState("");

  const handleAddAnchor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnchorInput.trim()) return;
    addProfileChip(newAnchorInput.trim());
    setNewAnchorInput("");
  };

  const handleLaunchCouncil = () => {
    showToast("Initializing LangGraph State Machine Deliberation...");
    setActiveView("debate");
  };

  return (
    <div className="lg:col-span-5 bg-surface dark:bg-darkSurface p-6 space-y-6 flex flex-col justify-between">
      <div className="space-y-6">
        {/* Cell Header Metadata */}
        <div className="flex items-center justify-between border-b border-editorial pb-3">
          <span className="text-[10px] font-mono uppercase text-inkMuted dark:text-darkMuted tracking-wider font-semibold">
            FIG 1.1 // INTAKE PROTOCOL
          </span>
          <span className="text-[10px] font-mono text-terracotta font-bold">
            STEP 1 &amp; 2 OF 3
          </span>
        </div>

        {/* Profile Form */}
        <div className="space-y-4">
          <h3 className="font-serif italic text-2xl text-ink dark:text-darkInk">
            Entity Profile &amp; Reach
          </h3>

          <div className="space-y-3 text-xs font-mono">
            <div>
              <label className="block text-inkMuted dark:text-darkMuted mb-1 uppercase text-[10px]">
                {mode === "creator" ? "Studio / Channel Handle" : "Brand / House Handle"}
              </label>
              <input
                type="text"
                value={activeProfile.name}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full bg-paper dark:bg-darkSubtle border border-editorial rounded px-3 py-2 text-ink dark:text-darkInk focus:outline-none focus:border-terracotta transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-inkMuted dark:text-darkMuted mb-1 uppercase text-[10px]">
                  Discipline / Industry
                </label>
                <select
                  value={activeProfile.category}
                  onChange={(e) => setProfileCategory(e.target.value)}
                  className="w-full bg-paper dark:bg-darkSubtle border border-editorial rounded px-2.5 py-2 text-ink dark:text-darkInk focus:outline-none focus:border-terracotta transition"
                >
                  <option value="Gaming">Indie Gaming Studio</option>
                  <option value="Podcast">Narrative Podcast</option>
                  <option value="Art">Visual &amp; 35mm Art</option>
                  <option value="Lighting">Spatial / Lighting (Lateral)</option>
                  <option value="Fashion">Apparel &amp; Outerwear</option>
                  <option value="Beverage">Craft Beverage / Spirits</option>
                  <option value="Audio">Acoustic Engineering</option>
                  <option value="Furniture">Architectural Furniture</option>
                </select>
              </div>

              <div>
                <label className="block text-inkMuted dark:text-darkMuted mb-1 uppercase text-[10px]">
                  Audience / Budget Tier
                </label>
                <select
                  value={activeProfile.tier}
                  onChange={(e) => setProfileTier(e.target.value)}
                  className="w-full bg-paper dark:bg-darkSubtle border border-editorial rounded px-2.5 py-2 text-ink dark:text-darkInk focus:outline-none focus:border-terracotta transition"
                >
                  <option value="Micro ($2k-$5k)">10k - 50k engaged</option>
                  <option value="Mid ($5k-$20k)">50k - 250k engaged</option>
                  <option value="High ($20k-$50k+)">250k+ engaged</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Tokenized Cultural Anchors with Weight Sliders */}
        <div className="space-y-4 pt-4 border-t border-editorial">
          <div className="flex items-center justify-between">
            <h3 className="font-serif italic text-2xl text-ink dark:text-darkInk">
              Tokenized Cultural Anchors
            </h3>
            <span className="text-[10px] font-mono text-terracotta font-bold">
              CLICK CHIP TO RE-WEIGHT
            </span>
          </div>
          <p className="text-xs text-inkMuted dark:text-darkMuted font-sans leading-relaxed">
            Resolved into canonical Qloo database URNs. Click any entity chip to adjust its latent confidence weight (<code className="text-terracotta font-mono">0.0–1.0</code>), re-weighting graph connections and affinity calculations in real time.
          </p>

          {/* Chips list */}
          <TokenizedChips />

          {/* Inline + Add Anchor */}
          <form onSubmit={handleAddAnchor} className="pt-2 flex items-center space-x-2">
            <input
              type="text"
              value={newAnchorInput}
              onChange={(e) => setNewAnchorInput(e.target.value)}
              placeholder="+ Add anchor (e.g. Aphex Twin, Brutalism)..."
              className="flex-1 bg-paper dark:bg-darkSubtle border border-editorial rounded px-3 py-1.5 text-xs text-ink dark:text-darkInk focus:outline-none focus:border-terracotta font-mono transition"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded bg-subtle dark:bg-darkSubtle border border-editorial hover:border-terracotta text-ink dark:text-darkInk font-mono text-xs font-semibold transition whitespace-nowrap"
            >
              + Resolve URN
            </button>
          </form>
        </div>
      </div>

      {/* Launch CTA Button */}
      <div className="pt-6">
        <button
          onClick={handleLaunchCouncil}
          className="w-full py-4 px-6 rounded bg-ink text-surface dark:bg-surface dark:text-ink font-mono text-xs uppercase tracking-wider font-bold hover:bg-terracotta dark:hover:bg-terracotta hover:text-white transition shadow flex items-center justify-center space-x-2 group"
        >
          <Sparkles className="w-4 h-4 text-terracotta group-hover:text-white transition" />
          <span>Launch Cyclic LangGraph Deliberation</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
        </button>
      </div>
    </div>
  );
};
