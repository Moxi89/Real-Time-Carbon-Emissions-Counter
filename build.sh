#!/bin/bash
set -e

echo "Starting build process..."

# Clean and create dist directory
rm -rf dist
mkdir -p dist

echo "Creating directory structure..."
mkdir -p dist/css
mkdir -p dist/js

echo "Copying files..."
# Copy main files
cp index.html dist/
cp _headers dist/
cp _routes.json dist/
cp static/favicon.png dist/

# Copy CSS and JS
cp -r css/* dist/css/
cp -r js/* dist/js/

# Ensure proper permissions
chmod -R 755 dist

echo "Build completed successfully!"
