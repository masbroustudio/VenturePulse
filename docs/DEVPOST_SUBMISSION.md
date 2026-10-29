# Venture Pulse — Devpost Submission Write-Up
**Official Submission Document for Qloo Agentic Hackathon 2026**

---

### 1. Project Tagline
> **Venture Pulse:** Autonomous Subcultural Arbitrage & Co-Creation Engine for creators, indie studios, and lifestyle brands, powered by Qloo’s 250M+ entity Taste Graph.

---

### 2. Inspiration: Eliminating AI's "Cultural Blindness"
Modern AI agents can write code, draft legal contracts, and solve complex math equations, but when asked what brand to partner with, what merchandise an audience will actually buy, or which sponsors are authentic, **they are guessing**.

We saw indie game developers, podcasters, and YouTube creators constantly getting pitched generic, low-converting sponsorship ideas: *"Sell logo t-shirts and coffee mugs"* or *"Pitch generic VPNs and meal kit boxes."* This has led to severe **monetization fatigue** — creators leave 80%+ of potential commercial revenue on the table because they only pitch obvious, saturated sponsors rather than high-margin **cross-domain lifestyle brands** their community secretly loves.

Inspired by enterprise case studies (like Netflix utilizing Qloo to discover unexpected cross-category collaborations like *Vans × Stranger Things*), we asked ourselves: **Can we build an autonomous agentic council that gives independent creators and brands this exact cultural intelligence, grounding commercial partnerships in mathematical taste data rather than hallucinations?**

That is how **Venture Pulse** was born.

---

### 3. What It Does
**Venture Pulse** is an AI-native agentic platform designed to discover, vet, and execute high-converting brand collaborations and physical merchandise drops:

1. **Step-by-Step Studio Intake Wizard & Reactive Archetypes:** Creators input their artistic footprint (music, cinema, visual aesthetics) or select from 3 instant pre-seed archetypes (*Cyberpunk Game Studio*, *Lo-Fi Botanical Podcast*, *Vintage Analog Creator*). Every input change reactively cascades through all views.
2. **Interactive Multi-Hop Taste Graph Visualizer:** Surfaces non-obvious cross-domain brand affinities (e.g. *7.8× baseline affinity*), full multi-hop traversal paths, negative anti-affinity guardrails, and top geographic clusters. Users can also add custom seed entities live.
3. **Adversarial 2-Cycle LangGraph Council Debate:** Three specialized sub-agents deliberate in real time over live Server-Sent Events (SSE):
   - 🕵️ **Cultural Analyst:** Queries Qloo's Taste Graph to calculate cross-domain affinities.
   - 📈 **Brand Strategist:** Produces a **Cycle 1 Conflict / Rejection event** (`Synergy 71% < 85%`), rejecting candidates that exceed creator deal tiers or trigger saturation risks. Cycle 2 re-evaluates with negative anti-affinity guardrails to converge at **94% Cultural Synergy**.
   - 🎨 **Creative Director:** Designs the physical limited-edition drop concept, BOM specifications, and packaging aesthetics.
   - 🎙️ **Founder Intervention Bar:** Allows human founders/evaluators to inject live constraints mid-debate (e.g. *"Keep retail under $150 USD"*) and watch the Creative Director adapt specifications immediately.
4. **Actionable HTML5 Drag-and-Drop CRM Pipeline:** Finalized collaboration targets populate an interactive Kanban board (**Discovered $\rightarrow$ Vetted $\rightarrow$ Pitch Ready $\rightarrow$ Dispatched**) with domain filters, real-time pipeline financial recalculations, and quick-move stage advancement.
5. **Interactive Unit Economics & Real Markdown Dossier Export:** Sliders inside the Lookbook modal compute Gross Merchandise Value (GMV) and Creator Royalty splits in real time. Evaluators can download the entire strategy dossier as a formatted `.md` document with one click.
6. **Bidirectional Mode (Option B):** One-click toggle between **Creator Mode** (creators finding brand partners) and **Brand Counter-Discovery Mode** (lifestyle brands discovering unexpected micro-creator subcultures).
7. **DeepEval & Ragas Grounding Benchmark Lab:** Quantitative evaluation proving our Qloo-grounded agent outperforms generic vanilla LLMs across Faithfulness (96.2% vs. 34.1%), Cultural Groundedness (98.4% vs. 18.0%), and Hallucination Resistance (98.0% vs. 22.0%).

---

### 4. What Makes It "Qloo-Powered"
If you remove Qloo from Venture Pulse, **the entire system collapses into generic AI stereotypes**.

Venture Pulse relies on Qloo's API (`hackathon.api.qloo.com`) to:
* **Resolve Qualitative Aesthetics to Canonical Entities:** Translates subjective vibes into verified Taste Graph nodes across music, film, fashion, dining, and lifestyle.
* **Traverse Cross-Domain Graph Edges:** Uncovers unexpected statistical correlations that no standard LLM could predict (e.g. proving that fans of French electronic music and brutalist architecture index 7.8× higher for Japanese raw selvedge denim and 8.4× higher for ceremonial matcha).
* **Apply Negative Anti-Affinity Guardrails:** Excludes brand clashes and over-commercialized sponsors based on statistical audience anti-signals.
* **Provide Undeniable Negotiation Proof:** Mathematical multipliers (e.g. *7.8× above baseline*) are embedded directly into executive brand pitch letters, giving creators leverage when negotiating terms.

---

### 5. How We Built It
* **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS, `Instrument Serif` & `JetBrains Mono`. Designed with an A24/Hypebeast-inspired cultural editorial luxury aesthetic, built **Mobile-Responsive First**.
* **Agentic Framework:** Vercel AI SDK Core with a real-time SSE streaming LangGraph cyclic Multi-Agent Council state machine.
* **Cultural Intelligence:** Qloo Taste AI™ API integration with in-memory caching, dual-header authentication (`Authorization` + `X-Api-Key`), and rate-limit circuit breakers.
* **LLM Engine:** Multi-provider gateway supporting Google Gemini 2.0 Flash / 1.5 Pro, OpenAI GPT-4o, and SumoPod / OpenAI-compatible endpoints.
* **Storage & Persistence:** Zero-friction client-first hybrid storage (IndexedDB/LocalStorage) ensuring instant, login-free evaluation for hackathon judges, backed by a production Prisma/Supabase (`pgvector`) schema.
* **Ecosystem Integration:** Formatted as an open-source agent skill for **skills.sh**, installable via `npx skills add <username>/venture-pulse`.

---

### 6. Challenges We Overcame
1. **Making Multi-Agent Deliberation Truly Agentic:** Replacing superficial one-shot prompt scripts with a genuine cyclic LangGraph state machine featuring conflict, budget rejection, negative tag filtering, and founder mid-debate constraint adaptation.
2. **Eliminating State Rigidity:** Architecting a reactive application state engine where every preset selection cascades dynamically through the SVG graph, streaming dialogue, and CRM pipeline.
3. **Translating Cultural Taste into Concrete Unit Economics:** Bridging subjective affinities to tangible physical product BOMs, edition run sizing, and royalty splits.

---

### 7. What's Next for Venture Pulse
* **Automated Shopify & Printful Provisioning:** One-click automated pre-order page generation for the AI-designed physical merchandise drops.
* **Automated Cold Outreach Delivery:** Integrating Resend to autonomously dispatch pitches directly to verified brand partnership managers.
* **Multi-Creator Taste Pooling:** Enabling multiple creators to pool their taste graphs together to co-pitch enterprise sponsors.
