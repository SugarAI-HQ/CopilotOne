#!/bin/bash -xe

# Set environment variables
NODE_VERSION="20.12-alpine"
PROJECT_NAME=$1 # Pass the project name as an argument to the script
NPM_PACKAGES_PATH="$PWD/npms"
PORT=80
HOSTNAME="0.0.0.0"
NEXT_TELEMETRY_DISABLED=1

# Stage 1: Dependencies Image
echo "=== Stage 1: Building SDK Dependencies ==="
mkdir -p $NPM_PACKAGES_PATH

# Core SDK setup
cd sdks/core
npm install
npm run build
npm pack --pack-destination $NPM_PACKAGES_PATH
cd ../..

# JS SDK setup
cd sdks/js
# sed -i 's/"@sugar-ai\/core": "workspace:\*"/"@sugar-ai\/core": "file:/npms\/sugar-ai-core-0.0.9.tgz"/' package.json
sed -i "s|\"@sugar-ai/core\": \"workspace:\*\"|\"@sugar-ai/core\": \"file:${NPM_PACKAGES_PATH}/sugar-ai-core-0.0.9.tgz\"|" package.json
npm install
npm run build
npm pack --pack-destination $NPM_PACKAGES_PATH
cd ../..

# Stage 2: Build Image
echo "=== Stage 2: Building Application ==="

# Copy and install app dependencies
cd apps/factory

# Use dependencies from Stage 1
# sed -i 's/"@sugar-ai\/copilot-one-js": "workspace:\*"/"@sugar-ai\/copilot-one-js": "file:\/npms\/sugar-ai-copilot-one-js-0.0.46.tgz"/' package.json
sed -i "s|\"@sugar-ai/copilot-one-js\": \"workspace:\*\"|\"@sugar-ai/copilot-one-js\": \"file:${NPM_PACKAGES_PATH}/sugar-ai-copilot-one-js-0.0.46.tgz\"|" package.json
# sed -i 's/"@sugar-ai\/core": "workspace:\*"/"@sugar-ai\/core": "file:\/npms\/sugar-ai-core-0.0.9.tgz"/' package.json
sed -i "s|\"@sugar-ai/core\": \"workspace:\*\"|\"@sugar-ai/core\": \"file:${NPM_PACKAGES_PATH}/sugar-ai-core-0.0.9.tgz\"|" package.json
npm install --ignore-scripts

# Build the application
npm run postinstall
npm run cibuild