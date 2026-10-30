"use client";

import React, { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { useDeals } from "@/hooks/useDeals";
import { CadSchematicViewer } from "./CadSchematicViewer";
import { X, Copy, Check, Send } from "lucide-react";

interface Swatch {
  id: string;
  name: string;
  pantone: string;
  hex: string;
  detail: string;
}

function getCategorySwatches(deal: any): Swatch[] {
  const cat = (deal?.category || "").toLowerCase();
  const brand = (deal?.brand_name || deal?.brand || "").toLowerCase();
  const title = (deal?.title || deal?.spec?.title || "").toLowerCase();
  const specMaterials: string[] = deal?.spec?.materials || [];

  if (cat.includes("access") || title.includes("watch") || title.includes("chronograph") || brand.includes("seiko")) {
    return [
      {
        id: "titanium",
        name: specMaterials[0] || "Grade 5 Aerospace Titanium",
        pantone: "PANTONE 17-5104 Ultimate Gray",
        hex: "#64748b",
        detail: "Ultra-lightweight aerospace titanium case with Zaratsu distortion-free polishing",
      },
      {
        id: "sapphire",
        name: specMaterials[1] || "Double-Curved Sapphire Crystal",
        pantone: "PANTONE 11-0602 Snow White",
        hex: "#f8fafc",
        detail: "9 Mohs hardness scratchproof synthetic corundum with inner anti-reflective AR coating",
      },
      {
        id: "movement",
        name: specMaterials[2] || "Japanese Mechanical Calibre",
        pantone: "PANTONE 19-4006 Caviar",
        hex: "#18181b",
        detail: "High-beat automatic chronograph escapement with 72-hour power reserve",
      },
      {
        id: "strap",
        name: specMaterials[3] || "Fluoroelastomer Technical Strap",
        pantone: "PANTONE 19-3911 Deep Night",
        hex: "#0f172a",
        detail: "Heat and chemical resistant matte strap with debossed serialized buckle",
      },
    ];
  }

  if (cat.includes("footwear") || title.includes("shoe") || title.includes("runner") || brand.includes("salomon")) {
    return [
      {
        id: "mesh",
        name: specMaterials[0] || "Abrasion-Resistant Ripstop Mesh",
        pantone: "PANTONE 19-4004 Black Onyx",
        hex: "#18181b",
        detail: "Single-layer anti-debris hydrophobic weave engineered for Alpine endurance",
      },
      {
        id: "tpu",
        name: specMaterials[1] || "Thermo-Welded TPU Lateral Cage",
        pantone: "PANTONE 14-4102 Cool Gray",
        hex: "#94a3b8",
        detail: "Seamless structural overlay cradling foot arch with zero pressure points",
      },
      {
        id: "midsole",
        name: specMaterials[2] || "Dual-Density EVA Energy Cell",
        pantone: "PANTONE 12-0752 Sulphur Spring",
        hex: "#eab308",
        detail: "Supercritical foam matrix providing 68% energy return on uneven terrain",
      },
      {
        id: "rubber",
        name: specMaterials[3] || "Chevron Contagrip Rubber Lug",
        pantone: "PANTONE 18-0403 Dark Gull Gray",
        hex: "#3f3f46",
        detail: "Deep 5.0mm directional lugs compounded for wet rock and loose scree traction",
      },
    ];
  }

  if (cat.includes("tech") || brand.includes("teenage") || brand.includes("keychron")) {
    return [
      {
        id: "aluminum",
        name: specMaterials[0] || "CNC 6061 Aluminum",
        pantone: "PANTONE 14-4102 Cool Gray",
        hex: "#94a3b8",
        detail: "Precision bead-blasted and anodized aerospace alloy enclosure",
      },
      {
        id: "switches",
        name: specMaterials[1] || "Tactile Low-Profile Switches",
        pantone: "PANTONE 19-4006 Caviar",
        hex: "#18181b",
        detail: "Custom damped mechanical stems engineered for 70M acoustic cycles",
      },
      {
        id: "display",
        name: specMaterials[2] || "Monochrome OLED Micro-Panel",
        pantone: "PANTONE 12-0752 Sulphur Spring",
        hex: "#facc15",
        detail: "High-contrast anti-glare display running custom firmware routines",
      },
      {
        id: "circuit",
        name: specMaterials[3] || "Gold-Plated Circuitry",
        pantone: "PANTONE 14-0955 Solar Power",
        hex: "#d97706",
        detail: "Hard-gold immersed contacts with debossed motherboard coordinates",
      },
    ];
  }

  if (cat.includes("beverage") || brand.includes("matcha")) {
    return [
      {
        id: "tea",
        name: specMaterials[0] || "Single-Origin Uji Tencha",
        pantone: "PANTONE 18-0332 Green Olive",
        hex: "#4d7c0f",
        detail: "First-harvest ceremonial tencha leaves, slow stone-ground in Kyoto",
      },
      {
        id: "tin",
        name: specMaterials[1] || "UV-Resistant Matte Tinplate",
        pantone: "PANTONE 19-4004 Black Onyx",
        hex: "#27272a",
        detail: "Food-grade double-sealed tin purged with liquid nitrogen for freshness",
      },
      {
        id: "bamboo",
        name: specMaterials[2] || "Artisanal Bamboo Chasen",
        pantone: "PANTONE 13-0922 Sunburst",
        hex: "#d4b996",
        detail: "Hand-carved single-piece golden bamboo whisk with 100 fine prongs",
      },
      {
        id: "paper",
        name: specMaterials[3] || "Wabi-Sabi Sand Packaging",
        pantone: "PANTONE 11-0602 Snow White",
        hex: "#f5f5f4",
        detail: "FSC-certified uncoated mulberry paper debossed with minimalist seal",
      },
    ];
  }

  if (cat.includes("living") || cat.includes("lighting") || brand.includes("snow peak") || brand.includes("flos")) {
    return [
      {
        id: "titanium",
        name: specMaterials[0] || "Grade 2 Aerospace Titanium",
        pantone: "PANTONE 17-5104 Ultimate Gray",
        hex: "#64748b",
        detail: "Hand-finished Japanese titanium with natural anodized patina",
      },
      {
        id: "glass",
        name: specMaterials[1] || "Borosilicate Fluted Glass",
        pantone: "PANTONE 12-5202 Whitecap Gray",
        hex: "#e2e8f0",
        detail: "Thermal shock-resistant blown diffuser scattering warm 2700K ambient light",
      },
      {
        id: "brass",
        name: specMaterials[2] || "Solid Brushed Brass Fixtures",
        pantone: "PANTONE 16-0953 Nugget Gold",
        hex: "#b45309",
        detail: "Machined architectural hardware unlacquered to age naturally over time",
      },
      {
        id: "canvas",
        name: specMaterials[3] || "Waxed Canvas Carry Roll",
        pantone: "PANTONE 19-0822 Olive Night",
        hex: "#365314",
        detail: "18oz heavy duck canvas infused with beeswax and paraffin",
      },
    ];
  }

  // Default: Apparel & Outerwear
  return [
    {
      id: "denim",
      name: specMaterials[0] || "14oz Okayama Indigo Denim",
      pantone: "PANTONE 19-4052 Classic Blue",
      hex: "#1e3a8a",
      detail: "Kuroki Mills, Okayama Japan • Pure vegetable indigo warp • GOTS Certified",
    },
    {
      id: "citron",
      name: specMaterials[1] || "Citron Selvedge Ticker",
      pantone: "PANTONE 13-0632 Endive",
      hex: "#eab308",
      detail: "Custom high-visibility shuttle selvedge ID line woven exclusively for this drop",
    },
    {
      id: "nickel",
      name: specMaterials[2] || "Matte Nickel Hardware",
      pantone: "PANTONE 18-0403 Dark Gull Gray",
      hex: "#52525b",
      detail: "Solid forged brass buttons with debossed architectural coordinates",
    },
    {
      id: "pocket",
      name: specMaterials[3] || "Organic Cotton Pocketing",
      pantone: "PANTONE 11-0601 Bright White",
      hex: "#f4f4f5",
      detail: "10oz herringbone pocket bags screenprinted with creator manifesto",
    },
  ];
}

export const LookbookModal: React.FC = () => {
  const { selectedDeal, setSelectedDeal, activeProfile, showToast } = useAppStore();
  const { updateStage } = useDeals();

  const swatches = getCategorySwatches(selectedDeal);
  const [activeSwatch, setActiveSwatch] = useState<Swatch>(swatches[0]);
  const [runUnits, setRunUnits] = useState<number>(500);
  const [retailPrice, setRetailPrice] = useState<number>(185);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (selectedDeal) {
      const dynamicSwatches = getCategorySwatches(selectedDeal);
      setActiveSwatch(dynamicSwatches[0]);
      setRunUnits(selectedDeal.spec?.run_units || selectedDeal.run_units || 500);
      setRetailPrice(selectedDeal.spec?.msrp_usd || selectedDeal.msrp || 185);
    }
  }, [selectedDeal]);

  if (!selectedDeal) return null;

  const brandName = selectedDeal.brand_name || selectedDeal.brand || "Partner Brand";
  const title = selectedDeal.title || selectedDeal.spec?.title || `${selectedDeal.category || "Limited"} Capsule Drop`;
  const description =
    selectedDeal.spec?.description ||
    "Co-architected with algorithmic precision. Crafted using premium materials and archival construction techniques, carrying cross-domain cultural resonances identified by Qloo Taste AI™.";

  const gmv = runUnits * retailPrice;
  const royaltyPct = selectedDeal.spec?.creator_royalty_pct || 0.18;
  const creatorRoyalty = Math.round(gmv * royaltyPct);

  const pitchSubject = `Collaboration Proposal: ${brandName} × ${activeProfile.name} (Qloo Taste Match)`;
  const pitchBody = selectedDeal.spec?.outreach_pitch || `Hi Partnerships Team,

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
                {description}
              </p>
            </div>

            {/* Dynamic Category-Aware CAD Blueprint & Interactive BOM */}
            <CadSchematicViewer deal={selectedDeal} />

            {/* Clickable Material & Pantone Swatches */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase text-inkMuted dark:text-darkMuted">
                <span>Interactive Material Swatches</span>
                <span className="text-terracotta">Click swatch to inspect BOM</span>
              </div>
              <div className="flex items-center space-x-2">
                {swatches.map((swatch) => (
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
                <span className="text-[10px] text-inkMuted dark:text-darkMuted">
                  {Math.round(royaltyPct * 100)}% Standard Royalty
                </span>
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
                    CREATOR ROYALTY ({Math.round(royaltyPct * 100)}%)
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
                <p className="whitespace-pre-wrap">{pitchBody}</p>
              </div>
            </div>

            {/* Webhook Dispatch Button */}
            <div className="pt-4 border-t border-editorial flex items-center justify-between">
              <span className="text-inkMuted dark:text-darkMuted text-[11px]">
                Destination: CRM Deal Desk &amp; Webhook
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
