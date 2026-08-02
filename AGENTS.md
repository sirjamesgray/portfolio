# Portfolio (jamiegray.net) — AI Agent Guide

Portfolio. CRM. Design system. Payment platform. One codebase. Built end-to-end — from pixel-perfect UI to Stripe webhooks.

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

## Safety

- Never commit `.env*`, Stripe secret keys, Turnflare secrets, or credentials.
- Stage files deliberately rather than using broad staging commands.
