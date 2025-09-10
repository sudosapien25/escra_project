# Multi-stage build for optimized production image
# Stage 1: Dependencies
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
# Install dependencies with npm ci for faster, reliable, reproducible builds
RUN npm ci --only=production && \
    npm cache clean --force

# Stage 2: Builder
FROM node:22-alpine AS builder
WORKDIR /app

# Copy package files and install all dependencies (including dev)
COPY package.json package-lock.json* ./
RUN npm ci && \
    npm cache clean --force

# Copy source code
COPY . .

# Set environment variables for production build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build the application
RUN npm run build

# Stage 3: Runner (Production)
FROM node:22-alpine AS runner
WORKDIR /app

# Create a non-root user to run the application
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Set environment to production
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy necessary files from builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Change ownership to nextjs user
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose the port Next.js runs on
EXPOSE 3000

# Set the port environment variable
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the application
CMD ["node", "server.js"]