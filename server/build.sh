#!/usr/bin/env bash
# Exit on error
set -o errexit

echo "Installing server dependencies..."
npm install

echo "Creating public directory..."
mkdir -p public

echo "Server setup complete!"
