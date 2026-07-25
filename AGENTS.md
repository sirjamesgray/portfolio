# Agent Workflow Guidelines

## Local commits on main

- After each coherent chunk of completed work, create a **local** Git commit on `main`.
- Do not leave finished implementation uncommitted unless the user explicitly asks not to commit yet.
- Prefer committing on `main` rather than feature branches unless the user asks for a branch or PR workflow.
- **Do not push.** The user pushes all accumulated local commits when ready.
- Never force-push, open a PR, or mutate remotes unless the user explicitly asks in that turn.
- Before committing, review `git status` / `git diff` and stage only files that belong to the chunk.
- Keep commits focused: one logical concern per commit.


## Session Context

This file serves as a reference for AI agents working on this codebase. Always check here for workflow preferences and project conventions.
