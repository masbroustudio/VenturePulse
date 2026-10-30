"use client";

import React from "react";

interface MarkdownContentProps {
  content: string;
  isStreaming?: boolean;
}

export const MarkdownContent: React.FC<MarkdownContentProps> = ({ content, isStreaming }) => {
  // Helper to parse inline markdown (bold, italic, inline code)
  const renderInline = (text: string) => {
    // Regex splits into tokens: **bold**, `code`, *italic*
    const tokens: React.ReactNode[] = [];
    let remaining = text;
    let keyIdx = 0;

    while (remaining.length > 0) {
      // Check for inline code `...`
      const codeMatch = remaining.match(/^(.*?)`([^`]+)`(.*)$/s);
      // Check for bold **...**
      const boldMatch = remaining.match(/^(.*?)\*\*([^*]+)\*\*(.*)$/s);
      // Check for italic *...*
      const italicMatch = remaining.match(/^(.*?)\*([^*]+)\*(.*)$/s);

      // Find the earliest match
      let firstMatch: { type: "code" | "bold" | "italic"; match: RegExpMatchArray; index: number } | null = null;

      if (codeMatch && codeMatch.index !== undefined) {
        firstMatch = { type: "code", match: codeMatch, index: codeMatch[1].length };
      }
      if (boldMatch && boldMatch.index !== undefined) {
        if (!firstMatch || boldMatch[1].length < firstMatch.index) {
          firstMatch = { type: "bold", match: boldMatch, index: boldMatch[1].length };
        }
      }
      if (italicMatch && italicMatch.index !== undefined) {
        if (!firstMatch || italicMatch[1].length < firstMatch.index) {
          firstMatch = { type: "italic", match: italicMatch, index: italicMatch[1].length };
        }
      }

      if (!firstMatch) {
        tokens.push(<span key={keyIdx++}>{remaining}</span>);
        break;
      }

      const { type, match } = firstMatch;
      const before = match[1];
      const inner = match[2];
      const after = match[3];

      if (before) {
        tokens.push(<span key={keyIdx++}>{before}</span>);
      }

      if (type === "bold") {
        tokens.push(
          <strong key={keyIdx++} className="font-bold text-ink dark:text-darkInk">
            {inner}
          </strong>
        );
      } else if (type === "code") {
        tokens.push(
          <code
            key={keyIdx++}
            className="font-mono bg-paper dark:bg-darkSubtle border border-editorial px-1.5 py-0.5 rounded text-terracotta text-[11px]"
          >
            {inner}
          </code>
        );
      } else if (type === "italic") {
        tokens.push(
          <em key={keyIdx++} className="italic text-ink dark:text-darkInk">
            {inner}
          </em>
        );
      }

      remaining = after;
    }

    return tokens;
  };

  // Split lines into blocks (headings, lists, paragraphs)
  const lines = content.split("\n");
  const blocks: React.ReactNode[] = [];
  let currentListItems: string[] = [];

  const flushList = () => {
    if (currentListItems.length > 0) {
      blocks.push(
        <ul key={`ul_${blocks.length}`} className="space-y-1.5 my-2 pl-2">
          {currentListItems.map((item, idx) => (
            <li key={idx} className="flex items-start space-x-2 text-xs">
              <span className="text-terracotta font-bold select-none">•</span>
              <span className="flex-1">{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      );
      currentListItems = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Empty line separates paragraphs / lists
    if (!trimmed) {
      flushList();
      return;
    }

    // Bullet List Item (- or * or •)
    if (/^[-*•]\s+/.test(trimmed)) {
      const itemText = trimmed.replace(/^[-*•]\s+/, "");
      currentListItems.push(itemText);
      return;
    }

    // Numbered List Item (1. 2.)
    if (/^\d+\.\s+/.test(trimmed)) {
      flushList();
      const itemText = trimmed.replace(/^\d+\.\s+/, "");
      blocks.push(
        <div key={`ol_${index}`} className="flex items-start space-x-2 my-1 pl-1">
          <span className="text-inkMuted dark:text-darkMuted font-mono text-[11px] font-bold">
            {trimmed.match(/^\d+\./)?.[0]}
          </span>
          <span className="flex-1">{renderInline(itemText)}</span>
        </div>
      );
      return;
    }

    // Flush any pending list before non-list elements
    flushList();

    // Headings (###, ##, #)
    if (trimmed.startsWith("### ")) {
      blocks.push(
        <h4 key={`h3_${index}`} className="font-serif italic text-sm font-bold text-ink dark:text-darkInk mt-3 mb-1">
          {renderInline(trimmed.replace("### ", ""))}
        </h4>
      );
    } else if (trimmed.startsWith("## ")) {
      blocks.push(
        <h3 key={`h2_${index}`} className="font-serif italic text-base font-bold text-ink dark:text-darkInk mt-3 mb-1.5 border-b border-editorial pb-1">
          {renderInline(trimmed.replace("## ", ""))}
        </h3>
      );
    } else if (trimmed.startsWith("# ")) {
      blocks.push(
        <h2 key={`h1_${index}`} className="font-serif italic text-lg font-bold text-ink dark:text-darkInk mt-3 mb-2">
          {renderInline(trimmed.replace("# ", ""))}
        </h2>
      );
    } else {
      // Standard Paragraph
      blocks.push(
        <p key={`p_${index}`} className="my-1.5 leading-relaxed">
          {renderInline(trimmed)}
        </p>
      );
    }
  });

  flushList();

  return (
    <div className="space-y-1 text-xs font-sans text-ink dark:text-darkInk">
      {blocks}
      {isStreaming && <span className="inline-block w-1.5 h-3 ml-1 bg-terracotta animate-pulse align-middle"></span>}
    </div>
  );
};
