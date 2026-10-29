# Venture Pulse — UI Design System & Editorial Styling Specification
**High-End Cultural Editorial Luxury Aesthetic (Monocle / SSENSE / Stripe Press Style) — Mobile-First**

---

## 1. Design Philosophy

Venture Pulse is an AI agent for **culture, taste, and aesthetics**. Its user interface must reflect the cultural intelligence it possesses. Rather than looking like a generic SaaS template or basic dashboard, Venture Pulse is crafted as a **high-end cultural editorial publication**:

* **Warm Gallery Light Canvas:** Built on warm editorial paper whites (`#fbfbfa` base, `#ffffff` elevated cards) with razor-sharp hairline borders (`#e4e4e7`) that allow cultural entities and collaboration lookbooks to breathe.
* **Typographic Contrast:** Bold, artistic editorial serif headings (`Instrument Serif`) paired with crisp grotesque typography (`Inter` / `Geist`) and monospaced telemetry metrics (`JetBrains Mono`).
* **Visual Data Density:** Interactive SVG/Canvas **Cultural Taste Graph** visualizers, a live **LangGraph Multi-Agent DAG**, SVG radial affinity gauges, and magazine-grade lookbook posters.
* **Instant Light/Dark Mode:** Defaults to a striking light editorial gallery theme, with an instant toggle to dark studio mode for low-light environments.
* **Mobile-Responsive First:** Fluid layout scaling seamlessly from single-column swipeable cards and bottom-sheet drawers on mobile to multi-column editorial spreads and Kanban boards on desktop.

---

## 2. Typography System

Powered by `next/font/google`:

| Role | Font Family | Style / Weight | Usage |
| :--- | :--- | :--- | :--- |
| **Editorial Display** | `Instrument Serif` | Italic & Regular (400) | Hero mastheads, section titles, brand collab names, pull quotes, lookbook headlines |
| **Body & UI** | `Geist Sans` / `Inter` | Regular (400), Medium (500), Bold (700) | Studio wizard forms, debate transcript dialogue, pitch text, navigation |
| **Metrics & Telemetry** | `Geist Mono` / `JetBrains Mono` | Medium (500), Bold (700) | Qloo affinity scores (e.g. `7.8x`), deal sizes, timestamps, code, LangFuse traces |

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

### 3.2 Dark Studio Mode (Optional Toggle)
```css
.dark {
  --bg-canvas: #09090b;          /* Pure Noir */
  --bg-surface: #121215;         /* Studio Charcoal */
  --bg-subtle: #18181b;          /* Elevated Surface */
  --text-ink: #fafafa;           /* Stark White */
  --text-muted: #a1a1aa;         /* Chalk Grey */
  --border-hairline: #27272a;    /* Hairline Dark Border */
  --accent-gold: #fbbf24;        /* Luminous Gold */
  --accent-citron: #e2f952;      /* A24 Acid-Citron Highlight */
}
```

---

## 4. Key Component Anatomy

### 4.1 Interactive Cultural Taste Graph Visualizer
- Canvas/SVG network showing the creator node connected to multi-domain entities (Music, Cinema, Fashion, Tech, Culinary).
- Dynamic affinity link weights with pulse animations on high-affinity edges.
- Click node to inspect resolved Qloo entity metadata and taxonomy tags.

### 4.2 LangGraph Multi-Agent State Machine DAG
- Horizontal step-by-step node graph:
  `IntakeNode` $\rightarrow$ `QlooTasteNode` $\rightarrow$ `AnalystNode` $\leftrightarrow$ `StrategistNode` $\leftrightarrow$ `DirectorNode` $\rightarrow$ `DeepEvalNode` $\rightarrow$ `SupabaseNode`.
- Visual badges for active execution status, cycle counts, and consensus confidence percentage.

### 4.3 Brand CRM Pipeline Card (Lookbook Style)
- Top: Domain badge (e.g. *Luxury Apparel*), Brand monogram, and SVG radial affinity dial (`⚡ 7.8x`).
- Center: Product drop title in *Instrument Serif* italic with aesthetic summary.
- Bottom: Deal tier badge (`$14.5k Mid`), verified safety tag (`Safe 98/100`), and quick-move stage button.

### 4.4 Editorial Lookbook & Contract Term Sheet Modal
- Left page: Magazine editorial lookbook spread with physical product photography framing, material swatch tokens, serialization badge (`001/500`), and retail price.
- Right page: Commercial deal term sheet (guaranteed fee, royalty rate) and personalized cold outreach pitch letter with empirical Qloo citations.

### 4.5 DeepEval & Ragas Benchmark Lab Modal
- Quantitative scorecard comparing Vanilla LLM vs. Venture Pulse:
  - **Faithfulness Score:** 96% vs 34%
  - **Cultural Groundedness Score:** 98% vs 18%
  - **Hallucination Rate:** 2% vs 78%
- Direct side-by-side prompt and output inspection.
