"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store";
import { EgoBrandNode, EgoTagNode } from "@/types/qloo";

export const EgoGraphSvg: React.FC = () => {
  const { activeProfile, mode, showToast } = useAppStore();
  const graph = activeProfile.graph;

  const [hoveredBrandId, setHoveredBrandId] = useState<string | null>(null);
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

  const centerX = 300;
  const centerY = 230;

  const activeHoveredBrand = graph.brands.find((b) => b.id === hoveredBrandId);
  const activeHoveredTag = activeHoveredBrand
    ? graph.tags.find((t) => t.id === activeHoveredBrand.tagId)
    : null;

  const handleBrandHover = (brand: EgoBrandNode) => {
    setHoveredBrandId(brand.id);
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
    setSelectedDetail({
      name: activeProfile.name,
      metric: `Role: ${graph.center.sub} • Category: ${activeProfile.category}`,
      path: `Central Ego Node: urn:entity:${mode}:${activeProfile.id}`,
      guardrail: "Verified 100T+ taste signals active across Qloo Taste Graph.",
    });
    showToast(`Selected Ego Center: ${activeProfile.name}`);
  };

  const handleInspectTag = (tag: EgoTagNode) => {
    setSelectedDetail({
      name: `Latent Tag: ${tag.name}`,
      metric: `Confidence Weight: ${(tag.weight ?? 0.9).toFixed(2)}w (Latent Vector)`,
      path: "Resolved via /v2/tags & /v2/search URN taxonomy",
      guardrail: `Latent bridge connecting ${activeProfile.name} to target entities.`,
    });
    showToast(`Inspecting Latent Tag: ${tag.name}`);
  };

  const handleInspectBrand = (brand: EgoBrandNode) => {
    setSelectedDetail({
      name: brand.name,
      metric: `⚡ ${brand.affinity || "7.8x"} Affinity (Empirical Qloo Match)`,
      path: brand.path || "Latent multi-hop bridge",
      guardrail: brand.guardrail || "None",
    });
    showToast(`Inspecting Brand Partner: ${brand.name}`);
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

      {/* SVG Canvas Container */}
      <div className="w-full h-[420px] sm:h-[460px] bg-paper dark:bg-darkSubtle rounded border border-editorial relative overflow-hidden flex items-center justify-center">
        <svg
          className="w-full h-full select-none"
          viewBox="0 0 600 460"
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
        </svg>

        {/* Bottom Floating Node Details Badge */}
        <div className="absolute bottom-3 left-3 right-3 bg-surface/95 dark:bg-darkSurface/95 border border-editorial p-3 rounded text-xs font-mono space-y-1.5 shadow-md backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-inkMuted dark:text-darkMuted">
              Target Node: <strong className="text-ink dark:text-darkInk">{selectedDetail.name}</strong>
            </span>
            <span className="text-terracotta font-bold">
              {selectedDetail.metric}
            </span>
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
