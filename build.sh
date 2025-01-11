#!/bin/bash
set -e

echo "Starting build process..."

# Clean and create dist directory
rm -rf dist
mkdir -p dist
mkdir -p dist/css
mkdir -p dist/js

echo "Copying files..."
# Copy main files
cp index.html dist/ || exit 1
cp _headers dist/ || exit 1
cp _routes.json dist/ || exit 1

# Copy favicon if it exists
if [ -f "static/favicon.png" ]; then
    cp static/favicon.png dist/
else
    echo "Note: favicon.png not found, skipping..."
fi

# Copy CSS and JS with error checking
cp -r css/* dist/css/ || exit 1
cp -r js/* dist/js/ || exit 1

# Ensure proper permissions
chmod -R 755 dist || exit 1

# List contents for verification
echo "Build output:"
ls -la dist
ls -la dist/css
ls -la dist/js

echo "Build completed successfully!"
