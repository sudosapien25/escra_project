# Docker Setup for ESCRA Frontend

This frontend application is containerized using Docker with multi-stage builds for optimized production images.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+ (optional)

## Quick Start

### Production Build

Build and run the production image:

```bash
# Build the production image
docker build -t escra-frontend:latest .

# Run the container
docker run -p 3000:3000 escra-frontend:latest
```

### Using Docker Compose

For production:
```bash
docker-compose up -d escra-frontend
```

For development with hot-reloading:
```bash
docker-compose --profile dev up escra-frontend-dev
```

## Docker Configuration Details

### Production Dockerfile
- **Base Image**: Node.js 22 Alpine (latest LTS)
- **Multi-stage Build**: 3 stages for optimized size
  - Stage 1: Install production dependencies
  - Stage 2: Build the Next.js application
  - Stage 3: Minimal runtime with standalone output
- **Security**: Runs as non-root user (nextjs)
- **Optimization**: Uses Next.js standalone output for minimal image size

### Key Features
- ✅ Latest Node.js 22 LTS
- ✅ Updated NPM/NPX
- ✅ Next.js 14.1.0 with React 18
- ✅ Multi-stage build for optimized size (~150MB final image)
- ✅ Non-root user for security
- ✅ Health checks configured
- ✅ Production-ready configuration

## Environment Variables

Set these in your deployment:

```bash
NODE_ENV=production
NEXT_PUBLIC_API_URL=your-api-url
# Add other environment variables as needed
```

## Building for Different Environments

### Build with custom build args:
```bash
docker build \
  --build-arg NODE_ENV=production \
  --build-arg NEXT_PUBLIC_API_URL=https://api.example.com \
  -t escra-frontend:latest .
```

## Deployment

### Deploy to Docker Hub:
```bash
docker tag escra-frontend:latest yourusername/escra-frontend:latest
docker push yourusername/escra-frontend:latest
```

### Deploy to AWS ECR:
```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin [your-ecr-uri]
docker tag escra-frontend:latest [your-ecr-uri]/escra-frontend:latest
docker push [your-ecr-uri]/escra-frontend:latest
```

## Troubleshooting

### Check container logs:
```bash
docker logs escra-frontend
```

### Access container shell:
```bash
docker exec -it escra-frontend sh
```

### Clean up Docker resources:
```bash
docker system prune -a
```

## Performance Notes

- The production image is ~150MB (compared to ~1GB+ with node_modules)
- Uses Alpine Linux for minimal footprint
- Standalone output includes only necessary dependencies
- Multi-stage build ensures no build tools in final image