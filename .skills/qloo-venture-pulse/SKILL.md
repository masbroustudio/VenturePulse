---
name: qloo-venture-pulse
description: Autonomous cultural intelligence & brand collaboration agent powered by Qloo's 250M+ entity Taste Graph. Use when matching creators, indie studios, or podcasts with high-affinity brand partners and physical merchandise drops, or when brands seek untapped subcultural creator communities.
version: 1.1.0
author: Venture Pulse Team
license: MIT
---

# Qloo Venture Pulse Agent Skill

This skill equips AI agents with the capability to perform **empirical cultural grounding** using Qloo's 250M+ entity Taste Graph (`hackathon.api.qloo.com`). It bridges creative aesthetics (music, film, fashion, art, dining) to verified consumer brand affinities, subcultural communities, and physical merchandise co-creation concepts.

## When to Use This Skill
- When a user asks for authentic brand sponsors, partners, or physical merchandise drops for a creator, indie game, podcast, or artist.
- When determining non-obvious cross-domain brand affinities without relying on generic LLM stereotypes.
- When a brand manager seeks unexpected micro-creator subcultures where their brand indexes $>6\times$ above baseline (Brand Counter-Discovery).
- When stress-testing unit economics, BOM physical specifications, and creator royalties.
- When constructing cold-outreach brand pitches backed by empirical statistical audience overlap proof and anti-affinity guardrails.

## Tools Declared

### 1. `qloo_taste_explorer`
Resolves cultural anchors and queries Qloo's Taste Graph to calculate cross-domain brand affinities, multi-hop taste paths, negative anti-affinity guardrails, and geographic clusters.
- **Inputs:**
  - `anchorEntities`: Array of cultural anchors (e.g. `["Synthwave", "Cyberpunk 2077", "A24 Cinema"]`).
  - `targetDomains`: Array of target domains (e.g. `["fashion", "beverage", "tech", "living"]`).
  - `excludedTags`: Array of anti-affinity tags (e.g. `["mass-market", "cheap-plastic"]`).
- **Outputs:**
  - `resolvedAnchors`: Canonical Qloo URN entities with category tags.
  - `affinityMatches`: Ranked list of brand entities with affinity multipliers (e.g. `7.8x`), multi-hop paths, negative guardrails, and top geographic clusters (e.g. *Tokyo 4.1x, Brooklyn 3.4x*).

### 2. `subcultural_audience_discovery`
Bidirectional counter-discovery tool: given a brand entity, searches Qloo's Taste Graph to identify matching creator archetypes, narrative podcasts, and indie gaming subcultures.
- **Inputs:**
  - `brandEntity`: Brand name or Qloo URN (e.g. `"Snow Peak"` or `"Leica Camera"`).
  - `targetCreatorCategories`: Target creator formats (`["Podcast", "Gaming", "Art", "Music"]`).
- **Outputs:**
  - `matchedSubcultures`: Ranked creator archetypes, overlap scores, and suggested activation formats.

### 3. `market_feasibility_validator`
Analyzes sponsor deal sizing, category saturation, sponsor budget brackets, and brand safety.
- **Inputs:** `brandName`, `brandDomain`, `creatorCategory`, `creatorAudienceTier`.
- **Outputs:** `feasibilityScore` (0–100), `estimatedDealTier` ($2k–$50k+), `brandSafetyStatus` (`Safe` | `Moderate Caution` | `High Conflict`), `consensusStatus` (`APPROVED` | `REJECT_AND_REFINE`).

### 4. `creative_concept_synthesizer`
Designs physical limited-edition merchandise specs with packaging aesthetics, BOM specifications, and drop mechanics.
- **Inputs:** `creatorName`, `creatorVibe`, `brandName`, `brandDomain`, `culturalIntersectionTags`, `humanConstraints` (optional mid-debate founder interventions).
- **Outputs:** `productTitle`, `format` (`Limited Capsule` | `Co-Branded Packaging` | `Hardware Variant` | `Experiential Drop`), `aestheticDescription`, `packagingSpec`, `targetRetailPrice`.

### 5. `unit_economics_calculator`
Models financial viability, gross merchandise value (GMV), creator royalty splits, and sell-through rates based on empirical affinity multipliers.
- **Inputs:** `editionRunSize`, `targetRetailPrice`, `royaltySplitPct` (default: 18%), `qlooAffinityMultiplier`.
- **Outputs:** `grossMerchandiseValue`, `creatorRoyaltyPayout`, `guaranteedSponsorFee`, `projectedSellThroughRate`.

### 6. `pitch_architect`
Generates high-converting executive cold outreach pitch copy embedding empirical Qloo data citations and cultural rationale.
- **Inputs:** `targetBrand`, `creatorName`, `audienceSummary`, `productConcept`, `qlooAffinityMultiplier`.
- **Outputs:** `subjectLine`, `executiveHook`, `dataProofParagraph`, `collabProposal`, `callToAction`.

### 7. `vanilla_llm_counter_proof`
Runs the ungrounded baseline counterfactual prompt to compare against generic AI hallucinations and cliché swag recommendations.

### 8. `crm_webhook_dispatcher`
Dispatches the finalized brand collaboration card to external webhooks (HubSpot, Notion, or custom CRM endpoints).
