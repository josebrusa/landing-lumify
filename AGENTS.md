# Repo Notes For OpenCode Agents

## Package Manager

- Use `pnpm` (pinned via `package.json` `packageManager: pnpm@11.1.3`). Run `corepack enable` once per machine.
- pnpm v11 blocks dependency build scripts by default; this repo explicitly allows `esbuild` via `pnpm-workspace.yaml` `allowBuilds`. If installs fail with `ERR_PNPM_IGNORED_BUILDS`, check that file.

## Commands (Source Of Truth: `package.json`)

- Install: `pnpm install`
- Dev: `pnpm run dev` (Vite on `http://localhost:5173`)
- Build: `pnpm run build` (runs `vue-tsc -b` then `vite build`)
- Preview build: `pnpm run preview` (Vite preview)
- Tests: `pnpm test` (Jest)
- Single test: `pnpm test -- <pattern>` (Jest forwards args)

## Environment / Deploy Gotchas

- API base is `VITE_API_BASE_URL` (without trailing `/api`; client appends `/api`). If unset, runtime falls back to same-origin `/api`.
- Netlify builds fail fast if `VITE_API_BASE_URL` is missing: enforced by a custom Vite plugin in `vite.config.ts` when `NETLIFY=true`.

## App Entry Points

- SPA entry: `src/main.ts` mounts `src/App.vue`.
- Router wiring + auth/admin guards live in `src/router/index.ts`.
- Axios client + auth token handling is in `src/api/client.ts` and `src/api/auth-token`.

## Docker

- Dev in Docker: `docker compose up --build` (service `app`, port `5173`, bind mount source).
- Preview in Docker: `docker compose --profile preview up --build` (service `preview`, port `4173`).
