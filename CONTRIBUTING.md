# Contributing to Venture Pulse

Thank you for your interest in contributing to **Venture Pulse**! We welcome open-source contributions from developers, designers, and cultural data researchers.

---

## 🛠️ Local Development Setup

1. **Fork and clone the repository:**
   ```bash
   git clone https://github.com/your-username/venture-pulse.git
   cd venture-pulse
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure your local environment:**
   ```bash
   cp .env.example .env.local
   ```
   Add your `QLOO_API_KEY` and LLM credentials.

4. **Start the local development server:**
   ```bash
   npm run dev
   ```

---

## 📜 Coding Guidelines

- **TypeScript:** Strict type checking is enabled. All data models must match [docs/ERD.md](file:///C:/dev/QlooAgent/docs/ERD.md).
- **Agent Skills:** Any new agent tools must follow the Zod schema validation pattern specified in [docs/AGENT_SKILLS.md](file:///C:/dev/QlooAgent/docs/AGENT_SKILLS.md).
- **Design System:** Follow the A24/Hypebeast editorial guidelines in [docs/UI_DESIGN_SYSTEM.md](file:///C:/dev/QlooAgent/docs/UI_DESIGN_SYSTEM.md). All new components must be **Mobile-Responsive First**.
- **Security:** Never commit API keys or sensitive data. Always ensure `.env*` remains untracked.

---

## 🤝 Pull Request Process

1. Create a feature branch: `git checkout -b feat/your-feature-name`
2. Commit your changes: `git commit -m "feat: add your feature"`
3. Push to your fork: `git push origin feat/your-feature-name`
4. Open a Pull Request with a clear description and screenshots/GIFs of the UI changes.

Thank you for helping empower independent creators with cultural intelligence!
