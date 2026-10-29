"use client";

import React from "react";

interface RadialDialProps {
  affinity?: string; // e.g. "⚡ 7.8x" or "7.8x"
  overlapPct?: number; // e.g. 88
  percentage?: number; // alias
  strokeColor?: string; // e.g. "#ea580c" or "#4338ca"
  color?: string; // alias
  strokeWidth?: number;
  size?: number; // diameter in px
}

export function RadialDial({
  affinity,
  overlapPct,
  percentage,
  strokeColor,
  color,
  strokeWidth = 3,
  size = 32,
}: RadialDialProps) {
  const activePct = overlapPct ?? percentage ?? 85;
  const activeStroke = strokeColor ?? color ?? "#ea580c";
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (activePct / 100) * circumference;

  return (
    <div
      className="relative inline-flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="rotate-[-90deg]">
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-editorial dark:text-zinc-800"
        />
        {/* Progress Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={activeStroke}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {affinity && (
        <span className="absolute font-mono text-[9px] font-bold text-ink dark:text-darkInk">
          {affinity.replace("⚡", "").trim()}
        </span>
      )}
    </div>
  );
}
