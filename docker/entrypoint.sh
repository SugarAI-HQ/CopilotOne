#!/bin/sh

# Capture environment variables and save to a file
env > /app/.env

# Start your application
exec "$@"
