# Builder image

# FROM node:20.12-alpine AS deps

# RUN mkdir -p /sdks/core
# COPY sdks/core /sdks/core
# RUN cd /sdks/core && npm install && npm run build && npm link
# # RUN cd /app && npm link @sugar-ai/core

# RUN mkdir -p /sdks/js
# COPY sdks/js /sdks/js
# RUN cd /sdks/js && npm install && npm run build && npm link
# # RUN cd /app && npm link @sugar-ai/copilot-one-js


FROM node:20.12-alpine AS build

RUN apk add --update --no-cache curl bash git python3 make g++ vips-dev build-base

WORKDIR /app/
ARG PROJECT_NAME

# Set up npm
RUN npm install -g npm@latest

COPY apps/${PROJECT_NAME}/package.json ./

# Install dependencies using npm
RUN sed -i 's/"@sugar-ai\/copilot-one-js": "workspace:\*"/"@sugar-ai\/copilot-one-js": "0.0.42"/' package.json
RUN sed -i 's/"@sugar-ai\/core": "workspace:\*"/"@sugar-ai\/core": "0.0.8"/' package.json

# RUN npm install
RUN --mount=type=cache,id=npm,target=/root/.npm npm install --ignore-scripts
# RUN cd ../../sdks/core/ && npm install && npm run build
# RUN npm link @sugar-ai/coregs

RUN mkdir -p /sdks/core
COPY sdks/core /sdks/core
RUN cd /sdks/core && npm install && npm run build && npm link
RUN cd /app && npm link @sugar-ai/core

RUN mkdir -p /sdks/js
COPY sdks/js /sdks/js
RUN cd /sdks/js && sed -i 's/"@sugar-ai\/core": "workspace:\*"/"@sugar-ai\/core": "0.0.8"/' package.json
RUN cd /sdks/js && npm install && npm link @sugar-ai/core 
RUN cd /sdks/js && npm run build && npm link
RUN cd /app && npm link @sugar-ai/copilot-one-js


# Build
# RUN --mount=type=cache,id=npm,target=/root/.npm npm install --ignore-scripts
RUN npm install /sdks/core /sdks/js --force
COPY apps/${PROJECT_NAME}/  .

# Postinstall tasks
RUN npm run postinstall

# Move node_modules and run build
# RUN mv apps/${PROJECT_NAME}/node_modules/ node_modules_old && mv node_modules apps/${PROJECT_NAME}/
RUN npm run cibuild

# Runtime image
FROM node:20.12-alpine AS prod-build

LABEL org.opencontainers.image.authors="ankur@sugarai.dev"

ENV NODE_ENV=production
ENV PORT 80
ENV HOSTNAME 0.0.0.0
ENV NEXT_TELEMETRY_DISABLED 1
ENV PROJECT_PATH /app
ARG PROJECT_NAME


WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

RUN npm install next-runtime-env@1.7.4 --omit=optional --prefer-offline --no-audit
RUN npm install sharp

FROM prod-build as release

COPY --from=build --chown=nextjs:nodejs /app/.next/standalone/ ./
COPY --from=build --chown=nextjs:nodejs /app/next.config.mjs ./
COPY --from=build --chown=nextjs:nodejs /app/package.json ./
COPY --from=build --chown=nextjs:nodejs /app/public* ./public
COPY --from=build --chown=nextjs:nodejs /app/.next ./.next
COPY --from=build --chown=nextjs:nodejs /app/prisma ./prisma
# COPY --from=build --chown=nextjs:nodejs /app/server.js ./
COPY apps/${PROJECT_NAME}/docker .
# COPY --chown=nextjs:nodejs ./docker/entrypoint.sh /app/entrypoint.sh
# COPY --chown=nextjs:nodejs ./docker/generate-env.cjs /app/

RUN sed -i 's/"@sugar-ai\/core": "workspace:\*"/"@sugar-ai\/core": "0.0.8"/' package.json

RUN chmod +x /app/entrypoint.sh



USER root


# RUN ln -s /app/apps/${PROJECT_NAME}/server.js /app/server.js && ln -s /app/apps/${PROJECT_NAME}/.env /app/.env

EXPOSE $PORT

HEALTHCHECK --interval=5s --timeout=3s \
    CMD wget -qO- http://localhost:$PORT/ || exit 1

ENTRYPOINT [ "/app/entrypoint.sh" ]
CMD ["node", "/app/server.js"]