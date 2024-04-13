# Builder image
FROM node:18.18-alpine AS build

RUN apk add --update --no-cache curl bash git python3 make g++ vips-dev build-base

ARG PROJECT_NAME

WORKDIR /app

# Set up pnpm
# RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm && \
#     pnpm config set store-dir .pnpm-store

RUN corepack enable && \
    corepack prepare pnpm@latest --activate && \
    pnpm --version && \
    mkdir -p /pnpm/store &&\
    pnpm config set store-dir /pnpm/store

# Enable `pnpm add --global` on Alpine Linux by setting
# home location environment variable to a location already in $PATH
# https://github.com/pnpm/pnpm/issues/784#issuecomment-1518582235
ENV PNPM_HOME=/usr/local/bin
ENV NEXT_TELEMETRY_DISABLED 1

COPY pnpm-lock.yaml .npmrc* ./
# RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm fetch

# Build
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --shamefully-hoist --frozen-lockfile --workspace-root --filter ${PROJECT_NAME}

RUN pnpm --filter ${PROJECT_NAME} postinstall
RUN mv apps/${PROJECT_NAME}/node_modules/ node_modules_old && mv node_modules apps/${PROJECT_NAME}/
RUN pnpm --filter ${PROJECT_NAME} cibuild

# Runtime image
FROM node:18-alpine AS release

LABEL org.opencontainers.image.authors="ankur@sugarai.dev"

ARG PROJECT_NAME

ENV NODE_ENV=production
ENV PORT 80
ENV HOSTNAME 0.0.0.0
ENV NEXT_TELEMETRY_DISABLED 1
ENV PROJECT_NAME ${PROJECT_NAME}
ENV PROJECT_PATH /app/apps/${PROJECT_NAME}


WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs


COPY --from=build --chown=nextjs:nodejs /app/apps/${PROJECT_NAME}/.next/standalone/ ./apps/${PROJECT_NAME}/
COPY --from=build --chown=nextjs:nodejs /app/apps/${PROJECT_NAME}/next.config.mjs ./apps/${PROJECT_NAME}/
COPY --from=build --chown=nextjs:nodejs /app/apps/${PROJECT_NAME}/package.json ./apps/${PROJECT_NAME}/
COPY --from=build --chown=nextjs:nodejs /app/apps/${PROJECT_NAME}/public* ./apps/${PROJECT_NAME}/public
COPY --from=build --chown=nextjs:nodejs /app/apps/${PROJECT_NAME}/.next/static* ./apps/${PROJECT_NAME}/.next/static
COPY --from=build --chown=nextjs:nodejs /app/apps/${PROJECT_NAME}/prisma ./apps/${PROJECT_NAME}/prisma
COPY --chown=nextjs:nodejs ./docker/entrypoint.sh /app/entrypoint.sh
COPY --chown=nextjs:nodejs ./docker/generate-env.cjs /app/apps/${PROJECT_NAME}/


RUN chmod +x /app/entrypoint.sh

RUN npm install next-runtime-env@1.x --omit=optional --prefer-offline --no-audit
# RUN npm install -g prisma@latest
RUN npm install sharp npm install

USER root

RUN ln -s /app/apps/${PROJECT_NAME}/server.js /app/server.js && ln -s /app/apps/${PROJECT_NAME}/.env /app/.env

EXPOSE $PORT

HEALTHCHECK --interval=5s --timeout=3s \
    CMD wget -qO- http://localhost:$PORT/ || exit 1

ENTRYPOINT [ "/app/entrypoint.sh" ]
CMD ["node", "/app/server.js"]