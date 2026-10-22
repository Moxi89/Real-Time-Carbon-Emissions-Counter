#!/bin/bash
set -e

echo "Starting build process..."

rm -rf dist
mkdir -p dist

echo "Copying files..."
cp index.html disclaimer.html favicon.svg _headers dist/
cp -r css js dist/

echo "Build completed successfully!"
