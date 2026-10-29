export interface QlooEntity {
  entity_id: string;
  name: string;
  type: string;
  subtype?: string;
  popularity?: number;
  score?: number;
  affinity?: number;
  properties?: Record<string, any>;
  tags?: Array<Record<string, any>>;
  external?: Record<string, any>;
}

export interface TasteChip {
  name: string;
  domain: "music" | "cinema" | "aesthetic" | string;
  urn: string;
  weight: number;
}

export interface GraphNode {
  id: string;
  name: string;
  x: number;
  y: number;
  affinity?: string;
  tagId?: string;
  stroke: string;
  path?: string;
  guardrail?: string;
  sub?: string;
  weight?: number;
}

export type EgoBrandNode = GraphNode;
export type EgoTagNode = GraphNode;

export interface EgoGraphData {
  center: { name: string; sub: string };
  tags: GraphNode[];
  brands: GraphNode[];
}

export interface CreatorOrBrandProfile {
  id: string;
  name: string;
  category: string;
  tier: string;
  chips: TasteChip[];
  graph: EgoGraphData;
  cards: Array<{
    brand: string;
    domain: string;
    affinity: string;
    score: number;
    title: string;
    dealSize: string;
    rationale: string;
    stage: "Discovered" | "Vetted" | "Pitch Ready" | "Dispatched";
    overlap: string;
  }>;
}
