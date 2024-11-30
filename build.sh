#!/usr/bin/env bash
# Exit on error
set -o errexit

echo "Starting build process..."

# Build client
echo "Building client..."
cd client
chmod +x build.sh
./build.sh

# Move client build to server public directory
echo "Moving client build to server..."
cd ..
rm -rf server/public
mv client/build server/public

# Build server
echo "Building server..."
cd server
chmod +x build.sh
./build.sh

echo "Build process complete!"
