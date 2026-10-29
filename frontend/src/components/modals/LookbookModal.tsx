"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store";
import { useDeals } from "@/hooks/useDeals";
import { X, Copy, Check, Send } from "lucide-react";

interface Swatch {
  id: string;
  name: string;
  pantone: string;
  hex: string;
  detail: string;
}

const DEFAULT_SWATCHES: Swatch[] = [
  {
    id: "denim",
    name: "14oz Okayama Indigo",
    pantone: "PANTONE 19-4052 Classic Blue",
    hex: "#1e3a8a",
    detail: "Kuroki Mills, Okayama Japan • Pure vegetable indigo warp • GOTS Certified",
  },
  {
    id: "citron",
    name: "Citron Selvedge Ticker",
    pantone: "PANTONE 13-0632 Endive",
    hex: "#eab308",
    detail: "Custom high-visibility shuttle selvedge ID line woven exclusively for this drop",
  },
  {
    id: "nickel",
    name: "Matte Nickel Hardware",
    pantone: "PANTONE 18-0403 Dark Gull Gray",
    hex: "#52525b",
    detail: "Solid forged brass buttons with debossed architectural coordinates",
  },
  {
    id: "pocket",
    name: "Organic Cotton Pocketing",
    pantone: "PANTONE 11-0601 Bright White",
    hex: "#f4f4f5",
    detail: "10oz herringbone pocket bags screenprinted with creator manifesto",
  },
];

export const LookbookModal: React.FC = () => {
  const { selectedDeal, setSelectedDeal, activeProfile, showToast, mode } = useAppStore();
  const { updateStage } = useDeals();

  const [activeSwatch, setActiveSwatch] = useState<Swatch>(DEFAULT_SWATCHES[0]);
  const [runUnits, setRunUnits] = useState<number>(500);
  const [retailPrice, setRetailPrice] = useState<number>(185);
  const [copied, setCopied] = useState<boolean>(false);

  if (!selectedDeal) return null;

  const brandName = selectedDeal.brand_name || selectedDeal.brand || "Acne Studios";
  const title = selectedDeal.title || `${selectedDeal.category || "Apparel"} Capsule Drop`;
  const gmv = runUnits * retailPrice;
  const royaltyPct = 0.18;
  const creatorRoyalty = Math.round(gmv * royaltyPct);

  const pitchSubject = `Collaboration Proposal: ${brandName} × ${activeProfile.name} (Qloo Taste Match)`;
  const pitchBody = `Hi Partnerships Team,

According to Qloo's cultural intelligence graph (250M+ entities), our audience exhibits an extraordinary statistical affinity for your brand aesthetic and material craftsmanship.

Rather than generic logo placements, we have pre-architected a limited capsule concept: "${title}", with projected unit economics of $${retailPrice} MSRP across a limited ${runUnits}-unit run ($${gmv.toLocaleString()} GMV).

Would you be open to an initial 10-minute briefing on the cultural affinity data and technical production specs?

Best regards,
${activeProfile.name} Partnerships Lead`;

  const handleCopyPitch = () => {
    navigator.clipboard.writeText(`${pitchSubject}\n\n${pitchBody}`);
    setCopied(true);
    showToast("Pitch copied to clipboard!");
    setTimeout(() => setCopied(false), 2400);
  };

  const handleDispatch = () => {
    updateStage({ card_id: selectedDeal.card_id, new_stage: "Dispatched" });
    setSelectedDeal(null);
    showToast(`Dispatched ${brandName} to CRM Webhook!`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-surface dark:bg-darkSurface border border-editorial max-w-5xl w-full max-h-[92vh] overflow-y-auto rounded-xl p-6 sm:p-8 space-y-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-editorial pb-4">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-mono uppercase tracking-widest text-terracotta bg-terracotta/10 px-2.5 py-1 rounded border border-terracotta/20 font-semibold">
              EDITORIAL COLLABORATION DOSSIER
            </span>
            <span className="text-xs font-mono text-inkMuted dark:text-darkMuted bg-subtle dark:bg-darkSubtle px-2 py-1 rounded border border-editorial uppercase">
              {selectedDeal.category || "Lifestyle"}
            </span>
          </div>
          <button
            onClick={() => setSelectedDeal(null)}
            className="text-inkMuted dark:text-darkMuted hover:text-ink dark:hover:text-darkInk font-mono text-xs px-2.5 py-1 rounded bg-subtle dark:bg-darkSubtle border border-editorial flex items-center space-x-1"
          >
            <X className="w-3.5 h-3.5" />
            <span>Esc</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Vector Blueprint & Material Swatches & Sliders (6 Cols) */}
          <div className="lg:col-span-6 bg-paper dark:bg-darkSubtle border border-editorial p-6 sm:p-8 rounded space-y-5 shadow-editorial">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-inkMuted dark:text-darkMuted uppercase tracking-wider font-semibold">
                {brandName} × {activeProfile.name}
              </span>
              <span className="font-mono text-xs font-bold text-ink dark:text-darkInk bg-subtle dark:bg-darkSubtle px-2 py-0.5 rounded border border-editorial">
                EDITION 001 / {runUnits}
              </span>
            </div>

            <div>
              <h3 className="font-serif italic text-3xl sm:text-4xl text-ink dark:text-darkInk leading-tight">
                {title}
              </h3>
              <p className="text-xs text-inkMuted dark:text-darkMuted leading-relaxed font-sans mt-2">
                Co-architected with algorithmic precision. Crafted using premium materials and archival construction techniques, carrying cross-domain cultural resonances identified by Qloo Taste AI™.
              </p>
            </div>

            {/* Technical Vector Blueprint Schematic */}
            <div className="w-full h-36 bg-surface dark:bg-darkSurface border border-editorial rounded p-3 flex items-center justify-center relative overflow-hidden font-mono text-xs">
              <svg className="w-full h-full stroke-ink dark:stroke-darkInk" viewBox="0 0 320 120" fill="none">
                {/* CAD Grid Background */}
                <defs>
                  <pattern id="cad-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#e4e4e7" strokeWidth="0.5" className="dark:stroke-zinc-800" />
                  </pattern>
                </defs>
                <rect width="320" height="120" fill="url(#cad-grid)" />
                {/* Technical schematic lines */}
                <path d="M 60 30 L 110 20 L 160 30 L 160 100 L 60 100 Z" strokeWidth="1.5" />
                <path d="M 160 30 L 210 20 L 260 30 L 260 100 L 160 100 Z" strokeWidth="1.5" />
                <line x1="160" y1="20" x2="160" y2="105" strokeWidth="1" strokeDasharray="3,2" />
                <circle cx="110" cy="55" r="4" strokeWidth="1" />
                <circle cx="210" cy="55" r="4" strokeWidth="1" />
                <path d="M 75 60 L 95 60 L 95 80 L 75 80 Z" strokeWidth="1" />
                <path d="M 225 60 L 245 60 L 245 80 L 225 80 Z" strokeWidth="1" />
                {/* Dimension callouts */}
                <text x="70" y="112" fontSize="7" fill="#ea580c" fontFamily="monospace">SEAM: 480mm</text>
                <text x="180" y="112" fontSize="7" fill="#ea580c" fontFamily="monospace">TOLERANCE: ±0.5mm</text>
              </svg>
              <span className="absolute top-2 right-2 text-[9px] font-mono text-inkMuted dark:text-darkMuted uppercase">
                CAD SCHEMATIC 1.0
              </span>
            </div>

            {/* Clickable Material & Pantone Swatches */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase text-inkMuted dark:text-darkMuted">
                <span>Interactive Material Swatches</span>
                <span className="text-terracotta">Click swatch to inspect BOM</span>
              </div>
              <div className="flex items-center space-x-2">
                {DEFAULT_SWATCHES.map((swatch) => (
                  <button
                    key={swatch.id}
                    onClick={() => setActiveSwatch(swatch)}
                    className={`w-9 h-9 rounded-md border-2 transition transform ${
                      activeSwatch.id === swatch.id
                        ? "border-terracotta scale-110 shadow-md"
                        : "border-editorial hover:scale-105"
                    }`}
                    style={{ backgroundColor: swatch.hex }}
                    title={swatch.name}
                  />
                ))}
              </div>
              <div className="p-2.5 rounded bg-surface dark:bg-darkSurface border border-editorial font-mono text-[11px] text-ink dark:text-darkInk space-y-0.5">
                <div>
                  Selected: <strong className="text-terracotta">{activeSwatch.name}</strong> ({activeSwatch.pantone})
                </div>
                <div className="text-[10px] text-inkMuted dark:text-darkMuted">
                  {activeSwatch.detail}
                </div>
              </div>
            </div>

            {/* Interactive Unit Economics & Royalty Simulator */}
            <div className="p-4 rounded bg-surface dark:bg-darkSurface border border-editorial space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-editorial pb-1.5 text-terracotta font-bold">
                <span>📊 Dynamic Unit Economics Simulator</span>
                <span className="text-[10px] text-inkMuted dark:text-darkMuted">18% Standard Royalty</span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-inkMuted dark:text-darkMuted">Edition Run:</span>
                  <span className="font-bold text-ink dark:text-darkInk">{runUnits} units</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="2500"
                  step="50"
                  value={runUnits}
                  onChange={(e) => setRunUnits(Number(e.target.value))}
                  className="w-full accent-terracotta cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-inkMuted dark:text-darkMuted">Target Retail:</span>
                  <span className="font-bold text-ink dark:text-darkInk">${retailPrice} USD</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="500"
                  step="10"
                  value={retailPrice}
                  onChange={(e) => setRetailPrice(Number(e.target.value))}
                  className="w-full accent-terracotta cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-editorial text-[11px]">
                <div>
                  <span className="text-inkMuted dark:text-darkMuted block text-[10px]">
                    GROSS REVENUE (GMV)
                  </span>
                  <span className="text-ink dark:text-darkInk font-bold text-sm">
                    ${gmv.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-inkMuted dark:text-darkMuted block text-[10px]">
                    CREATOR ROYALTY (18%)
                  </span>
                  <span className="text-emerald font-bold text-sm">
                    ${creatorRoyalty.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Commercial Term Sheet & Cold Outreach Pitch (6 Cols) */}
          <div className="lg:col-span-6 bg-surface dark:bg-darkSurface border border-editorial p-6 sm:p-8 rounded space-y-5 shadow-editorial text-xs font-mono flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-editorial pb-3">
                <span className="font-bold text-ink dark:text-darkInk uppercase">
                  Commercial Term Sheet &amp; Pitch
                </span>
                <button
                  onClick={handleCopyPitch}
                  className="text-terracotta hover:underline font-bold flex items-center space-x-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy Pitch Copy"}</span>
                </button>
              </div>

              <div>
                <span className="text-inkMuted dark:text-darkMuted uppercase text-[10px]">
                  Subject Line:
                </span>
                <div className="text-ink dark:text-darkInk font-bold mt-1 text-sm">
                  {pitchSubject}
                </div>
              </div>

              <div className="space-y-2 text-ink dark:text-darkInk font-sans text-xs leading-relaxed bg-paper dark:bg-darkSubtle p-4 rounded border border-editorial">
                <p>Hi Partnerships Team,</p>
                <p>
                  According to Qloo&apos;s cultural intelligence graph (250M+ entities), our audience exhibits an extraordinary <strong className="text-terracotta">statistical affinity</strong> for your brand aesthetic and material craftsmanship.
                </p>
                <p>
                  Rather than generic logo placements, we have pre-architected a limited capsule concept: <em className="font-serif italic text-sm">{title}</em>, targeting our high-conversion collectors cohort.
                </p>
                <p>
                  Projected commercial scope: <strong>${retailPrice} MSRP</strong> × <strong>{runUnits} units</strong> = <strong>${gmv.toLocaleString()} GMV</strong>.
                </p>
                <p>Would you be open to an initial 10-minute briefing on the cultural data and production specs?</p>
              </div>
            </div>

            {/* Webhook Dispatch Button */}
            <div className="pt-4 border-t border-editorial flex items-center justify-between">
              <span className="text-inkMuted dark:text-darkMuted text-[11px]">
                Destination: CRM Deal Desk &amp; HubSpot Webhook
              </span>
              <button
                onClick={handleDispatch}
                className="px-5 py-2.5 rounded bg-ink text-surface dark:bg-surface dark:text-ink font-mono text-xs font-bold uppercase tracking-wider hover:bg-terracotta dark:hover:bg-terracotta hover:text-white transition shadow flex items-center space-x-1.5"
              >
                <span>Dispatch to CRM</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
