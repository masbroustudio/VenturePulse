---
name: qloo-venture-pulse
description: Autonomous cultural intelligence & brand collaboration agent powered by Qloo's 250M+ Taste Graph. Use when matching creators, indie games, or podcasts with high-affinity brand partners and physical merchandise drops.
version: 1.0.0
author: Venture Pulse Team
license: MIT
---

# Qloo Venture Pulse Agent Skill

This skill equips AI agents with the capability to perform **empirical cultural grounding** using Qloo's Taste Graph. It bridges creative aesthetics (music, film, fashion, art) to verified consumer brand affinities and physical merchandise collaboration concepts.

## When to Use This Skill
- When a user asks for authentic brand sponsors, partners, or physical merchandise drops for a creator, indie game, podcast, or artist.
- When you need to determine non-obvious cross-domain brand affinities without relying on generic LLM stereotypes.
- When constructing cold-outreach brand pitches backed by statistical audience overlap proof.

## Tools Declared

### 1. `qloo_taste_explorer`
Resolves cultural anchors and queries Qloo's Taste Graph to calculate cross-domain brand affinities.
- **Inputs:**
  - `anchorEntities`: Array of cultural anchors (e.g. `["Synthwave", "Cyberpunk 2077", "A24 Cinema"]`).
  - `targetDomains`: Array of target domains (e.g. `["fashion", "beverage", "consumer_tech"]`).
- **Outputs:**
  - `affinityMatches`: Ranked list of brand entities with affinity multipliers (e.g. `7.8x`) and cross-domain paths.

### 2. `market_feasibility_validator`
Analyzes sponsor deal sizing, category saturation, and brand safety.
- **Inputs:** `brandName`, `brandDomain`, `creatorCategory`, `creatorAudienceTier`.
- **Outputs:** `feasibilityScore` (0-100), `estimatedDealTier` ($2k-$50k+), `brandSafetyStatus`.

### 3. `creative_concept_synthesizer`
Designs physical limited-edition merchandise specs with packaging aesthetics and retail pricing.
- **Inputs:** `creatorVibe`, `brandName`, `culturalIntersectionTags`.
- **Outputs:** `productTitle`, `format`, `packagingSpec`, `targetRetailPrice`.

### 4. `pitch_architect`
Generates high-converting cold outreach pitch copy embedding empirical Qloo data citations.
- **Inputs:** `targetBrand`, `creatorName`, `productConcept`, `qlooAffinityMultiplier`.
- **Outputs:** `subjectLine`, `executiveHook`, `dataProofParagraph`, `collabProposal`.

### 5. `vanilla_llm_counter_proof`
Runs the ungrounded baseline counterfactual prompt to compare against generic AI hallucinations.

### 6. `crm_webhook_dispatcher`
Dispatches the finalized brand collaboration card to external webhooks (HubSpot, Notion, or custom CRM).
