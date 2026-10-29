# Venture Pulse — Interactive UI Prototype Guide
**High-End Editorial Luxury Prototype (`design/index.html`)**

This folder contains a fully interactive, self-contained HTML/CSS/JS prototype of **Venture Pulse** built with:
- **Editorial Paper Light Theme (Default):** Warm gallery paper (`#fbfbfa`), pure white cards (`#ffffff`), deep ink typography (`#09090b`), hairline borders (`#e4e4e7`), and warm cultural terracotta (`#ea580c`) & gold (`#d97706`) accents.
- **Dark Studio Mode:** Seamless instant toggle with local storage persistence.
- **Typography:** Google Fonts `Instrument Serif` (editorial italic display) + `Inter` (body) + `JetBrains Mono` (telemetry/code).
- **Interactive SVG Taste Graph Visualizer:** Real-time cross-domain mapping connecting creator anchors to high-affinity brand partners.
- **LangGraph Visual DAG:** Step-by-step state machine progress visualization.
- **DeepEval & Ragas Benchmark Lab:** Quantitative evaluation metrics comparing Vanilla LLM vs. Qloo Grounding.
- **LangFuse & Supabase Telemetry Drawer:** Live execution trace latency, token costs, and vector cosine similarities.
- **Mobile-Responsive First:** Fluid layout scaling smoothly from smartphone screens to ultra-wide desktop monitors.

---

## 🖥️ How to Open & Test in Your Browser

You can open this file directly in any web browser without running any build server:

### Option A: PowerShell Command
```powershell
Start-Process "C:\dev\QlooAgent\design\index.html"
```

### Option B: Double-Click
Simply navigate to `C:\dev\QlooAgent\design\index.html` in File Explorer and double-click to open in Chrome, Edge, or Brave.

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
| :--- | :--- |
| `T` | Toggle **Light Theme** $\leftrightarrow$ **Dark Studio Theme** |
| `1` | Switch to **1. Studio & Taste Graph** view |
| `2` | Switch to **2. LangGraph Council Debate** view |
| `3` | Switch to **3. Brand CRM Pipeline** view |
| `ESC` | Close any open modal (Lookbook, Proof Lab, or Telemetry Drawer) |

---

## 🧭 Interactive Screens & Features to Test

1. **Top Global Navigation:**
   - Click the **"Proof Lab"** button to open the DeepEval Grounding Benchmark modal.
   - Click the **"⚡ Traces"** button to open the LangFuse & Supabase Telemetry drawer.
   - Click the **🌙 / ☀️** icon (or press `T`) to toggle between Light Paper and Dark Studio themes.

2. **Screen 1: Studio Intake & Taste Graph (`#view-wizard`)**
   - Click any of the **3 Evaluator Presets** (*Cyberpunk Gaming*, *Ambient Wellness*, *Analog 35mm*) to instantly auto-fill the form with aesthetic and cultural anchors.
   - Inspect the **Interactive SVG Taste Graph Canvas**: Click on any node (*Acne Studios*, *Keychron*, *Matcha Kari*, *Teenage Engineering*) to inspect cosine distance and compatibility metrics.
   - Click **"Launch LangGraph Multi-Agent Deliberation"**.

3. **Screen 2: LangGraph Council & Live Telemetry (`#view-debate`)**
   - Inspect the **LangGraph Visual DAG** showing active step nodes.
   - Watch the simulated dialogue between **Cultural Analyst** (Qloo 600M+ Taste Graph), **Brand Strategist** (market feasibility & sizing), and **Creative Director** (physical concept & packaging).
   - Click **"Fast-Forward to Consensus"** to jump to the consensus banner (94% synergy).
   - Click **"Enter Brand CRM Board"**.

4. **Screen 3: Brand CRM Pipeline (`#view-kanban`)**
   - Metric summary chips ($48,500 total pipeline value, 7.4x avg affinity, 98/100 safety).
   - Filter buttons (All, Apparel, Tech, Beverage).
   - 4 Kanban columns (**Discovered**, **Vetted**, **Pitch Ready**, and **Dispatched**).
   - Click any card to open the **Editorial Lookbook & Contract Term Sheet Modal**.

5. **Modal 1: Editorial Lookbook & Contract Term Sheet (`#modal-poster`)**
   - Magazine-grade double-page spread.
   - Left page: Limited-edition drop poster, packaging specs, and retail pricing.
   - Right page: Commercial deal term sheet ($14,500 + 18% royalty) and personalized cold outreach pitch letter with empirical Qloo citations.
   - Click **"Copy Pitch Copy"** or **"Dispatch to CRM"** (triggers simulated HubSpot webhook).

6. **Modal 2: DeepEval & Ragas Benchmark Lab (`#modal-proof`)**
   - Quantitative evaluation scorecard:
     - **Faithfulness Score:** 96.2% vs. 34.1%
     - **Cultural Groundedness:** 98.4% vs. 18.0%
     - **Hallucination Resistance:** 98.0% vs. 22.0%
   - Side-by-side prompt breakdown proving why generic LLMs fail at cultural merchandising.

7. **Drawer 3: LangFuse & Supabase Telemetry Drawer (`#drawer-telemetry`)**
   - Live execution trace tree with step latencies (482 ms), token costs ($0.0018), Supabase `pgvector` cosine similarity metrics, and Qloo cache hits.
