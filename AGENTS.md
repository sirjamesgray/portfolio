# Agent Workflow Guidelines

## Committing Work

When completing tasks or implementing features:

1. **Commit in logical chunks** — Group related changes together with clear, descriptive commit messages
2. **Commit locally only** — Use `git commit` but DO NOT run `git push`
3. **Let the user review and push** — The user will manually review commits and push when ready

### Example workflow:
```bash
# After completing a feature or fix
git add <relevant-files>
git commit -m "Clear description of what was changed and why"

# DO NOT push - user will handle that
```

### Commit message format:
- First line: Summary of changes (50 chars or less)
- Blank line
- Detailed description if needed (wrap at 72 chars)
- Use imperative mood ("Add feature" not "Added feature")

## Session Context

This file serves as a reference for AI agents working on this codebase. Always check here for workflow preferences and project conventions.
