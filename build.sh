#!/bin/bash

# Exit on error
set -e

echo "Starting build process..."

# Clean up old build
rm -rf static
mkdir -p static

echo "Copying static assets..."
# Copy all static assets
cp -r static/* static/ 2>/dev/null || true

echo "Copying templates..."
# Copy templates to static
cp -r templates/* static/

echo "Copying CSS and JS..."
# Copy CSS and JS directories if they exist
if [ -d "css" ]; then
  cp -r css static/
fi

if [ -d "js" ]; then
  cp -r js static/
fi

echo "Ensuring proper file structure..."
# Ensure index.html exists in static
if [ ! -f "static/index.html" ]; then
  if [ -f "templates/index.html" ]; then
    cp templates/index.html static/
  fi
fi

# Create _redirects if it doesn't exist
if [ ! -f "static/_redirects" ]; then
  echo "/* /index.html 200" > static/_redirects
fi

echo "Build completed successfully!"
