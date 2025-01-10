#!/bin/bash
set -e

echo "Starting build process..."

# Create dist directory
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

# Copy CSS files
cp css/styles.css dist/css/

# Copy JS files
cp js/script.js dist/js/

echo "Build completed successfully!"
