#!/bin/bash

# Create static directory if it doesn't exist
mkdir -p static

# Copy all static assets
cp -r static/* static/

# Copy templates to static
cp -r templates/* static/

# Copy any additional assets
cp -r css static/
cp -r js static/

echo "Build completed successfully!"
