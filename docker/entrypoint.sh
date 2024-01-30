#!/bin/sh

# Set default value for SKIP_MIGRATION to true
: "${SKIP_MIGRATION:=true}"

# Capture environment variables and save to a file
env > /app/.env

# Convert SKIP_MIGRATION to lowercase
SKIP_MIGRATION_LOWER=$(echo "${SKIP_MIGRATION}" | tr '[:upper:]' '[:lower:]')

# Check if SKIP_MIGRATION is set to "false"
if [ "${SKIP_MIGRATION_LOWER}" != "false" ]; then
  echo "Skipping migrations as SKIP_MIGRATION is set to ${SKIP_MIGRATION}"
else
  # Run migrations
  echo "Running migrations..."
  cd $PROJECT_PATH 
  npx prisma migrate deploy
  cd /app/
fi

# Start your application
exec "$@"