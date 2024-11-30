#!/usr/bin/env bash
# Exit on error
set -o errexit

echo "Starting build process..."

# Build client
echo "Building client..."
cd client
chmod +x build.sh
./build.sh

# Create server public directory if it doesn't exist
echo "Setting up server public directory..."
cd ..
mkdir -p server/public

# Move client build to server public directory
echo "Moving client build to server..."
cp -r client/build/* server/public/

# Build server
echo "Building server..."
cd server
chmod +x build.sh
./build.sh

echo "Build process complete!"

# List contents of public directory to verify
echo "Verifying public directory contents:"
ls -la public/
