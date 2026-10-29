"use client";

import { useAppStore } from "@/lib/store";

export function Toast() {
  const toastMessage = useAppStore((s) => s.toastMessage);
  const clearToast = useAppStore((s) => s.clearToast);

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-scale-up">
      <div className="flex items-center space-x-3 bg-ink text-surface dark:bg-darkSurface dark:text-darkInk border border-editorial px-4 py-3 rounded shadow-2xl font-mono text-xs max-w-md">
        <span>{toastMessage}</span>
        <button
          onClick={clearToast}
          className="text-inkMuted hover:text-surface dark:hover:text-darkInk font-bold text-sm ml-2"
        >
          ×
        </button>
      </div>
    </div>
  );
}
