"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, RefreshCw, Download, ZoomIn, Info, Check, Copy, Camera, X } from "lucide-react";
import { useAppStore } from "@/lib/store";

interface AiVisualProofViewerProps {
  deal: any;
  onImageGenerated?: (imageUrl: string) => void;
}

export const AiVisualProofViewer: React.FC<AiVisualProofViewerProps> = ({
  deal,
  onImageGenerated,
}) => {
  const { activeProfile, showToast } = useAppStore();

  const [imageUrl, setImageUrl] = useState<string | null>(
    () => deal?.spec?.generated_image_url || null
  );
  const [prompt, setPrompt] = useState<string | null>(
    () => deal?.spec?.generated_image_prompt || null
  );
  const [source, setSource] = useState<string | null>(
    () => deal?.spec?.generated_image_source || null
  );
  const [notice, setNotice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPromptDetails, setShowPromptDetails] = useState<boolean>(false);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);

  // Sync state when deal prop updates
  useEffect(() => {
    setImageUrl(deal?.spec?.generated_image_url || null);
    setPrompt(deal?.spec?.generated_image_prompt || null);
    setSource(deal?.spec?.generated_image_source || null);
    setNotice(null);
  }, [deal]);

  const brandName = deal?.brand_name || deal?.brand || "Partner Brand";
  const title = deal?.title || deal?.spec?.title || `${brandName} Limited Drop`;
  const category = deal?.category || "apparel";
  const materials: string[] = deal?.spec?.materials || [];
  const colorways: string[] = deal?.spec?.colorways || [];

  const handleGenerate = async () => {
    setIsLoading(true);
    setNotice(null);
    try {
      const res = await fetch("/api/generate/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          card_id: deal?.card_id,
          brand_name: brandName,
          title: title,
          category: category,
          materials: materials,
          colorways: colorways,
          profile_name: activeProfile?.name || "Venture Pulse",
        }),
      });

      if (!res.ok) {
        throw new Error(`Generation failed with HTTP status ${res.status}`);
      }

      const data = await res.json();
      if (data.status === "SUCCESS" && data.image_url) {
        setImageUrl(data.image_url);
        setPrompt(data.prompt);
        setSource(data.source);
        if (data.notice) {
          setNotice(data.notice);
        }
        if (onImageGenerated) {
          onImageGenerated(data.image_url);
        }
        showToast(
          data.source === "imagen-3"
            ? `✨ Successfully rendered with Google Imagen 3!`
            : `✓ Generated Swiss Editorial Visual Proof!`
        );
      } else {
        throw new Error(data.message || "Failed to generate image");
      }
    } catch (err: any) {
      console.error("Image generation error:", err);
      showToast(`Generation error: ${err.message || "Please check network or backend."}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!imageUrl) return;
    const a = document.createElement("a");
    a.href = imageUrl;
    const isSvg = imageUrl.startsWith("data:image/svg");
    a.download = `${brandName.toLowerCase().replace(/\s+/g, "_")}_studio_render.${isSvg ? "svg" : "jpg"}`;
    a.click();
    showToast("Downloaded visual proof render");
  };

  const handleCopyPrompt = () => {
    if (!prompt) return;
    navigator.clipboard.writeText(prompt);
    setCopiedPrompt(true);
    showToast("Copied Imagen prompt to clipboard");
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="space-y-2 flex flex-col justify-between h-full">
      {/* Visual Proof Header Toolbar */}
      <div className="flex items-center justify-between text-[10px] font-mono border-b border-editorial pb-1.5">
        <div className="flex items-center space-x-1.5 truncate">
          <span className="text-terracotta uppercase font-bold tracking-wider">
            FIG 2.4 // AI VISUAL PROOF
          </span>
          <span className="text-inkMuted dark:text-darkMuted hidden sm:inline">
            • {source === "imagen-3" ? "Google Imagen 3 (8K)" : "Editorial Studio Render"}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-1">
          {imageUrl && (
            <>
              <button
                onClick={() => setShowPromptDetails(!showPromptDetails)}
                className="px-1.5 py-0.5 rounded border border-editorial hover:bg-subtle dark:hover:bg-darkSubtle text-inkMuted dark:text-darkMuted transition"
                title="View Prompt Brief"
              >
                <Info className="w-3 h-3 inline" />
              </button>
              <button
                onClick={handleDownload}
                className="px-1.5 py-0.5 rounded border border-editorial hover:bg-subtle dark:hover:bg-darkSubtle text-inkMuted dark:text-darkMuted transition"
                title="Download Studio Render"
              >
                <Download className="w-3 h-3 inline" />
              </button>
              <button
                onClick={() => setIsZoomed(true)}
                className="px-1.5 py-0.5 rounded border border-editorial hover:bg-subtle dark:hover:bg-darkSubtle text-inkMuted dark:text-darkMuted transition"
                title="Expand Zoom"
              >
                <ZoomIn className="w-3 h-3 inline" />
              </button>
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="px-2 py-0.5 rounded border border-editorial hover:border-terracotta hover:text-terracotta text-inkMuted dark:text-darkMuted transition flex items-center space-x-1 disabled:opacity-50"
                title="Regenerate fresh variation"
              >
                <RefreshCw className={`w-2.5 h-2.5 ${isLoading ? "animate-spin" : ""}`} />
                <span>Rerender</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Visual Display Canvas */}
      <div className="relative w-full h-[320px] bg-paper dark:bg-darkSubtle border border-editorial rounded overflow-hidden flex items-center justify-center select-none shadow-inner">
        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-3 font-mono">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-2 border-terracotta/30 border-t-terracotta animate-spin" />
              <Camera className="w-5 h-5 text-terracotta absolute inset-0 m-auto" />
            </div>
            <div className="space-y-1">
              <span className="text-xs text-white font-bold tracking-wider block">
                SYNTHESIZING STUDIO PROOF...
              </span>
              <span className="text-[10px] text-zinc-300 max-w-xs block leading-relaxed">
                Calling Google Gemini Imagen 3 engine. Calculating surface reflectance, material drape &amp; Swiss typographic layout.
              </span>
            </div>
          </div>
        )}

        {/* Rendered Image Display */}
        {imageUrl ? (
          <div className="relative w-full h-full group flex items-center justify-center p-2">
            <img
              src={imageUrl}
              alt={`${title} - AI Studio Visual Proof`}
              className="max-w-full max-h-full object-contain rounded shadow-md cursor-pointer transition-transform duration-300 group-hover:scale-[1.02]"
              onClick={() => setIsZoomed(true)}
            />
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none px-2 py-1 bg-surface/85 dark:bg-darkSurface/85 backdrop-blur-sm rounded border border-editorial text-[9px] font-mono opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-ink dark:text-darkInk font-bold truncate">
                {title}
              </span>
              <span className="text-terracotta font-semibold shrink-0 ml-1">
                Click to Zoom
              </span>
            </div>
          </div>
        ) : (
          /* Empty / Idle State */
          <div className="p-6 text-center space-y-3 max-w-xs">
            <div className="w-10 h-10 mx-auto rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center border border-terracotta/20">
              <Camera className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="font-serif italic text-lg text-ink dark:text-darkInk font-medium">
                Visual Proof Not Rendered
              </div>
              <p className="text-[11px] font-mono text-inkMuted dark:text-darkMuted leading-relaxed">
                Generate a photorealistic 8K product render via Google Gemini Imagen 3.
              </p>
            </div>
            <div className="pt-1">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isLoading}
                className="px-4 py-2 rounded bg-ink text-surface dark:bg-surface dark:text-ink font-mono text-xs font-bold uppercase tracking-wider hover:bg-terracotta dark:hover:bg-terracotta hover:text-white transition shadow flex items-center space-x-1.5 mx-auto disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-terracotta" />
                <span>Generate Studio Render</span>
              </button>
              <span className="block text-[9px] font-mono text-inkMuted dark:text-darkMuted mt-1.5">
                ⚡ On-demand only • Zero tokens burned while idle
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Notice Banner (Fallback / Tip) */}
      {notice && (
        <div className="text-[10px] font-mono px-2.5 py-1 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 truncate">
          {notice}
        </div>
      )}

      {/* Expandable Prompt Drawer */}
      {showPromptDetails && prompt && (
        <div className="p-3 bg-surface dark:bg-darkSurface border border-editorial rounded text-xs font-mono space-y-2 shadow-sm animate-fade-in">
          <div className="flex items-center justify-between text-[10px] text-inkMuted dark:text-darkMuted border-b border-editorial pb-1">
            <span className="font-bold uppercase tracking-wider text-ink dark:text-darkInk">
              Gemini Imagen 3 Prompt Brief:
            </span>
            <button
              onClick={handleCopyPrompt}
              className="text-terracotta hover:underline font-bold flex items-center space-x-1"
            >
              {copiedPrompt ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              <span>{copiedPrompt ? "Copied" : "Copy Prompt"}</span>
            </button>
          </div>
          <p className="text-[11px] text-ink dark:text-darkInk font-sans leading-relaxed whitespace-pre-wrap select-text">
            {prompt}
          </p>
        </div>
      )}

      {/* Fullscreen Zoom Lightbox Modal */}
      {isZoomed && imageUrl && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsZoomed(false)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-surface dark:bg-darkSurface border border-editorial rounded-xl overflow-hidden p-3 shadow-2xl flex flex-col space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-editorial pb-2 px-1 text-xs font-mono">
              <span className="font-bold text-ink dark:text-darkInk truncate">
                {title} // 8K Studio Visual Proof
              </span>
              <button
                onClick={() => setIsZoomed(false)}
                className="p-1 rounded hover:bg-subtle dark:hover:bg-darkSubtle text-inkMuted dark:text-darkMuted"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-center overflow-auto max-h-[75vh]">
              <img
                src={imageUrl}
                alt={title}
                className="max-w-full max-h-[75vh] object-contain rounded"
              />
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-inkMuted dark:text-darkMuted pt-1 border-t border-editorial px-1">
              <span>{brandName} × {activeProfile.name}</span>
              <button
                onClick={handleDownload}
                className="text-terracotta font-bold flex items-center space-x-1 hover:underline"
              >
                <Download className="w-3 h-3" />
                <span>Download High-Res</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
