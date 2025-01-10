#!/bin/bash

# Exit on error
set -e

echo "Starting build process..."

# Clean up old build
rm -rf dist
mkdir -p dist

echo "Creating directory structure..."
mkdir -p dist/css
mkdir -p dist/js

echo "Copying static assets..."
# Copy CSS files
cp -r css/* dist/css/ 2>/dev/null || true

# Copy JS files
cp -r js/* dist/js/ 2>/dev/null || true

echo "Copying index.html..."
cp index.html dist/

echo "Copying _headers..."
cp _headers dist/

echo "Copying _routes.json..."
cp _routes.json dist/

echo "Build completed successfully!"
