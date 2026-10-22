#!/bin/bash
set -e

echo "Starting build process..."

rm -rf dist
mkdir -p dist

echo "Copying files..."
cp index.html disclaimer.html 404.html favicon.svg robots.txt sitemap.xml _headers dist/
cp -r css js dist/

echo "Build completed successfully!"
