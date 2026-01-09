# Agent Instructions (Exploratory Mode)

This repository is in exploratory mode. Propose improvements proactively, but keep changes explicit, minimal, and easy to review.

## Principles

When in doubt:
- propose, don't impose
- explain, don't assume
- minimal viable change first

## Scope of Work

- You MAY suggest improvements outside the immediate task if clearly beneficial.
- You MUST separate:
  - changes required to solve the task
  - optional / exploratory improvements
- If requirements are ambiguous, propose options instead of implementing them.

## Change Policy (Hard Constraints)

- DO NOT apply large refactors silently.
- DO NOT rename files or modules without explanation.
- DO NOT reformat unrelated code.
- DO NOT change dependency versions unless necessary and explicitly requested.
- Avoid breaking public APIs unless explicitly requested.

## Security and Secrets (Hard Constraints)

- Never commit secrets, OAuth tokens, or credentials.
  - `.env` and `token.json` MUST remain git-ignored.
- Do not log raw error objects that may contain secrets/tokens; log safe messages only.
- Prefer passing secrets via process environment rather than CLI args; document tradeoffs when CLI args are used.

## Validation

Before declaring a task complete:
- Run `npm run build`.
- If runtime behavior changed, ensure `README.md` is updated accordingly.

## Communication

- Be explicit about assumptions.
- Keep explanations short, with bullets and concrete examples.
- After any larger change, propose a small README update that helps future contributors.

## Comments and Language

- Repository content and code comments SHOULD be in English.
- Avoid mandatory “comment-everything” rules; prefer self-explanatory code.
- Add short JSDoc comments when it clarifies inputs/outputs or non-obvious behavior (especially for exported functions and cross-module APIs).
