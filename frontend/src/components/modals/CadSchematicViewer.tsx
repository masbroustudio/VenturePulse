"use client";

import React, { useState } from "react";
import { Layers, FileText, CheckCircle2 } from "lucide-react";

interface CadSchematicViewerProps {
  deal: any;
}

export const CadSchematicViewer: React.FC<CadSchematicViewerProps> = ({ deal }) => {
  const [viewMode, setViewMode] = useState<"blueprint" | "bom">("blueprint");

  const category = (deal?.category || "").toLowerCase();
  const brand = (deal?.brand_name || deal?.brand || "").toLowerCase();
  const title = (deal?.title || deal?.spec?.title || "").toLowerCase();
  const materials: string[] = deal?.spec?.materials || [];

  // Detect product domain
  const isWatch = category.includes("access") || title.includes("watch") || title.includes("chronograph") || brand.includes("seiko") || brand.includes("rolex");
  const isTech = category.includes("tech") || title.includes("synth") || title.includes("keyboard") || brand.includes("teenage") || brand.includes("keychron");
  const isBeverage = category.includes("bev") || title.includes("matcha") || title.includes("tea") || title.includes("drink") || brand.includes("matcha");
  const isLighting = category.includes("living") || title.includes("light") || title.includes("sconce") || title.includes("lamp") || brand.includes("flos") || brand.includes("snow peak");
  const isFootwear = category.includes("footwear") || title.includes("shoe") || title.includes("sneaker") || title.includes("runner") || brand.includes("salomon");

  // Dynamic schematic type label
  const schematicLabel = isWatch
    ? "HOROLOGY // CALIBRE & CASE ARCHITECTURE 1.0"
    : isTech
    ? "TECH // TACTILE HARDWARE & PCB EXPLODED CAD 1.0"
    : isBeverage
    ? "PACKAGING // NITROGEN HERMETIC BARRIER CAD 1.0"
    : isLighting
    ? "LUMINAIRE // OPTICAL BEAM & HOUSING CAD 1.0"
    : isFootwear
    ? "FOOTWEAR // MIDSOLE STACK & TREAD GEOMETRY CAD 1.0"
    : "GARMENT // TECHNICAL SELVEDGE PATTERN BLUEPRINT 1.0";

  // BOM items dynamically constructed from materials
  const bomItems = [
    {
      part: isWatch ? "Primary Case & Bezel" : isTech ? "Top Chassis Housing" : isBeverage ? "Hermetic Container" : isLighting ? "Reflector Housing" : isFootwear ? "Outsole Lug Grid" : "Primary Shell",
      spec: materials[0] || (isWatch ? "Grade 5 Titanium" : isTech ? "CNC 6061 Aluminum" : isBeverage ? "UV Matte Tinplate" : isLighting ? "Aerospace Titanium" : isFootwear ? "Contagrip Rubber" : "14oz Okayama Denim"),
      process: isWatch ? "5-Axis CNC & Zaratsu Polishing" : isTech ? "Precision Bead-Blasting" : isBeverage ? "Deep-Draw Nitrogen Purge" : isLighting ? "High-Pressure Hydroforming" : isFootwear ? "Dual-Density Vulcanization" : "Shuttle Loom Weaving",
      costShare: "38%",
      tolerance: isWatch ? "±0.02mm" : isTech ? "±0.05mm" : "±0.15mm",
    },
    {
      part: isWatch ? "Dial Crystal & Gasket" : isTech ? "Switch Stems & Contacts" : isBeverage ? "Internal Barrier Film" : isLighting ? "Optic Lens Element" : isFootwear ? "Cushion Midsole" : "Hardware & Fasteners",
      spec: materials[1] || (isWatch ? "Double-Curved Sapphire" : isTech ? "Cherry MX Tactile Stems" : isBeverage ? "Food-Grade Polymer Liner" : isLighting ? "Borosilicate Glass" : isFootwear ? "EVA Energy Cell" : "Matte Nickel Rivets"),
      process: isWatch ? "Anti-Reflective Coating" : isTech ? "Gold-Immersed Tracing" : isBeverage ? "Heat-Induction Bonding" : isLighting ? "Fluted Tooling" : isFootwear ? "Supercritical Foaming" : "Cold-Forged Stamping",
      costShare: "26%",
      tolerance: isWatch ? "±0.01mm" : isTech ? "70M Cycles" : "Hermetic",
    },
    {
      part: isWatch ? "Hands & Subdial Indices" : isTech ? "Display Micro-Panel" : isBeverage ? "Sealing Cap & Whisk" : isLighting ? "Mounting Flange" : isFootwear ? "Upper TPU Cage" : "Lining & Pockets",
      spec: materials[2] || (isWatch ? "Laser-Etched Indices" : isTech ? "Monochrome OLED" : isBeverage ? "Bamboo Chasen" : isLighting ? "Brushed Brass Bracket" : isFootwear ? "Ripstop Mesh" : "Organic Cotton"),
      process: isWatch ? "Photolithography" : isTech ? "COB Integration" : isBeverage ? "Hand-Carved" : isLighting ? "Wire EDM Machining" : isFootwear ? "Heat-Welded Film" : "Single-Needle Stitch",
      costShare: "21%",
      tolerance: "ISO 9001",
    },
    {
      part: isWatch ? "Crown & Stem Assembly" : isTech ? "Firmware Microcontroller" : isBeverage ? "Exterior Packaging" : isLighting ? "Thermal Heat Sink" : isFootwear ? "Lacing Harness" : "Ticker & Accents",
      spec: materials[3] || (isWatch ? "Knurled Titanium Crown" : isTech ? "ARM Cortex M4 SoC" : isBeverage ? "Mulberry Paper Seal" : isLighting ? "Extruded Fin Block" : isFootwear ? "Quicklace Cord" : "Citron Selvedge Line"),
      process: "Assembly & QC",
      costShare: "15%",
      tolerance: "Mil-Spec",
    },
  ];

  return (
    <div className="space-y-2">
      {/* Schematic Header Toolbar */}
      <div className="flex items-center justify-between text-[10px] font-mono border-b border-editorial pb-1.5">
        <span className="text-terracotta uppercase font-bold tracking-wider truncate max-w-[240px] sm:max-w-none">
          {schematicLabel}
        </span>
        <div className="flex items-center space-x-1 bg-surface dark:bg-darkSurface border border-editorial rounded p-0.5">
          <button
            onClick={() => setViewMode("blueprint")}
            className={`px-2 py-0.5 rounded transition flex items-center space-x-1 ${
              viewMode === "blueprint"
                ? "bg-paper dark:bg-darkSubtle text-terracotta font-bold shadow-sm"
                : "text-inkMuted dark:text-darkMuted hover:text-ink dark:hover:text-darkInk"
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>Blueprint</span>
          </button>
          <button
            onClick={() => setViewMode("bom")}
            className={`px-2 py-0.5 rounded transition flex items-center space-x-1 ${
              viewMode === "bom"
                ? "bg-paper dark:bg-darkSubtle text-terracotta font-bold shadow-sm"
                : "text-inkMuted dark:text-darkMuted hover:text-ink dark:hover:text-darkInk"
            }`}
          >
            <FileText className="w-3 h-3" />
            <span>BOM Spec</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      {viewMode === "blueprint" ? (
        <div className="w-full h-44 bg-surface dark:bg-darkSurface border border-editorial rounded p-2 flex items-center justify-center relative overflow-hidden font-mono text-xs">
          <svg className="w-full h-full stroke-ink dark:stroke-darkInk" viewBox="0 0 340 130" fill="none">
            <defs>
              <pattern id="cad-grid-pattern" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#e4e4e7" strokeWidth="0.5" className="dark:stroke-zinc-800" />
              </pattern>
            </defs>
            <rect width="340" height="130" fill="url(#cad-grid-pattern)" />

            {/* WATCH BLUEPRINT */}
            {isWatch && (
              <g transform="translate(20, 5)">
                {/* Watch Case Lug Outlines */}
                <path d="M 115 15 L 125 40 M 185 15 L 175 40 M 115 105 L 125 80 M 185 105 L 175 80" strokeWidth="1.5" stroke="#ea580c" />
                {/* Outer Bezel */}
                <circle cx="150" cy="60" r="45" strokeWidth="2" />
                {/* Inner Dial */}
                <circle cx="150" cy="60" r="38" strokeWidth="1" strokeDasharray="3,1" />
                {/* 12 Hour Ticks */}
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                  <line
                    key={deg}
                    x1="150"
                    y1="25"
                    x2="150"
                    y2="28"
                    strokeWidth="1.5"
                    transform={`rotate(${deg} 150 60)`}
                  />
                ))}
                {/* Subdials at 3 and 9 */}
                <circle cx="132" cy="60" r="10" strokeWidth="1" stroke="#ea580c" />
                <circle cx="168" cy="60" r="10" strokeWidth="1" stroke="#ea580c" />
                {/* Chrono Hands */}
                <line x1="150" y1="60" x2="140" y2="40" strokeWidth="1.5" />
                <line x1="150" y1="60" x2="165" y2="48" strokeWidth="1" stroke="#ea580c" />
                {/* Winding Crown at 3 */}
                <rect x="195" y="54" width="7" height="12" rx="1" strokeWidth="1.5" />
                {/* Dimension Callouts */}
                <text x="220" y="30" fontSize="7" fill="#ea580c" fontFamily="monospace">CASE: 39.5mm</text>
                <text x="220" y="42" fontSize="7" fill="#ea580c" fontFamily="monospace">SAPPHIRE: 2.2mm</text>
                <text x="20" y="30" fontSize="7" fill="#71717a" fontFamily="monospace">CALIBRE: AUTOMATIC</text>
                <text x="20" y="42" fontSize="7" fill="#71717a" fontFamily="monospace">TOLERANCE: ±0.02mm</text>
              </g>
            )}

            {/* TECH / SYNTHESIZER BLUEPRINT */}
            {isTech && (
              <g transform="translate(15, 8)">
                {/* Chassis Border */}
                <rect x="50" y="15" width="210" height="90" rx="4" strokeWidth="2" />
                {/* Recessed OLED Screen */}
                <rect x="65" y="25" width="60" height="24" rx="2" strokeWidth="1.5" stroke="#ea580c" />
                <text x="70" y="40" fontSize="6" fill="#ea580c" fontFamily="monospace">OLED 128×64</text>
                {/* Rotary Encoders */}
                <circle cx="150" cy="37" r="10" strokeWidth="1.5" />
                <circle cx="180" cy="37" r="10" strokeWidth="1.5" />
                <circle cx="210" cy="37" r="10" strokeWidth="1.5" />
                {/* 8-Key Matrix Stems */}
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <g key={i} transform={`translate(${65 + i * 23}, 65)`}>
                    <rect x="0" y="0" width="16" height="25" rx="2" strokeWidth="1" />
                    <line x1="8" y1="4" x2="8" y2="21" strokeWidth="0.75" stroke="#ea580c" />
                    <line x1="4" y1="12" x2="12" y2="12" strokeWidth="0.75" stroke="#ea580c" />
                  </g>
                ))}
                {/* Dimensions */}
                <text x="270" y="25" fontSize="7" fill="#ea580c" fontFamily="monospace">CNC 6061-T6</text>
                <text x="270" y="37" fontSize="7" fill="#ea580c" fontFamily="monospace">120×80×14mm</text>
                <text x="270" y="49" fontSize="7" fill="#71717a" fontFamily="monospace">TRAVEL: 1.8mm</text>
              </g>
            )}

            {/* BEVERAGE PACKAGING BLUEPRINT */}
            {isBeverage && (
              <g transform="translate(25, 8)">
                {/* Cylindrical Profile */}
                <rect x="110" y="18" width="80" height="85" rx="3" strokeWidth="2" />
                {/* Top Rim & Seal */}
                <ellipse cx="150" cy="18" rx="40" ry="7" strokeWidth="1.5" stroke="#ea580c" />
                {/* Nitrogen Barrier Layer Lines */}
                <line x1="116" y1="25" x2="116" y2="98" strokeWidth="1" strokeDasharray="2,2" stroke="#ea580c" />
                <line x1="184" y1="25" x2="184" y2="98" strokeWidth="1" strokeDasharray="2,2" stroke="#ea580c" />
                {/* Bottom Base */}
                <ellipse cx="150" cy="103" rx="40" ry="7" strokeWidth="1.5" />
                {/* Label Emboss Box */}
                <rect x="125" y="45" width="50" height="35" strokeWidth="1" stroke="#ea580c" strokeDasharray="3,1" />
                <text x="135" y="65" fontSize="6" fill="#ea580c" fontFamily="monospace">MATTE TIN</text>
                {/* Dimension Callouts */}
                <text x="210" y="35" fontSize="7" fill="#ea580c" fontFamily="monospace">DIAMETER: 66mm</text>
                <text x="210" y="47" fontSize="7" fill="#ea580c" fontFamily="monospace">HEIGHT: 122mm</text>
                <text x="210" y="59" fontSize="7" fill="#71717a" fontFamily="monospace">VOL: 250ml N2</text>
                <text x="20" y="35" fontSize="7" fill="#71717a" fontFamily="monospace">BARRIER: 0.22mm</text>
              </g>
            )}

            {/* LIGHTING / LIVING BLUEPRINT */}
            {isLighting && (
              <g transform="translate(25, 8)">
                {/* Wall Mounting Base */}
                <rect x="80" y="20" width="16" height="80" rx="2" strokeWidth="1.5" />
                {/* Arm Extension */}
                <path d="M 96 60 L 145 60 L 165 35" strokeWidth="2" />
                {/* Cone Luminaire Shade */}
                <path d="M 155 25 L 210 10 L 225 65 L 170 50 Z" strokeWidth="2" stroke="#ea580c" />
                {/* Ray Trace Beam Lines */}
                <line x1="210" y1="10" x2="280" y2="5" strokeWidth="0.75" strokeDasharray="4,2" stroke="#ea580c" />
                <line x1="225" y1="65" x2="295" y2="85" strokeWidth="0.75" strokeDasharray="4,2" stroke="#ea580c" />
                {/* Dimension Callouts */}
                <text x="15" y="35" fontSize="7" fill="#ea580c" fontFamily="monospace">FLANGE: 95mm</text>
                <text x="15" y="47" fontSize="7" fill="#ea580c" fontFamily="monospace">REACH: 185mm</text>
                <text x="235" y="105" fontSize="7" fill="#71717a" fontFamily="monospace">BEAM: 45° SPOT</text>
                <text x="235" y="115" fontSize="7" fill="#71717a" fontFamily="monospace">CRI: &gt;98 (WARM)</text>
              </g>
            )}

            {/* FOOTWEAR BLUEPRINT */}
            {isFootwear && (
              <g transform="translate(20, 8)">
                {/* Upper Silhouette */}
                <path d="M 50 85 C 70 85 90 45 130 35 C 160 30 190 35 220 55 C 245 70 260 85 270 85" strokeWidth="1.75" />
                {/* Midsole Layer */}
                <path d="M 45 85 L 275 85 L 270 98 L 40 98 Z" strokeWidth="1.5" stroke="#ea580c" />
                {/* Outsole Chevron Lugs */}
                {[55, 75, 95, 115, 135, 155, 175, 195, 215, 235, 255].map((x) => (
                  <path key={x} d={`M ${x} 98 L ${x + 6} 105 L ${x + 12} 98`} strokeWidth="1.25" stroke="#ea580c" />
                ))}
                {/* TPU Chevron Cage */}
                <path d="M 140 38 L 160 80 M 175 35 L 195 80 M 205 45 L 220 80" strokeWidth="1" strokeDasharray="2,2" />
                {/* Dimension Callouts */}
                <text x="20" y="25" fontSize="7" fill="#ea580c" fontFamily="monospace">DROP: 8.0mm</text>
                <text x="20" y="37" fontSize="7" fill="#ea580c" fontFamily="monospace">STACK: 28/20mm</text>
                <text x="20" y="49" fontSize="7" fill="#71717a" fontFamily="monospace">LUG: 5.0mm CHEVRON</text>
              </g>
            )}

            {/* APPAREL / CHORE COAT BLUEPRINT (DEFAULT) */}
            {!isWatch && !isTech && !isBeverage && !isLighting && !isFootwear && (
              <g transform="translate(25, 5)">
                {/* Garment Left Panel */}
                <path d="M 60 25 L 110 15 L 150 25 L 150 95 L 60 95 Z" strokeWidth="1.75" />
                {/* Garment Right Panel */}
                <path d="M 150 25 L 190 15 L 240 25 L 240 95 L 150 95 Z" strokeWidth="1.75" />
                {/* Center Placket Seam */}
                <line x1="150" y1="15" x2="150" y2="100" strokeWidth="1" strokeDasharray="3,2" stroke="#ea580c" />
                {/* Collar */}
                <path d="M 110 15 L 150 30 L 190 15" strokeWidth="1.5" stroke="#ea580c" />
                {/* Dual Chest Pockets */}
                <rect x="78" y="50" width="24" height="28" rx="1" strokeWidth="1" stroke="#ea580c" />
                <rect x="198" y="50" width="24" height="28" rx="1" strokeWidth="1" stroke="#ea580c" />
                {/* Rivet Buttons */}
                <circle cx="150" cy="40" r="2.5" strokeWidth="1" />
                <circle cx="150" cy="58" r="2.5" strokeWidth="1" />
                <circle cx="150" cy="76" r="2.5" strokeWidth="1" />
                {/* Dimension Callouts */}
                <text x="70" y="112" fontSize="7" fill="#ea580c" fontFamily="monospace">CHEST: 580mm</text>
                <text x="180" y="112" fontSize="7" fill="#ea580c" fontFamily="monospace">TOLERANCE: ±0.5mm</text>
              </g>
            )}
          </svg>
        </div>
      ) : (
        /* Bill of Materials (BOM) Table View */
        <div className="w-full h-44 bg-surface dark:bg-darkSurface border border-editorial rounded p-3 overflow-y-auto font-mono text-xs">
          <table className="w-full text-left text-[11px]">
            <thead className="border-b border-editorial text-[9px] uppercase text-inkMuted dark:text-darkMuted">
              <tr>
                <th className="pb-1">Component</th>
                <th className="pb-1">Material Spec</th>
                <th className="pb-1">Process</th>
                <th className="pb-1 text-right">Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-editorial">
              {bomItems.map((item, idx) => (
                <tr key={idx} className="hover:bg-subtle dark:hover:bg-darkSubtle transition">
                  <td className="py-1 font-bold text-ink dark:text-darkInk flex items-center space-x-1">
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald" />
                    <span>{item.part}</span>
                  </td>
                  <td className="py-1 text-inkMuted dark:text-darkMuted truncate max-w-[120px]">{item.spec}</td>
                  <td className="py-1 text-[10px] text-inkMuted dark:text-darkMuted">{item.process}</td>
                  <td className="py-1 text-right font-bold text-terracotta">{item.costShare}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
