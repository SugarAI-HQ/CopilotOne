# Stage 1: Dependencies Image
FROM node:20.12-alpine AS deps

RUN mkdir -p /sdks/core /npms
COPY sdks/core /sdks/core
RUN cd /sdks/core && npm install && npm run build && npm pack --pack-destination /npms

RUN mkdir -p /sdks/js
COPY sdks/js /sdks/js
RUN cd /sdks/js && sed -i 's/"@sugar-ai\/core": "workspace:\*"/"@sugar-ai\/core": "file:\/npms\/sugar-ai-core-0.0.9.tgz"/' package.json
# RUN cd /sdks/js && npm uninstall @sugar-ai/core && npm install /npms/sugar-ai-core-0.0.9.tgz
RUN cd /sdks/js && npm install
RUN cd /sdks/js && npm run build && npm pack --pack-destination /npms


# Stage 2: Build Image
FROM node:20.12-alpine AS build

# Install system dependencies
RUN apk add --update --no-cache curl bash git python3 make g++ vips-dev build-base

# Set up npm and link packages
WORKDIR /app/
ARG PROJECT_NAME
RUN npm install -g npm@latest
RUN curl -sL https://sentry.io/get-cli/ | sh


# Optimisation doesnot works on github actions due to lack of caching
# # Copy and install app dependencies
# COPY apps/${PROJECT_NAME}/package.json ./
# RUN sed -i 's/"@sugar-ai\/copilot-one-js": "workspace:\*"/"@sugar-ai\/copilot-one-js": "0.0.42"/' package.json
# RUN sed -i 's/"@sugar-ai\/core": "workspace:\*"/"@sugar-ai\/core": "0.0.8"/' package.json
# RUN --mount=type=cache,id=npm,target=/root/.npm npm install --ignore-scripts

# Copy rest of the code
COPY apps/${PROJECT_NAME}/  .

# Add latest npm dependencies
RUN mkdir -p /npms
COPY --from=deps --chown=nextjs:nodejs /npms /npms
RUN sed -i 's/"@sugar-ai\/copilot-one-js": "workspace:\*"/"@sugar-ai\/copilot-one-js": "file:\/npms\/sugar-ai-copilot-one-js-0.0.46.tgz"/' package.json
RUN sed -i 's/"@sugar-ai\/core": "workspace:\*"/"@sugar-ai\/core": "file:\/npms\/sugar-ai-core-0.0.9.tgz"/' package.json
RUN --mount=type=cache,id=npm,target=/root/.npm npm install --ignore-scripts

RUN npm run postinstall
RUN npm run cibuild

# Stage 3: Production Image
FROM node:20.12-alpine AS prod-build

LABEL org.opencontainers.image.authors="ankur@sugarai.dev"

ENV NODE_ENV=production
ENV PORT 80
ENV HOSTNAME 0.0.0.0
ENV NEXT_TELEMETRY_DISABLED 1
ENV PROJECT_PATH /app
ARG PROJECT_NAME

# Set working directory
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Install runtime dependencies
RUN npm install next-runtime-env@1.7.4 --omit=optional --prefer-offline --no-audit
RUN npm install sharp

# Stage 4: Release Image
FROM prod-build as release

# Copy built files from build stage
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone/ ./
COPY --from=build --chown=nextjs:nodejs /app/next.config.mjs ./
COPY --from=build --chown=nextjs:nodejs /app/package.json ./
COPY --from=build --chown=nextjs:nodejs /app/public* ./public
COPY --from=build --chown=nextjs:nodejs /app/.next ./.next
COPY --from=build --chown=nextjs:nodejs /app/prisma ./prisma

# Copy additional files needed for production
COPY apps/${PROJECT_NAME}/docker .
RUN sed -i 's/"@sugar-ai\/core": "workspace:\*"/"@sugar-ai\/core": "0.0.8"/' package.json
RUN chmod +x /app/entrypoint.sh

# Set user permissions and expose port
USER root
EXPOSE $PORT

# Healthcheck and entrypoint setup
HEALTHCHECK --interval=5s --timeout=3s CMD wget -qO- http://localhost:$PORT/ || exit 1
ENTRYPOINT [ "/app/entrypoint.sh" ]
CMD ["node", "/app/server.js"]
