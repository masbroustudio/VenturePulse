# Venture Pulse — Interactive UI Prototype Guide
**High-End Editorial Luxury Prototype (`design/index.html`)**

This folder contains a fully interactive, reactive, self-contained HTML/CSS/JS prototype of **Venture Pulse** built with:
- **Swiss Editorial Brutalist Grid (Benchmark 1):** Exposed 1px hairline dividers (`#e4e4e7` / `#27272a`), indexed figure labels (`FIG 1.1`, `FIG 1.2`, `FIG 2.1`), and high-contrast typography (`Instrument Serif` display + `Inter` body + `JetBrains Mono` telemetry).
- **Force-Directed Multi-Hop Ego Graph (Benchmark 2):** 3-ring concentric SVG graph (Inner Ego Center $\rightarrow$ Mid Latent Taste Tags $\rightarrow$ Outer Brand Targets) with dynamic path tracing and node dimming on hover.
- **Tokenized Entity Pills & Confidence Weight Sliders (Benchmark 3):** Step 2 chips displaying verified Qloo URN badges (`✓ QLOO: #urn:...`) with clickable popovers for real-time `0.0–1.0` weight tuning and an inline `+ Resolve URN` autocomplete.
- **Cyclic Agent Deliberation Stream & Rejection Loop (Benchmark 4):** Animated horizontal DAG, Cycle 1 conflict rejection (`Synergy 71% < 85% Threshold`), Cycle 2 convergence (94% synergy), collapsible thought reasoning & tool call inspectors, and a live Founder Intervention Bar.
- **Tactile Deal Desk & Radial Gauges (Benchmark 5):** True HTML5 drag-and-drop between stages (`Discovered`, `Vetted`, `Pitch Ready`, `Dispatched`), active domain filters, SVG radial affinity dials (`⚡ 7.8x`), and real-time financial pipeline recalculations.
- **Interactive Blueprint & Swatch Spread (Benchmark 6):** Lookbook modal featuring technical vector blueprints (chore coat, mechanical keyboard, matcha can, pocket synth, or architectural sconce), serialized stamp `EDITION 001/500`, clickable Pantone/material swatches, and live Edition Run / Retail Price sliders calculating GMV and 18% Creator Royalties.
- **LMSYS Side-by-Side Diff Arena (Benchmark 7):** Model A (Vanilla LLM) vs Model B (Venture Pulse) voting interface with DeepEval scorecards (Faithfulness: 96.2% vs 34.1%, Groundedness: 98.4% vs 18.0%, Hallucination Resistance: 98.0% vs 22.0%).
- **Multi-Track Preset Dock (Benchmark 8):** 3 Creator Studios (*Neon Void*, *Botanical Frequencies*, *Analog Nostalgia*) plus **Lumière Spatial** (Architectural Lighting & Interior Mood Concierge — solving the electrician/lighting prompt from `ABOUT_CHALLENGE.md`) and Bidirectional Mode.
- **Chronological Span Waterfall (Benchmark 9):** Gantt-style timeline showing microsecond execution spans, 3-way Cache Mode toggle (LRU Cache, Live API, Circuit Breaker Fallback), and pgvector cosine similarity bars.
- **`⌘K` Command Palette & `skills.sh` Modal (Benchmark 10):** Keyboard shortcut `⌘K` / `Ctrl+K` with fuzzy action filtering, `skills.sh` one-click CLI copy (`npx skills add venture-pulse/qloo-skill`), and real `.md` file download.

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
| `⌘K` / `Ctrl+K` | Open the **`⌘K` Quick Command Palette** |
| `T` | Toggle **Light Paper Theme** $\leftrightarrow$ **Dark Studio Theme** |
| `B` | Toggle **Creator Mode** $\leftrightarrow$ **Brand Counter-Discovery Mode** |
| `1` | Switch to **1. Studio & Ego Graph** view |
| `2` | Switch to **2. LangGraph Council Debate** view |
| `3` | Switch to **3. Brand CRM Pipeline** view |
| `ESC` | Close any open modal (Lookbook, Arena, skills.sh, Command Palette, or Drawer) |

---

## 🧭 Interactive Screens & Features to Test

1. **Preset Dock (4 Presets):**
   - Click **Lumière Spatial** to see how Venture Pulse addresses the `ABOUT_CHALLENGE.md` lateral prompt for architectural room lighting, acoustic mood, and custom alabaster fixtures (Flos, Artemide).
   - Test **Neon Void Studio**, **Botanical Frequencies**, or **Analog Nostalgia**.
2. **Tokenized Entity Chips:**
   - Click on any chip (e.g. `Kavinsky` or `Brian Eno`) to open the latent weight popover slider and drag its weight from `0.1` to `1.0`. Watch the SVG graph update live.
   - Type a new anchor in the `+ Add anchor` box (e.g. `Bauhaus`) and click `+ Resolve URN`.
3. **Multi-Hop Path Tracing:**
   - Hover your mouse over any outer brand node in the SVG Ego Graph (e.g. `Acne Studios` or `Flos Lighting`). Notice how unrelated nodes dim while the exact multi-hop path illuminates.
4. **Adversarial Deliberation Stream:**
   - Click **Launch Cyclic LangGraph Deliberation** to watch Turn 1 stream, Turn 2 show the Cycle 1 conflict rejection badge (`Synergy 71% < 85%`), and Cycle 2 converge at 94%.
   - Type into the **Founder Intervention Bar** to inject constraints into the Creative Director's spec.
5. **HTML5 Drag-and-Drop Deal Desk:**
   - Drag cards between `Discovered`, `Vetted`, `Pitch Ready`, and `Dispatched`.
   - Watch the top **Pipeline Value** and **Average Affinity** recalculate instantly.
6. **Lookbook Modal & Material Swatches:**
   - Click any card to inspect the technical CAD blueprint and click the **Material Swatches** to reveal fabric provenance and BOM details.
   - Drag the **Edition Run** and **Retail Price** sliders to compute GMV and 18% Creator Royalties live.
7. **LMSYS Side-by-Side Proof Arena:**
   - Click **Proof Lab** to inspect the LMSYS blind comparison between Model A (Vanilla LLM) and Model B (Venture Pulse) and vote.
8. **Telemetry Waterfall & Cache Simulator:**
   - Click **⚡ Traces** to view the Gantt span waterfall and toggle between `LRU Cache`, `Live API`, and `Fallback`.
9. **`⌘K` Command Palette & `skills.sh`:**
   - Press `⌘K` or click the header bar to trigger quick actions.
   - Click **📦 skills.sh** to copy the CLI install command.
10. **Real Markdown Export:**
    - Click **↓ Export** to download a formatted `.md` collaboration dossier.
