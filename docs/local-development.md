# Local development

## Requirements

Use Node.js 20 or later.
Use npm.

## Start the app

1. Clone the repository.
2. Run `npm install`.
3. Create `.env.local` in the repo root.
4. Add the names from [environment.md](environment.md). Put values only in that file.
5. Run `npm run dev`.

The dev server listens on port 3103.
Open `http://localhost:3103`.

## Other commands

Run `npm run lint` to lint the app.
Run `npm run build` to build the app.
Run `npm run start` to serve a production build.

## Local scripts

These files are not npm scripts.

`scripts/run-migration.ts` reads `DATABASE_URL`.
`scripts/seed-test-data.ts` reads `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
`scripts/cleanup-opted-out.ts` reads the same two Supabase names.

## Dev login

Set `ENABLE_DEV_LOGIN` to `true` in `.env.local`.
Set `NEXT_PUBLIC_DEV_LOGIN_ENABLED` to `true` in `.env.local`.
The dev login route rejects the call when `NODE_ENV` is not `development`.
