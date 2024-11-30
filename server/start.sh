#!/usr/bin/env bash
# Exit on error
set -o errexit

echo "Starting server in production mode..."

# Ensure we're in the server directory
cd "$(dirname "$0")"

# Start the server
NODE_ENV=production node server.js
