#!/bin/bash

# Docker build script for escra-frontend
# Run with: newgrp docker && ./docker-build.sh

echo "Building escra-frontend Docker image..."
docker build -t escra-frontend:latest .

if [ $? -eq 0 ]; then
    echo "Build successful! Image tagged as escra-frontend:latest"
    echo "To run the container:"
    echo "  docker run -p 3000:3000 escra-frontend:latest"
else
    echo "Build failed!"
    exit 1
fi