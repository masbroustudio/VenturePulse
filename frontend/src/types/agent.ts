export type AgentRole = "cultural_analyst" | "brand_strategist" | "creative_director";

export interface TurnMessage {
  role: AgentRole;
  agent_name: string;
  cycle: number;
  thought_reasoning: string;
  content: string;
  tool_calls?: Array<Record<string, any>>;
  synergy_score?: number;
  consensus_status?: "CONFLICT_REJECTED" | "APPROVED" | "REFINED" | "EVALUATING";
}

export interface ProductCollabSpec {
  title: string;
  brand_partner: string;
  category: string;
  affinity_multiplier: string;
  description: string;
  materials: string[];
  colorways: string[];
  msrp_usd: number;
  run_units: number;
  projected_gmv: number;
  creator_royalty_pct: number;
  projected_royalty: number;
  outreach_pitch: string;
}

export interface ConsensusEvent {
  session_id: string;
  card_id?: string;
  consensus_reached: boolean;
  final_synergy: number;
  product_spec: ProductCollabSpec;
}
