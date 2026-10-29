# Venture Pulse — Interactive UI Prototype Guide
**High-End Editorial Luxury Prototype (`design/index.html`)**

This folder contains a fully interactive, self-contained HTML/CSS/JS prototype of **Venture Pulse** built with:
- **Tailwind CSS (CDN)** with dark studio styling (`#09090b` noir, `#121215` studio, `#18181b` surface)
- **Google Fonts:** `Instrument Serif` (editorial italic headings) + `Inter` (body) + `JetBrains Mono` (metrics/code)
- **Mobile-Responsive First Layout:** Single-column fluid view on mobile, multi-column editorial spread on desktop.

---

## 🖥️ How to View & Test in Your Browser

You can open this file directly in any web browser without running any build server:

### Option A: Double-Click
Simply navigate to `C:\dev\QlooAgent\design\index.html` in File Explorer and double-click to open in Chrome, Edge, or Brave.

### Option B: PowerShell Command
```powershell
Start-Process "C:\dev\QlooAgent\design\index.html"
```

---

## 🧭 Interactive Flows & Screens Included

1. **Top Global Navigation:**
   - Click **1. Studio Intake**, **2. Council Debate**, or **3. Brand CRM Board** to jump between views.
   - Click the **"Proof Engine"** button to open the side-by-side comparison modal.
   - Click **"Export"** to simulate downloading the Markdown dossier.

2. **Screen 1: Studio Intake Wizard (`#view-wizard`)**
   - Click any of the **3 Evaluator Presets** (Cyberpunk Gaming, Wellness Podcast, Visual Arts) to instantly auto-fill the form with aesthetic and cultural anchors.
   - Click **"Launch Multi-Agent Council Debate"** to advance to the debate terminal.

3. **Screen 2: Multi-Agent Council Debate (`#view-debate`)**
   - Watch the live dialogue between **Cultural Analyst** (Qloo 600M+ Taste Graph), **Brand Strategist** (market feasibility & sizing), and **Creative Director** (physical concept & packaging).
   - Click **"Fast-Forward to Consensus"** to jump to the consensus banner.
   - Click **"Enter Brand CRM Board"** to advance to the pipeline view.

4. **Screen 3: Brand CRM Kanban Board (`#view-kanban`)**
   - 4 Pipeline columns: **Discovered**, **Vetted**, **Pitch Ready**, and **Dispatched**.
   - Cards display Qloo affinity multipliers (e.g. `⚡ 7.8x Affinity`) and deal tiers.
   - Click on any card to open the **Poster & Pitch Inspector Modal**.

5. **Modal 1: Poster & Outreach Pitch Inspector (`#modal-poster`)**
   - Inspect the limited-edition physical merchandise concept (unit run, packaging spec, retail price).
   - Review and copy the cold outreach pitch email containing the empirical Qloo citation.
   - Click **"Dispatch to CRM"** to trigger a simulated HubSpot webhook call with instant toast confirmation.

6. **Modal 2: "Proof of Difference" Engine (`#modal-proof`)**
   - Side-by-side comparison of **Vanilla LLM (cliché t-shirts & mugs)** vs. **Venture Pulse (Qloo-grounded subcultural collaboration)**.
