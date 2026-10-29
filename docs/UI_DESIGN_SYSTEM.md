# Venture Pulse — UI Design System & Editorial Styling Specification
**High-End Cultural Editorial Luxury Aesthetic (A24 / SSENSE / Stripe Press Style) — Mobile-First**

---

## 1. Design Philosophy

Venture Pulse is an AI agent for **culture, taste, and aesthetics**. Its user interface must reflect the cultural intelligence it possesses. Rather than looking like a generic SaaS template or basic dashboard, Venture Pulse is crafted as a **high-end cultural editorial publication**:

* **Warm Gallery Light Canvas:** Built on warm editorial paper whites (`#fbfbfa` base, `#ffffff` elevated cards) with razor-sharp hairline borders (`#e4e4e7`) that allow cultural entities and collaboration lookbooks to breathe.
* **Typographic Contrast:** Bold, artistic editorial serif headings (`Instrument Serif`) paired with crisp grotesque typography (`Inter`) and monospaced telemetry metrics (`JetBrains Mono`).
* **Visual Data Density:** Interactive SVG **Cultural Taste Graph** visualizers with multi-hop path inspectability, a live **LangGraph Multi-Agent DAG**, SVG radial affinity gauges, and magazine-grade lookbook posters.
* **Instant Light/Dark Mode:** Defaults to a striking light editorial gallery theme, with an instant toggle (`T`) to dark studio mode for low-light environments.
* **True State Fluidity & Reactivity:** Every input, preset selection, and drag-and-drop event instantly ripples through all views via a centralized `APP_STATE` store.
* **Mobile-Responsive First:** Fluid layout scaling seamlessly from single-column swipeable cards on mobile to multi-column editorial spreads and Kanban boards on desktop.

---

## 2. Typography System

Powered by Google Fonts:

| Role | Font Family | Style / Weight | Usage |
| :--- | :--- | :--- | :--- |
| **Editorial Display** | `Instrument Serif` | Italic & Regular (400) | Hero mastheads, section titles, brand collab names, pull quotes, lookbook headlines |
| **Body & UI** | `Inter` | Regular (400), Medium (500), Bold (700) | Studio wizard forms, debate transcript dialogue, pitch text, navigation |
| **Metrics & Telemetry** | `JetBrains Mono` | Medium (500), Bold (700) | Qloo affinity scores (e.g. `7.8x`), deal sizes, timestamps, code, LangFuse traces |

---

## 3. Color Palette & Design Tokens

### 3.1 Primary Light Theme (Default: Editorial Paper & Ink)
```css
:root {
  /* Editorial Light Canvas */
  --bg-canvas: #fbfbfa;          /* Warm Gallery Paper */
  --bg-surface: #ffffff;         /* Pure White Card */
  --bg-subtle: #f4f4f0;          /* Subtle Chalk Grey Surface */
  --text-ink: #09090b;           /* Deep Charcoal Ink */
  --text-muted: #71717a;         /* Editorial Muted Grey */
  --border-hairline: #e4e4e7;    /* Precise 1px Hairline */

  /* Cultural Accents */
  --accent-terracotta: #ea580c;  /* Warm Cultural Heritage Accent */
  --accent-gold: #d97706;        /* High-Affinity Cultural Gold */
  --accent-citron: #65a30d;      /* Editorial Olive/Citron Badge */
  --accent-emerald: #059669;     /* Brand Safety Green */
  --accent-cyan: #0284c7;        /* Taste Graph Explorer Cyan */
}
```

### 3.2 Dark Studio Mode (Toggle: Key `T`)
```css
.dark {
  --bg-canvas: #09090b;          /* Pure Noir */
  --bg-surface: #121215;         /* Studio Charcoal */
  --bg-subtle: #18181b;          /* Elevated Surface */
  --text-ink: #fafafa;           /* Stark White */
  --text-muted: #a1a1aa;         /* Chalk Grey */
  --border-hairline: #27272a;    /* Hairline Dark Border */
  --accent-gold: #fbbf24;        /* Luminous Gold */
  --accent-terracotta: #ea580c;  /* Vibrant Terracotta */
}
```

---

## 4. Keyframe Animations & Micro-Interactions

```css
/* Smooth View Transitions */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes scaleUp {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes pulse-edge {
  0% { stroke-dashoffset: 24; }
  100% { stroke-dashoffset: 0; }
}

.animate-fade-in { animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.animate-scale-up { animation: scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.animate-edge { stroke-dasharray: 4, 4; animation: pulse-edge 1.2s linear infinite; }

/* Drag and Drop States */
.kanban-col.drag-over {
  background-color: rgba(234, 88, 12, 0.06);
  border-color: #ea580c;
}
.kanban-card.dragging {
  opacity: 0.4;
  transform: scale(0.98);
}
```

---

## 5. Key Component Anatomy

### 5.1 Interactive Cultural Taste Graph Visualizer
- SVG network mapping central creator/brand nodes to category satellites and high-affinity brand targets.
- Animated pulsing edges reflecting relative affinity weight.
- Multi-hop path inspector showing canonical Qloo URNs, negative anti-affinity guardrails, and top geographic clusters.

### 5.2 LangGraph Multi-Agent State Machine DAG
- Step-by-step state tracker with animated pulses on the active agent node (`IntakeNode` $\rightarrow$ `QlooTasteNode` $\rightarrow$ `AnalystNode` $\leftrightarrow$ `StrategistNode` $\leftrightarrow$ `DirectorNode` $\rightarrow$ `DeepEvalNode` $\rightarrow$ `SupabaseNode`).
- Live cycle counter (`Cycle 1 / 2` $\rightarrow$ `Cycle 2 / 2`) and synergy meter (`71%` $\rightarrow$ `94%`).

### 5.3 Brand CRM Pipeline Card (HTML5 Drag-and-Drop)
- Header: Domain badge, brand name, and empirical affinity multiplier dial (`⚡ 7.8x`).
- Center: Product drop title in *Instrument Serif* italic with aesthetic summary.
- Footer: Deal tier badge, inspect spec link, and quick-move stage advancement buttons.

### 5.4 Editorial Lookbook & Contract Term Sheet Modal
- Left page: Magazine spread featuring edition run size, retail pricing, packaging specs, and the **Interactive Unit Economics & Royalty Simulator** (live GMV & 18% royalty calculation).
- Right page: Commercial pitch term sheet, one-click pitch copy, and direct CRM webhook dispatching.

### 5.5 DeepEval & Ragas Benchmark Lab Modal
- Quantitative scorecard comparing Vanilla LLM vs. Venture Pulse:
  - **Faithfulness Score:** 96.2% vs. 34.1%
  - **Cultural Groundedness Score:** 98.4% vs. 18.0%
  - **Hallucination Resistance:** 98.0% vs. 22.0%
- Direct side-by-side prompt and output inspection.
