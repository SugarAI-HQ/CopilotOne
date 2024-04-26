# Builder image
FROM node:20.12-alpine AS build

RUN apk add --update --no-cache curl bash git python3 make g++ vips-dev build-base

WORKDIR /app

# Set up npm
RUN npm install -g npm@latest

COPY package.json package-lock.json* ./

# Install dependencies using npm
RUN npm install

# Build
COPY .  .

# Postinstall tasks
RUN npm run postinstall

# Move node_modules and run build
# RUN mv apps/${PROJECT_NAME}/node_modules/ node_modules_old && mv node_modules apps/${PROJECT_NAME}/
RUN npm run cibuild

# Runtime image
FROM node:20.12-alpine AS release

LABEL org.opencontainers.image.authors="ankur@sugarai.dev"


ENV NODE_ENV=production
ENV PORT 80
ENV HOSTNAME 0.0.0.0
ENV NEXT_TELEMETRY_DISABLED 1
ENV PROJECT_PATH /app


WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=build --chown=nextjs:nodejs /app/.next/standalone/ ./
COPY --from=build --chown=nextjs:nodejs /app/next.config.mjs ./
COPY --from=build --chown=nextjs:nodejs /app/package.json ./
COPY --from=build --chown=nextjs:nodejs /app/public* ./public
COPY --from=build --chown=nextjs:nodejs /app/.next ./.next
COPY --from=build --chown=nextjs:nodejs /app/prisma ./prisma
# COPY --from=build --chown=nextjs:nodejs /app/server.js ./
COPY docker .
# COPY --chown=nextjs:nodejs ./docker/entrypoint.sh /app/entrypoint.sh
# COPY --chown=nextjs:nodejs ./docker/generate-env.cjs /app/



RUN chmod +x /app/entrypoint.sh

RUN npm install next-runtime-env@1.7.4 --omit=optional --prefer-offline --no-audit
RUN npm install sharp npm install


USER root


# RUN ln -s /app/apps/${PROJECT_NAME}/server.js /app/server.js && ln -s /app/apps/${PROJECT_NAME}/.env /app/.env

EXPOSE $PORT

HEALTHCHECK --interval=5s --timeout=3s \
    CMD wget -qO- http://localhost:$PORT/ || exit 1

ENTRYPOINT [ "/app/entrypoint.sh" ]
CMD ["node", "/app/server.js"]
