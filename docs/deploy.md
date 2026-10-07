# Deploy

Vercel deploys this repository. The project name is `jamiegray.net`. The team slug is `sirjamesgrays-projects`. The GitHub repository is `sirjamesgray/portfolio`.

A push to `main` starts a Production deploy. Production deploys use the branch `main`.

The live site is [https://www.jamiegray.net](https://www.jamiegray.net).

This repository has no GitHub Actions workflow. `vercel.json` sets the cron schedule only. It does not set a build command.

Vercel runs `npm run build`. That script runs `next build`.

Set environment names on the Vercel project before a feature depends on them. See [environment.md](environment.md).

Do not commit secret values.
