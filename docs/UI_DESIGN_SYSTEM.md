# Venture Pulse — UI Design System & Editorial Styling Specification
**High-End Cultural Editorial Aesthetic (A24 / Hypebeast / SSENSE Style) — Mobile-First**

---

## 1. Design Philosophy

Venture Pulse is an AI agent for **culture, taste, and aesthetics**. Its user interface must reflect the cultural intelligence it possesses. Rather than looking like a generic SaaS template or dashboard boilerplate, Venture Pulse is crafted as a **high-end cultural editorial magazine**:

* **Stark Contrast & Space:** Clean, gallery-grade monochrome layouts that let the cultural entities and collaboration mockups command attention.
* **Typographic Contrast:** Bold, artistic editorial serif headings paired with razor-sharp monospaced data metrics.
* **Poster-Grade Product Cards:** Collab deliverables styled like limited-edition drop posters (specifying unit run, materials, aesthetic motifs, and affinity multipliers).
* **Mobile-Responsive First:** Fluid layout that transitions seamlessly from single-column swipeable cards on mobile to multi-column editorial spreads and Kanban boards on desktop.

---

## 2. Typography System

Powered by `next/font/google`:

| Role | Font Family | Style / Weight | Usage |
| :--- | :--- | :--- | :--- |
| **Editorial Display** | `Instrument Serif` | Italic & Regular (400) | Hero titles, section headers, brand collab names, pull quotes |
| **Body & UI** | `Geist Sans` / `Inter` | Regular (400), Medium (500), Bold (700) | Studio wizard forms, debate transcript dialogue, pitch text |
| **Metrics & Badges** | `Geist Mono` / `JetBrains Mono` | Medium (500), Bold (700) | Qloo affinity scores (e.g. `7.8x`), deal sizes, timestamps, code |

---

## 3. Color Palette & Tokens

```css
:root {
  /* Editorial Monochrome Base */
  --bg-primary: #09090b;       /* Pure Noir */
  --bg-card: #121215;          /* Studio Charcoal */
  --bg-surface: #18181b;       /* Elevated Border Surface */
  --text-primary: #fafafa;     /* Stark White */
  --text-muted: #a1a1aa;       /* Chalk Grey */
  --border-subtle: #27272a;    /* Hairline Border */

  /* Cultural Pulse Accent */
  --pulse-gold: #fbbf24;       /* High-Affinity Cultural Gold */
  --pulse-citron: #e2f952;     /* A24 Acid-Citron Highlight */
  --badge-bg: rgba(251, 191, 36, 0.1);
  --badge-border: rgba(251, 191, 36, 0.25);
}
```

---

## 4. Mobile-First Responsive Breakpoints

| Breakpoint | Viewport | Layout Adaptations |
| :--- | :--- | :--- |
| **Mobile (`< 768px`)** | 375px – 767px | Single-column vertical flow. Accordion-style wizard. Horizontally scrollable Kanban stages with swipe snap. Bottom sheet for pitch inspection. |
| **Tablet (`768px - 1024px`)** | 768px – 1023px | 2-column editorial grid. Sticky debate status header. Split view for "Proof Engine". |
| **Desktop (`> 1024px`)** | 1024px+ | Full 4-column drag-and-drop Kanban board. Side-by-side live debate terminal and poster preview. |

---

## 5. Component Style Guide

### 5.1 The Studio Wizard
- Minimalist, numbered 3-step carousel with micro-pill selectors.
- 1-click **"Sample Studio Presets"** bar pinned at the top for instant judge evaluation.

### 5.2 The Multi-Agent Council Terminal
- Designed as a chic recording studio / control room terminal.
- Sub-agent avatars:
  - 🕵️ **Cultural Analyst:** Cyan indicator pulse.
  - 📈 **Brand Strategist:** Emerald indicator pulse.
  - 🎨 **Creative Director:** Amber / Gold indicator pulse.
- Real-time animated typing cursor and live collapsible tool-call JSON drawers.

### 5.3 The Brand Target Card (Poster View)
- Top bar: Brand Name + Domain Badge + `⚡ 7.8x Affinity` Pill.
- Center: Product Title (in *Instrument Serif*) + Aesthetic Description.
- Footer: Deal Sizing Tier (`$5k-$20k`) + "View Pitch" / "Dispatch" Action Buttons.

### 5.4 The Proof Engine Modal
- Split 50/50 layout:
  - **Left (Vanilla LLM):** Faded grey background, red "Culturally Ungrounded" badge, showing generic t-shirts/mugs.
  - **Right (Venture Pulse):** Dark studio background, gold "Qloo Taste Graph Grounded" badge, showing empirical affinity path and limited-edition product concept.
