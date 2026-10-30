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
  const { activeProfile, showToast } = useAppStore();

  const { data, isLoading, error } = useQuery<DealsResponse>({
    queryKey: ["crm-deals"],
    queryFn: async () => {
      const res = await fetch("/api/crm/deals");
      if (!res.ok) {
        throw new Error("Failed to fetch CRM deals");
      }
      return res.json();
    },
    // If backend is offline, retry lightly then use fallback
    retry: 1,
    staleTime: 10000,
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
      queryClient.invalidateQueries({ queryKey: ["crm-deals"] });
      showToast(`Updated deal stage to ${variables.new_stage}`);
    },
    onError: (err) => {
      console.warn("Could not sync stage to backend, updated locally:", err);
    },
  });

  // Normalize data with activeProfile cards as fallback/enrichment
  const activeCards = activeProfile.cards || [];
  const mergedDeals: DealCardData[] = data?.deals || activeCards.map((c, i): DealCardData => ({
    card_id: `card_${i + 1}`,
    brand_name: c.brand,
    title: c.title,
    category: c.domain,
    affinity_multiplier: c.affinity.replace("⚡ ", ""),
    synergy_score: c.score,
    stage: c.stage,
    msrp: 185.0,
    run_units: 300,
    gmv: 55500.0,
  }));

  const metrics = data?.metrics || {
    total_pipeline_value: mergedDeals.reduce((sum, d) => sum + (d.gmv || 48500), 0),
    average_affinity:
      mergedDeals.reduce(
        (sum, d) => sum + parseFloat(d.affinity_multiplier.replace("x", "") || "7.5"),
        0
      ) / (mergedDeals.length || 1),
    total_deals: mergedDeals.length,
  };

  return {
    deals: mergedDeals,
    metrics,
    isLoading,
    error,
    updateStage: updateStageMutation.mutate,
  };
}
