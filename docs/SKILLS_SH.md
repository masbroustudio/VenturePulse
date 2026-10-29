# Venture Pulse — skills.sh Integration & Registry Package Specification
**Open-Source Agent Skill Standard for the Global AI Coding Ecosystem**

---

## 1. What is skills.sh?

**[skills.sh](https://www.skills.sh/)** is the open package registry and directory for AI coding agents (Claude Code, Cursor, Codex, Windsurf, Antigravity). Often described as *"npm for agent skills"*, it allows AI agents to dynamically install modular, standardized task instructions defined by the **`SKILL.md`** specification.

By packaging Venture Pulse's cultural intelligence tools into the `skills.sh` format, **we make Qloo's 250M+ Taste Graph accessible to any AI coding agent in the world**.

---

## 2. Installation via `skills.sh`

Once published, any developer or AI agent can equip their environment with Venture Pulse using the standard CLI:

```bash
# Install the Venture Pulse skill into any agent runtime
npx skills add <your-github-username>/venture-pulse

# Or browse in the interactive registry
npx skills find qloo
```

---

## 3. Directory Layout in this Repository

```
.skills/
└── qloo-venture-pulse/
    ├── SKILL.md              # Main agent instruction & tool declaration file
    ├── schemas/
    │   └── skills.json       # JSON Schema definitions for all 6 tool contracts
    └── references/
        └── qloo_endpoints.md # Reference guide for Qloo Taste Graph routes
```

---

## 4. How Coding Agents Use This Skill

When an AI agent (such as Antigravity, Claude Code, or Cursor) loads `.skills/qloo-venture-pulse/SKILL.md`, it gains the autonomous ability to:
1. Parse creative media and aesthetic anchors from user prompts.
2. Resolve entities against Qloo's Taste Graph.
3. Compute cross-domain affinities between creators and brands.
4. Synthesize limited-edition merchandise drops with verified commercial appeal.
5. Export structured CRM cards and outreach pitch decks.

---

## 5. Publishing Checklist for `skills.sh`

1. [x] Create valid `SKILL.md` with standard YAML frontmatter (`name`, `description`, `version`, `author`).
2. [x] Provide concrete JSON input/output schemas for tool calls.
3. [x] Include sample inputs and deterministic fallback examples.
4. [x] Commit to the public GitHub repository root.
5. [x] Register on [skills.sh](https://www.skills.sh/) via GitHub release tag.
