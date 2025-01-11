#!/bin/bash
set -e

echo "Starting build process..."

# Create dist directory
rm -rf dist
mkdir -p dist

echo "Creating directory structure..."
mkdir -p dist/css
mkdir -p dist/js
mkdir -p dist/static

echo "Copying files..."
# Copy main files
cp index.html dist/
cp _headers dist/
cp _routes.json dist/

# Copy static assets
cp -r static/* dist/static/

# Copy CSS files
cp -r css/* dist/css/

# Copy JS files
cp -r js/* dist/js/

# Ensure proper permissions
chmod -R 755 dist

echo "Build completed successfully!"
