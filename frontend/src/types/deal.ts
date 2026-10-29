export type PipelineStage = "Discovered" | "Vetted" | "Pitch Ready" | "Dispatched";

export interface DealCardData {
  card_id: string;
  session_id?: string;
  brand_name: string;
  category: string;
  affinity_multiplier: string;
  synergy_score: number;
  stage: PipelineStage;
  msrp: number;
  run_units: number;
  gmv: number;
  updated_at?: string;
}

export interface PipelineMetrics {
  total_pipeline_value: number;
  average_affinity: number;
  total_deals: number;
}
