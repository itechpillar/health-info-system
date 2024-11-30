#!/usr/bin/env bash
# Exit on error
set -o errexit

echo "Installing client dependencies..."
npm install

echo "Building client..."
npm run build

echo "Client build complete!"
