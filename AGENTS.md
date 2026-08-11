# Repository Instructions

## Commands

- Install: `npm install`
- Dev server: `npm run dev`
- Typecheck: `npm run typecheck`
- Lint: `npm run lint`
- Unit tests: `npm run test`
- E2E tests: `npm run test:e2e`
- Prisma generate: `npm run db:generate`
- Migrate dev DB: `npm run db:migrate`
- Seed dev DB: `npm run db:seed`
- Production build: `npm run build`

## Conventions

- Use Next.js App Router route groups for public, auth, member, and admin areas.
- Keep server components by default; use client components only for forms, dialogs, accordions, cookie preferences, and animation.
- Validate server inputs with Zod.
- Enforce RBAC on the server, not just through hidden UI.
- Store money in integer minor units.
- Do not hard-delete packages referenced by orders.
- Keep secrets in env vars only.

## Safety Boundaries

- TWC is not a broker, exchange, trading terminal, custody provider, investment adviser, signal-generation bot, or automated trade copier.
- Do not add MT4/MT5 execution, broker login, live order placement, fabricated returns, fake win rates, or fake testimonials.
- Demo results/testimonials must remain labelled until approved production content is supplied.

## Definition of Done

- Prisma schema validates and client generates.
- `npm run typecheck`, `npm run lint`, `npm run test`, and `npm run build` pass.
- Protected data reads and mutations verify user role server-side.
- Payment state changes are derived from verified provider events, never browser input.
- Documentation is updated for env vars, migrations, payment, Telegram, deployment, backup, rollback, and limitations.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
