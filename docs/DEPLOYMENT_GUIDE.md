# Venture Pulse — Vercel Deployment & Production Operations Guide
**Step-by-Step Instructions for Externally Hosting Venture Pulse**

> **Hackathon Requirement #4:** *"Your demo must be hosted and fully published externally, such as a live website or web app... Submissions that only run locally or rely on private access will not qualify."*

---

## 1. Quick Deploy with Vercel CLI or Git

### Option A: Deploy via Vercel Web Dashboard (Recommended)
1. Push your code to your public GitHub repository.
2. Go to [vercel.com/new](https://vercel.com/new) and select your repository (`venture-pulse`).
3. Under **Build and Output Settings**, keep defaults (Next.js automatically detected).
4. Under **Environment Variables**, add:
   - `QLOO_API_KEY`: Your active Qloo API key
   - `QLOO_API_BASE_URL`: `https://hackathon.api.qloo.com` (or `https://api.qloo.com`)
   - `AI_PROVIDER`: `google` (or `openai` / `sumopod`)
   - `GEMINI_API_KEY`: Your Gemini API key (if using `google`)
   - `OPENAI_API_KEY`: Your OpenAI or SumoPod API key (if using `openai` or `sumopod`)
   - `OPENAI_BASE_URL`: (Optional, if using custom endpoint like SumoPod)
5. Click **Deploy**. Vercel will build and assign a public production URL (e.g. `https://venture-pulse.vercel.app`).

### Option B: Deploy via Vercel CLI
```bash
# Install Vercel CLI if needed
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

---

## 2. Environment Variables Verification Matrix

| Variable | Required? | Production Value / Description |
| :--- | :--- | :--- |
| `QLOO_API_KEY` | **Yes** | Your Qloo Cultural AI API token |
| `QLOO_API_BASE_URL` | No | Default: `https://hackathon.api.qloo.com` |
| `AI_PROVIDER` | **Yes** | `google`, `openai`, or `sumopod` |
| `GEMINI_API_KEY` | Conditional | Required if `AI_PROVIDER=google` |
| `OPENAI_API_KEY` | Conditional | Required if `AI_PROVIDER=openai` or `sumopod` |
| `OPENAI_BASE_URL` | Conditional | Custom endpoint URL (e.g., `https://api.sumopod.com/v1`) |
| `DEFAULT_WEBHOOK_URL`| No | Default webhook testing endpoint |

---

## 3. Post-Deployment Smoke Test Checklist

Once the production deployment finishes, verify:
- [ ] **Home Page Loads:** High-end editorial styling renders properly with `Instrument Serif` and `Inter`.
- [ ] **Studio Wizard Presets:** Clicking any sample preset updates the SVG graph, debate, and CRM cards reactively.
- [ ] **Council Debate Streams:** Paced multi-agent dialogue displays Cycle 1 rejection and Cycle 2 consensus in real time.
- [ ] **Founder Intervention Bar:** Injects constraints into the debate stream.
- [ ] **Kanban Board Drag & Drop:** Cards drag smoothly between columns and recalculate total pipeline value.
- [ ] **Unit Economics Slider:** Lookbook modal recalculates GMV and royalty split live.
- [ ] **Markdown Export:** Generates and downloads the strategy dossier `.md` file.
- [ ] **Bidirectional Mode:** Toggles cleanly between Creator Mode and Brand Counter-Discovery Mode.
- [ ] **Proof Engine Modal:** Renders the DeepEval side-by-side benchmark cleanly on all screen sizes.
