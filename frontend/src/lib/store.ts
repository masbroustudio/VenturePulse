import { create } from "zustand";
import { CreatorOrBrandProfile } from "@/types/qloo";
import { CREATOR_PRESETS, BRAND_PRESETS } from "@/lib/presets";

export type AppMode = "creator" | "brand";
export type AppView = "wizard" | "debate" | "kanban" | "chat";

interface AppState {
  mode: AppMode;
  theme: "light" | "dark";
  activeView: AppView;
  lastStudioView: "wizard" | "debate" | "kanban";
  activePresetIdx: number;
  activeProfile: CreatorOrBrandProfile;
  activeEditingChip: number | null;
  selectedDeal: any | null;
  isProofModalOpen: boolean;
  isTelemetryOpen: boolean;
  isCommandPaletteOpen: boolean;
  isSkillsModalOpen: boolean;
  isSettingsModalOpen: boolean;
  backendOnline: boolean;
  toastMessage: string | null;

  toggleMode: () => void;
  toggleTheme: () => void;
  setActiveView: (view: AppView) => void;
  toggleChatView: () => void;
  applyPreset: (idx: number) => void;
  setProfileName: (name: string) => void;
  setProfileCategory: (category: string) => void;
  setProfileTier: (tier: string) => void;
  addProfileChip: (name: string, domain?: string) => void;
  setChipWeight: (chipIdx: number, weight: number) => void;
  setSelectedDeal: (deal: any | null) => void;
  setProofModalOpen: (open: boolean) => void;
  setTelemetryOpen: (open: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setSkillsModalOpen: (open: boolean) => void;
  setSettingsModalOpen: (open: boolean) => void;
  setBackendOnline: (online: boolean) => void;
  showToast: (msg: string) => void;
  clearToast: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  mode: "creator",
  theme: "light",
  activeView: "wizard",
  lastStudioView: "wizard",
  activePresetIdx: 0,
  activeProfile: JSON.parse(JSON.stringify(CREATOR_PRESETS[0])),
  activeEditingChip: null,
  selectedDeal: null,
  isProofModalOpen: false,
  isTelemetryOpen: false,
  isCommandPaletteOpen: false,
  isSkillsModalOpen: false,
  isSettingsModalOpen: false,
  backendOnline: false,
  toastMessage: null,

  toggleMode: () => {
    const currentMode = get().mode;
    const nextMode: AppMode = currentMode === "creator" ? "brand" : "creator";
    const presets = nextMode === "creator" ? CREATOR_PRESETS : BRAND_PRESETS;
    set({
      mode: nextMode,
      activePresetIdx: 0,
      activeProfile: JSON.parse(JSON.stringify(presets[0])),
    });
    get().showToast(
      nextMode === "brand"
        ? "Switched to Brand Mode (Deep Indigo • Subcultural Discovery)"
        : "Switched to Creator Mode (Terracotta • Brand Merch Drops)"
    );
  },

  toggleTheme: () => {
    const next = get().theme === "light" ? "dark" : "light";
    set({ theme: next });
    if (typeof document !== "undefined") {
      if (next === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  },

  setActiveView: (view) => {
    if (view !== "chat") {
      set({ activeView: view, lastStudioView: view });
    } else {
      set({ activeView: view });
    }
  },

  toggleChatView: () => {
    const current = get().activeView;
    if (current === "chat") {
      const target = get().lastStudioView || "wizard";
      set({ activeView: target });
      get().showToast(`Switched to Studio Workspace (${target})`);
    } else {
      set({ lastStudioView: current, activeView: "chat" });
      get().showToast("Switched to Cultural Copilot Chat");
    }
  },

  applyPreset: (idx) => {
    const presets = get().mode === "creator" ? CREATOR_PRESETS : BRAND_PRESETS;
    if (presets[idx]) {
      set({
        activePresetIdx: idx,
        activeProfile: JSON.parse(JSON.stringify(presets[idx])),
      });
      get().showToast(`Loaded ${get().mode === "creator" ? "Creator" : "Brand"}: ${presets[idx].name}`);
    }
  },

  setProfileName: (name) => {
    const p = { ...get().activeProfile, name };
    p.graph.center.name = name;
    set({ activeProfile: p });
  },

  setProfileCategory: (category) => {
    const p = { ...get().activeProfile, category };
    set({ activeProfile: p });
  },

  setProfileTier: (tier) => {
    const p = { ...get().activeProfile, tier };
    set({ activeProfile: p });
  },

  addProfileChip: (name, domain = "aesthetic") => {
    const p = { ...get().activeProfile };
    const cleanName = name.trim();
    if (!cleanName) return;
    const newChip = {
      name: cleanName,
      domain,
      urn: `urn:entity:tag:${cleanName.toLowerCase().replace(/[^a-z0-9]/g, "_")}`,
      weight: 0.9,
    };
    p.chips = [...p.chips, newChip];

    const angle = (p.graph.tags.length * 90) * (Math.PI / 180);
    const newTag = {
      id: `custom-tag-${Date.now()}`,
      name: cleanName.slice(0, 14),
      x: Math.round(300 + Math.cos(angle) * 110),
      y: Math.round(230 + Math.sin(angle) * 90),
      weight: 0.9,
      stroke: "#ea580c",
    };
    p.graph.tags = [...p.graph.tags, newTag];
    set({ activeProfile: p });
    get().showToast(`Resolved URN: ${newChip.urn}`);
  },

  setChipWeight: (chipIdx, weight) => {
    const p = { ...get().activeProfile };
    if (p.chips[chipIdx]) {
      p.chips[chipIdx].weight = weight;
      const chipName = p.chips[chipIdx].name.toLowerCase();
      const tag = p.graph.tags.find(
        (t) =>
          t.name.toLowerCase().includes(chipName) ||
          chipName.includes(t.name.toLowerCase())
      );
      if (tag) tag.weight = weight;
      set({ activeProfile: p });
    }
  },

  setSelectedDeal: (deal) => set({ selectedDeal: deal }),
  setProofModalOpen: (open) => set({ isProofModalOpen: open }),
  setTelemetryOpen: (open) => set({ isTelemetryOpen: open }),
  setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
  setSkillsModalOpen: (open) => set({ isSkillsModalOpen: open }),
  setSettingsModalOpen: (open) => set({ isSettingsModalOpen: open }),
  setBackendOnline: (online) => set({ backendOnline: online }),

  showToast: (msg) => {
    set({ toastMessage: msg });
    setTimeout(() => {
      if (get().toastMessage === msg) {
        set({ toastMessage: null });
      }
    }, 3200);
  },

  clearToast: () => set({ toastMessage: null }),
}));
