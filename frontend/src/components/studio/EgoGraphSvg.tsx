"use client";

import React, { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { useDeals } from "@/hooks/useDeals";
import { EgoBrandNode, EgoTagNode } from "@/types/qloo";
import { Plus, Minus, RotateCcw } from "lucide-react";

export const EgoGraphSvg: React.FC = () => {
  const { activeProfile, mode, showToast } = useAppStore();
  const { createDeal, isCreating } = useDeals();
  const graph = activeProfile.graph;

  const [hoveredBrandId, setHoveredBrandId] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<EgoBrandNode | null>(() => graph.brands[0] || null);
  const [selectedDetail, setSelectedDetail] = useState<{
    name: string;
    metric: string;
    path: string;
    guardrail: string;
  }>(() => ({
    name: graph.brands[0]?.name || activeProfile.name,
    metric: graph.brands[0] ? `⚡ ${graph.brands[0].affinity} Affinity (Empirical Qloo Match)` : "Selected Center",
    path: graph.brands[0]?.path || `urn:entity:${mode}:${activeProfile.id}`,
    guardrail: graph.brands[0]?.guardrail || "Anti-Affinity guardrails active across 250M+ entities.",
  }));

  // Sync selectedBrand when active profile changes
  useEffect(() => {
    const firstBrand = graph.brands[0] || null;
    setSelectedBrand(firstBrand);
    setSelectedDetail({
      name: firstBrand?.name || activeProfile.name,
      metric: firstBrand ? `⚡ ${firstBrand.affinity} Affinity (Empirical Qloo Match)` : "Selected Center",
      path: firstBrand?.path || `urn:entity:${mode}:${activeProfile.id}`,
      guardrail: firstBrand?.guardrail || "Anti-Affinity guardrails active across 250M+ entities.",
    });
  }, [activeProfile.id, graph, mode]);

  const centerX = 300;
  const centerY = 230;

  // Zoom and Pan State
  const [zoom, setZoom] = useState<number>(1.0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoom((prev) => Math.min(2.5, +(prev + 0.15).toFixed(2)));
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoom((prev) => Math.max(0.6, +(prev - 0.15).toFixed(2)));
  };

  const handleResetZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
    showToast("Reset Ego Graph View (100%)");
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setZoom((prev) => Math.min(2.5, +(prev + 0.1).toFixed(2)));
    } else {
      setZoom((prev) => Math.max(0.6, +(prev - 0.1).toFixed(2)));
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag on canvas background
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const activeHoveredBrand = graph.brands.find((b) => b.id === hoveredBrandId);
  const activeHoveredTag = activeHoveredBrand
    ? graph.tags.find((t) => t.id === activeHoveredBrand.tagId)
    : null;

  const handleBrandHover = (brand: EgoBrandNode) => {
    setHoveredBrandId(brand.id);
    setSelectedBrand(brand);
    setSelectedDetail({
      name: brand.name,
      metric: `⚡ ${brand.affinity || "7.8x"} Affinity (Empirical Qloo Match)`,
      path: brand.path || "Latent multi-hop bridge",
      guardrail: brand.guardrail || "None",
    });
  };

  const handleBrandLeave = () => {
    setHoveredBrandId(null);
  };

  const handleInspectCenter = () => {
    setSelectedBrand(null);
    setSelectedDetail({
      name: activeProfile.name,
      metric: `Role: ${graph.center.sub} • Category: ${activeProfile.category}`,
      path: `Central Ego Node: urn:entity:${mode}:${activeProfile.id}`,
      guardrail: "Verified 100T+ taste signals active across Qloo Taste Graph.",
    });
    showToast(`Selected Ego Center: ${activeProfile.name}`);
  };

  const handleInspectTag = (tag: EgoTagNode) => {
    setSelectedBrand(null);
    setSelectedDetail({
      name: `Latent Tag: ${tag.name}`,
      metric: `Confidence Weight: ${(tag.weight ?? 0.9).toFixed(2)}w (Latent Vector)`,
      path: "Resolved via /v2/tags & /v2/search URN taxonomy",
      guardrail: `Latent bridge connecting ${activeProfile.name} to target entities.`,
    });
    showToast(`Inspecting Latent Tag: ${tag.name}`);
  };

  const handleInspectBrand = (brand: EgoBrandNode) => {
    setSelectedBrand(brand);
    setSelectedDetail({
      name: brand.name,
      metric: `⚡ ${brand.affinity || "7.8x"} Affinity (Empirical Qloo Match)`,
      path: brand.path || "Latent multi-hop bridge",
      guardrail: brand.guardrail || "None",
    });
    showToast(`Inspecting Brand Partner: ${brand.name}`);
  };

  const handleAddToDealDesk = (brand: EgoBrandNode) => {
    const rawAffinity = brand.affinity || "7.5x";
    const affinityNum = parseFloat(rawAffinity.replace("x", "").trim()) || 7.5;
    const estUnits = Math.round(affinityNum * 120);
    const estMsrp = 185;
    const estGmv = estUnits * estMsrp;

    createDeal({
      card_id: `deal_ego_${brand.id}_${Date.now().toString(36)}`,
      brand_name: brand.name,
      title: `${brand.name} Limited Drop`,
      category: activeProfile.category || "apparel",
      affinity_multiplier: rawAffinity.includes("x") ? rawAffinity : `${rawAffinity}x`,
      synergy_score: Math.min(0.98, +(0.85 + affinityNum / 100).toFixed(2)),
      stage: "Discovered",
      msrp: estMsrp,
      run_units: estUnits,
      gmv: estGmv,
      spec: {
        title: `${brand.name} Limited Drop`,
        brand_partner: brand.name,
        category: activeProfile.category || "apparel",
        affinity_multiplier: rawAffinity.includes("x") ? rawAffinity : `${rawAffinity}x`,
        description: `Discovered via Qloo Concentric Multi-Hop Ego Graph. Empirical match anchored on taste tags and guardrails: ${brand.guardrail || "Verified signals"}.`,
        materials: ["Archival Technical Twill", "Debossed Custom Hardware", "Vegetable-Tanned Accents"],
        colorways: ["Obsidian Black", "Bone White"],
        msrp_usd: estMsrp,
        run_units: estUnits,
        projected_gmv: estGmv,
        creator_royalty_pct: 0.18,
        projected_royalty: Math.round(estGmv * 0.18),
        outreach_pitch: `According to Qloo's cultural intelligence graph (250M+ entities), our audience exhibits an extraordinary ${rawAffinity} statistical affinity for ${brand.name}. We've pre-architected a high-margin capsule collection.`,
      },
    });
  };

  const centerFill = mode === "creator" ? "#09090b" : "#4338ca";

  return (
    <div className="lg:col-span-7 bg-surface dark:bg-darkSurface p-6 space-y-4 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-editorial">
      <div>
        <div className="flex items-center justify-between border-b border-editorial pb-3">
          <div>
            <span className="text-[10px] font-mono uppercase text-inkMuted dark:text-darkMuted tracking-wider font-semibold">
              FIG 1.2 // CROSS-DOMAIN TOPOLOGY
            </span>
            <h3 className="font-serif italic text-2xl text-ink dark:text-darkInk mt-0.5">
              Force-Directed Multi-Hop Ego Graph
            </h3>
          </div>
          <div className="text-right text-[11px] font-mono text-inkMuted dark:text-darkMuted">
            Gateway: <code className="text-terracotta font-bold">hackathon.api.qloo.com</code>
          </div>
        </div>

        <p className="text-xs text-inkMuted dark:text-darkMuted font-sans leading-relaxed mt-2">
          <strong>3-Ring Concentric Ego Graph:</strong> Inner ring represents the central entity; middle ring displays resolved seed anchors &amp; taste tags; outer ring displays high-affinity targets. Hover over any outer node to trace the latent path and dim unrelated connections.
        </p>
      </div>

      {/* SVG Canvas Container with Zoom & Pan */}
      <div
        className={`w-full h-[420px] sm:h-[460px] bg-paper dark:bg-darkSubtle rounded border border-editorial relative overflow-hidden flex items-center justify-center select-none ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Floating Glass Navigation Dock (Top-Right) */}
        <div
          className="absolute top-3 right-3 z-10 flex items-center space-x-1 bg-surface/90 dark:bg-darkSurface/90 backdrop-blur border border-editorial rounded-md p-1 shadow-sm font-mono text-xs select-none"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleZoomIn}
            className="w-6 h-6 rounded flex items-center justify-center hover:bg-subtle dark:hover:bg-darkSubtle text-ink dark:text-darkInk hover:text-terracotta transition"
            title="Zoom In (+)"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleZoomOut}
            className="w-6 h-6 rounded flex items-center justify-center hover:bg-subtle dark:hover:bg-darkSubtle text-ink dark:text-darkInk hover:text-terracotta transition"
            title="Zoom Out (-)"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="px-2 py-0.5 text-[10px] text-inkMuted dark:text-darkMuted font-bold border-l border-r border-editorial select-none min-w-[42px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleResetZoom}
            className="w-6 h-6 rounded flex items-center justify-center hover:bg-subtle dark:hover:bg-darkSubtle text-ink dark:text-darkInk hover:text-terracotta transition"
            title="Reset View (100%)"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>

        <svg
          className="w-full h-full select-none"
          viewBox="0 0 600 460"
        >
          {/* Zoom and Pan Transformed Group */}
          <g
            transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}
            style={{ transformOrigin: "300px 230px", transition: isDragging ? "none" : "transform 0.15s ease-out" }}
          >
          {/* Concentric Guide Rings */}
          <circle
            cx={centerX}
            cy={centerY}
            r="110"
            fill="none"
            stroke="#e4e4e7"
            className="dark:stroke-zinc-800"
            strokeDasharray="2,2"
          />
          <circle
            cx={centerX}
            cy={centerY}
            r="200"
            fill="none"
            stroke="#e4e4e7"
            className="dark:stroke-zinc-800"
            strokeDasharray="2,2"
          />

          {/* Edge Group */}
          <g>
            {/* Center to Tag Edges */}
            {graph.tags.map((t) => {
              const isHighlighted = activeHoveredTag?.id === t.id;
              const isDimmed = hoveredBrandId !== null && !isHighlighted;
              const strokeWidth = (t.weight || 0.9) * 2.2;
              const strokeColor = isHighlighted
                ? activeHoveredBrand?.stroke || "#ea580c"
                : "#d4d4d8";

              return (
                <line
                  key={`center-${t.id}`}
                  x1={centerX}
                  y1={centerY}
                  x2={t.x}
                  y2={t.y}
                  stroke={strokeColor}
                  className={`transition-opacity duration-200 ${
                    isDimmed ? "opacity-15" : "opacity-100"
                  }`}
                  strokeWidth={isHighlighted ? 3 : strokeWidth}
                />
              );
            })}

            {/* Tag to Brand Edges */}
            {graph.brands.map((b) => {
              const tag = graph.tags.find((t) => t.id === b.tagId) || graph.tags[0];
              const isHighlighted = hoveredBrandId === b.id;
              const isDimmed = hoveredBrandId !== null && !isHighlighted;

              return (
                <line
                  key={`brand-edge-${b.id}`}
                  x1={tag.x}
                  y1={tag.y}
                  x2={b.x + 45}
                  y2={b.y + 20}
                  stroke={b.stroke}
                  strokeWidth={isHighlighted ? 4 : 2.5}
                  className={`transition-opacity duration-200 ${
                    isDimmed ? "opacity-15" : "opacity-100"
                  }`}
                />
              );
            })}
          </g>

          {/* Middle Ring Tag Nodes */}
          {graph.tags.map((t) => {
            const isHighlighted = activeHoveredTag?.id === t.id;
            const isDimmed = hoveredBrandId !== null && !isHighlighted;

            return (
              <g
                key={`tag-node-${t.id}`}
                className={`cursor-pointer transition-opacity duration-200 ${
                  isDimmed ? "opacity-20" : "opacity-100"
                }`}
                onClick={() => handleInspectTag(t)}
              >
                <circle
                  cx={t.x}
                  cy={t.y}
                  r="22"
                  fill="#ffffff"
                  className="dark:fill-zinc-900"
                  stroke={t.stroke}
                  strokeWidth={isHighlighted ? 3 : 2}
                />
                <text
                  x={t.x}
                  y={t.y + 4}
                  textAnchor="middle"
                  fontFamily="'JetBrains Mono'"
                  fontSize="8"
                  fontWeight="bold"
                  fill="#09090b"
                  className="dark:fill-white select-none pointer-events-none"
                >
                  {t.name.slice(0, 9)}
                </text>
              </g>
            );
          })}

          {/* Outer Ring Brand Nodes */}
          {graph.brands.map((b) => {
            const isHighlighted = hoveredBrandId === b.id;
            const isDimmed = hoveredBrandId !== null && !isHighlighted;

            return (
              <g
                key={`brand-node-${b.id}`}
                className={`cursor-pointer transition-opacity duration-200 ${
                  isDimmed ? "opacity-20" : "opacity-100"
                }`}
                onMouseEnter={() => handleBrandHover(b)}
                onMouseLeave={handleBrandLeave}
                onClick={() => handleInspectBrand(b)}
              >
                <rect
                  x={b.x}
                  y={b.y}
                  width="90"
                  height="40"
                  rx="4"
                  fill="#ffffff"
                  className="dark:fill-zinc-900"
                  stroke={b.stroke}
                  strokeWidth={isHighlighted ? 2.5 : 1.5}
                />
                <text
                  x={b.x + 45}
                  y={b.y + 17}
                  textAnchor="middle"
                  fontFamily="'Inter'"
                  fontWeight="bold"
                  fontSize="9"
                  fill="#09090b"
                  className="dark:fill-white select-none pointer-events-none"
                >
                  {b.name.slice(0, 12)}
                </text>
                <text
                  x={b.x + 45}
                  y={b.y + 31}
                  textAnchor="middle"
                  fontFamily="'JetBrains Mono'"
                  fontSize="9"
                  fill={b.stroke}
                  fontWeight="bold"
                  className="select-none pointer-events-none"
                >
                  {b.affinity}
                </text>
              </g>
            );
          })}

          {/* Center Node */}
          <g className="cursor-pointer" onClick={handleInspectCenter}>
            <circle
              cx={centerX}
              cy={centerY}
              r="36"
              fill={centerFill}
              className="dark:fill-white transition-colors duration-300"
            />
            <text
              x={centerX}
              y={centerY - 2}
              textAnchor="middle"
              fontFamily="'Instrument Serif'"
              fontStyle="italic"
              fontSize="13"
              fill="#ffffff"
              className="dark:fill-black font-bold select-none pointer-events-none"
            >
              {graph.center.name.slice(0, 13)}
            </text>
            <text
              x={centerX}
              y={centerY + 12}
              textAnchor="middle"
              fontFamily="'JetBrains Mono'"
              fontSize="8"
              fill={mode === "creator" ? "#ea580c" : "#60a5fa"}
              className="select-none pointer-events-none"
            >
              {graph.center.sub}
            </text>
          </g>
          </g>
        </svg>

        {/* Bottom Floating Node Details Badge */}
        <div className="absolute bottom-3 left-3 right-3 bg-surface/95 dark:bg-darkSurface/95 border border-editorial p-3 rounded text-xs font-mono space-y-2 shadow-md backdrop-blur-sm">
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2 truncate">
              <span className="text-inkMuted dark:text-darkMuted">
                Target Node: <strong className="text-ink dark:text-darkInk">{selectedDetail.name}</strong>
              </span>
              <span className="text-terracotta font-bold">
                {selectedDetail.metric}
              </span>
            </div>
            {selectedBrand && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToDealDesk(selectedBrand);
                }}
                disabled={isCreating}
                className="shrink-0 flex items-center space-x-1.5 px-3 py-1 bg-ink dark:bg-white text-surface dark:text-ink hover:bg-terracotta dark:hover:bg-terracotta dark:hover:text-white transition font-mono text-[10px] font-bold uppercase tracking-wider rounded shadow-sm disabled:opacity-50"
                title="Send target partner directly to Deal Desk Kanban"
              >
                <Plus className="w-3 h-3" />
                <span>{isCreating ? "Adding..." : "+ Add to Deal Desk"}</span>
              </button>
            )}
          </div>
          <div className="text-[11px] text-inkMuted dark:text-darkMuted truncate">
            Active Multi-Hop Path: <span className="text-ink dark:text-darkInk font-semibold">{selectedDetail.path}</span>
          </div>
          <div className="text-[10px] text-red-600 dark:text-red-400 truncate">
            Anti-Affinity Guardrail: {selectedDetail.guardrail}
          </div>
        </div>
      </div>

      {/* Graph Topology Legend */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-inkMuted dark:text-darkMuted pt-2 border-t border-editorial">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-ink dark:bg-white inline-block"></span>
            <span>Inner: Ego Center</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full border border-terracotta inline-block"></span>
            <span>Mid: Latent Taste Tags</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded bg-terracotta inline-block"></span>
            <span>Outer: Target Partners</span>
          </span>
        </div>
        <span className="text-terracotta font-semibold">Hover outer node to trace path</span>
      </div>
    </div>
  );
};
