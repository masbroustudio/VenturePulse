"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppStore } from "@/lib/store";
import { PipelineStage, DealCardData } from "@/types/deal";

interface DealsResponse {
  deals: DealCardData[];
  metrics: {
    total_pipeline_value: number;
    average_affinity: number;
    total_deals: number;
  };
}

export function useDeals() {
  const queryClient = useQueryClient();
  const { mode, activeProfile, showToast } = useAppStore();

  const { data, isLoading, error } = useQuery<DealsResponse>({
    queryKey: ["crm-deals", mode, activeProfile.id],
    queryFn: async () => {
      const url = `/api/crm/deals?session_id=${encodeURIComponent(
        activeProfile.id
      )}&profile_id=${encodeURIComponent(activeProfile.id)}&mode=${encodeURIComponent(
        mode
      )}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Failed to fetch CRM deals");
      }
      return res.json();
    },
    // Light retry, scoped to current profile
    retry: 1,
    staleTime: 5000,
  });

  const updateStageMutation = useMutation({
    mutationFn: async ({
      card_id,
      new_stage,
    }: {
      card_id: string;
      new_stage: PipelineStage;
    }) => {
      const res = await fetch("/api/crm/dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ card_id, new_stage }),
      });
      if (!res.ok) {
        throw new Error("Failed to update deal stage");
      }
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["crm-deals", mode, activeProfile.id] });
      showToast(`Updated deal stage to ${variables.new_stage}`);
    },
    onError: (err) => {
      console.warn("Could not sync stage to backend, updated locally:", err);
    },
  });

  const createDealMutation = useMutation({
    mutationFn: async (newDeal: Partial<DealCardData>) => {
      const res = await fetch("/api/crm/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newDeal,
          session_id: activeProfile.id,
          profile_id: activeProfile.id,
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to create deal");
      }
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["crm-deals", mode, activeProfile.id] });
      showToast(`✓ Added "${variables.brand_name}" to Deal Desk!`);
    },
  });

  const deleteDealMutation = useMutation({
    mutationFn: async (cardId: string) => {
      const res = await fetch(`/api/crm/deals/${encodeURIComponent(cardId)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete deal");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm-deals", mode, activeProfile.id] });
      showToast("Deleted deal from Deal Desk");
    },
  });

  const clearDealsMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/crm/deals?session_id=${encodeURIComponent(activeProfile.id)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to clear deals");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm-deals", mode, activeProfile.id] });
      showToast("Cleared Deal Desk pipeline");
    },
  });

  const loadPresetSeedsMutation = useMutation({
    mutationFn: async () => {
      const cards = activeProfile.cards || [];
      const res = await fetch("/api/crm/seed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: activeProfile.id,
          deals: cards.map((c, i) => ({
            card_id: `${activeProfile.id}_preset_${i + 1}`,
            brand_name: c.brand,
            title: c.title,
            category: c.domain,
            affinity_multiplier: c.affinity.replace("⚡ ", ""),
            synergy_score: c.score,
            stage: c.stage,
            msrp: 185.0,
            run_units: 300,
            gmv: 55500.0,
          })),
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to seed preset deals");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm-deals", mode, activeProfile.id] });
      showToast(`🌱 Loaded starter archetype deals for ${activeProfile.name}!`);
    },
  });

  // Strict Dynamic Pipeline: Only return deals actually saved in backend for this profile
  const deals: DealCardData[] = (data?.deals || []).filter((d) => {
    if (!d.session_id) return true;
    if (d.session_id === activeProfile.id) return true;
    if (d.session_id === "all") return true;
    return false;
  });

  const totalValue = deals.reduce((sum, d) => sum + (d.gmv || 0), 0);
  const avgAffinity =
    deals.length > 0
      ? deals.reduce((sum, d) => sum + parseFloat(d.affinity_multiplier?.replace("x", "") || "0"), 0) /
        deals.length
      : 0;

  const metrics = {
    total_pipeline_value: totalValue,
    average_affinity: avgAffinity,
    total_deals: deals.length,
  };

  return {
    deals,
    metrics,
    isLoading,
    error,
    updateStage: updateStageMutation.mutate,
    createDeal: createDealMutation.mutate,
    deleteDeal: deleteDealMutation.mutate,
    clearDeals: clearDealsMutation.mutate,
    loadPresetSeeds: loadPresetSeedsMutation.mutate,
    isCreating: createDealMutation.isPending,
    isSeeding: loadPresetSeedsMutation.isPending,
  };
}
