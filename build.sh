#!/bin/bash

# Exit on error
set -e

echo "Starting build process..."

# Clean up old build
rm -rf static
mkdir -p static

echo "Creating directory structure..."
mkdir -p static/css
mkdir -p static/js

echo "Copying static assets..."
# Copy CSS files
cp -r static/css/* static/css/ 2>/dev/null || true
cp -r css/* static/css/ 2>/dev/null || true

# Copy JS files
cp -r static/js/* static/js/ 2>/dev/null || true
cp -r js/* static/js/ 2>/dev/null || true

echo "Copying templates..."
# Copy templates to static
cp -r templates/* static/

# Ensure index.html exists in static root
if [ -f "templates/index.html" ]; then
    cp templates/index.html static/
fi

# Create _redirects if it doesn't exist
if [ ! -f "static/_redirects" ]; then
    echo "/* /index.html 200" > static/_redirects
fi

# Copy favicon if it exists
if [ -f "static/favicon.png" ]; then
    cp static/favicon.png static/
fi

echo "Build completed successfully!"
