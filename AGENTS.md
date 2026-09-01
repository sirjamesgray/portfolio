# Portfolio (jamiegray.net) — AI Agent Guide

Portfolio. CRM. Design system. Payment platform. One codebase. Built end-to-end — from pixel-perfect UI to Stripe webhooks.

## Writing standard (ASD-STE100)

Use ASD-STE100 Simplified Technical English for code comments, documentation, commit messages, and API descriptions in this repo. Key rules:
- Short sentences (max 20 words for instructions, 25 for descriptions).
- One instruction per sentence. Imperative mood for steps.
- Active voice, present tense.
- Approved words only. No synonyms — one word per concept.
- Use articles (a, an, the) before nouns.
- No jargon, idioms, or colloquialisms.

**Exception:** Marketing copy, landing pages, social posts, and promotional content must NOT use ASD-STE100. Use warm, natural, human language for those instead.

## Local commits on main

- After each coherent chunk of completed work, create a **local** Git commit on `main`.
- Do not leave finished implementation uncommitted unless the user explicitly asks not to commit yet.
- Prefer committing on `main` rather than feature branches unless the user asks for a branch or PR workflow.
- **Do not push.** The user pushes all accumulated local commits when ready.
- Never force-push, open a PR, or mutate remotes unless the user explicitly asks in that turn.
- Before committing, review `git status` / `git diff` and stage only files that belong to the chunk.
- Keep commits focused: one logical concern per commit.

## CLI account routing

Use the normal `gh` and `vercel` commands with the default `sirjamesgray` profiles. This repo is not part of the Liberty Vercel team.

## Tech stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **UI**: Radix UI primitives, Tailwind CSS v4, `tw-animate-css`
- **Payments**: Stripe
- **Bot protection**: Cloudflare Turnstile (`@marsidev/react-turnstile`)
- **Animation**: Number Flow (`@number-flow/react`), Paper Design shaders (`@paper-design/shaders-react`)
- **Image processing**: Sharp

## Development

```bash
npm run dev     # dev server
npm run build   # production build
npm run start   # production server
npm run lint    # ESLint
```

## Skills dispatch

Load the matching skill for structured workflows:

| Task type | Skill |
|-----------|-------|
| Bug fix / feature / investigation | `poteto-mode` |
| Large change / migration planning | `figure-it-out` |
| Autonomous runs / decision log | `show-me-your-work` |
| Commit / PR / docs cleanup | `unslop` |
| Code walkthrough / "how" | `codebase-exploration` |
| Design rationale / "why" | `design-rationale` |
| Blast radius | `blast-radius` |
| Code review (pre-merge) | `code-review-and-quality` |
| Multi-model adversarial review | `multi-model-code-review` |
| Throwaway prototype / spike | `spike` |

## Safety

- Never commit `.env*`, Stripe secret keys, Turnflare secrets, or credentials.
- Stage files deliberately rather than using broad staging commands.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
