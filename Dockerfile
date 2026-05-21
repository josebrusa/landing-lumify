FROM node:24-alpine AS base

WORKDIR /app

# Enable Corepack so the project-pinned pnpm version is used.
RUN corepack enable

FROM base AS deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM deps AS build

COPY . .
RUN pnpm run build

FROM base AS preview

ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 4173
CMD ["pnpm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "4173"]
