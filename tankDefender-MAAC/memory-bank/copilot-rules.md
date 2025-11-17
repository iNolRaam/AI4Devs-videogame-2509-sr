
## 🚀 Architecture and design

- You must use the clean architecture + DDD patterns.
 - Use TDD practices.
 - Use Javascript, HTML5, CSS and Phaser 3 best practices.
- You must follow the SOLID principles, KISS, and YAGNI principles.

## ✅ Coding conventions
- Use English for code, comments, commit messages, and documentation.

## 📁 Project structure

- Monorepo.

## 🚨 Never Upload Secrets

- Do not store API keys or `.env` in repo.
- Use `.env.example` with placeholders.
- If a secret is leaked: rotate credentials, purge history, notify team.

## 🧭 Documentation & Memory Bank

- Update Memory Bank when context changes, after notable commits, or when requested.
- Prioritize `activeContext.md` and `progress.md` during active work.
- Keep documentation concise, actionable, and in English.

## 🧩 Kiro‑Lite Workflow (Phased)
- Respect slash commands; do not skip phases.
- Phases: PRD Intake → Design → Task Breakdown → Code Generation.
- Commands: `/start feature <name>`, `/approve prd`, `/approve design`, `/approve tasks`, `/implement <TASK_ID>`, `/review complete`, `/update memory bank`.

## 📚 Sources of Truth
- Always load these before planning or acting:
	- PRD: `tankDefender-MAAC/prd.md`
	- GDD: `tankDefender-MAAC/gdd.md`
	- User Stories: `tankDefender-MAAC/user-stories.md`
	- Plus all files under `tankDefender-MAAC/memory-bank/`
