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

  // Normalize data with activeProfile cards as fallback/enrichment
  const activeCards = activeProfile.cards || [];
  const presetDeals: DealCardData[] = activeCards.map((c, i): DealCardData => ({
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
  }));

  const backendDeals: DealCardData[] = (data?.deals || []).filter((d) => {
    if (!d.session_id) return true;
    if (d.session_id === activeProfile.id) return true;
    if (activeProfile.id === "neon-void" && d.session_id === "seed") return true;
    return false;
  });

  // Merge: DB deals take precedence, fill remaining preset cards by unique brand
  const existingBrands = new Set(
    backendDeals.map((d) => d.brand_name.toLowerCase().trim())
  );
  const mergedDeals: DealCardData[] = [
    ...backendDeals,
    ...presetDeals.filter(
      (p) => !existingBrands.has(p.brand_name.toLowerCase().trim())
    ),
  ];

  const metrics = data?.metrics && backendDeals.length > 0
    ? {
        total_pipeline_value: mergedDeals.reduce((sum, d) => sum + (d.gmv || 48500), 0),
        average_affinity:
          mergedDeals.reduce(
            (sum, d) => sum + parseFloat(d.affinity_multiplier.replace("x", "") || "7.5"),
            0
          ) / (mergedDeals.length || 1),
        total_deals: mergedDeals.length,
      }
    : {
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
