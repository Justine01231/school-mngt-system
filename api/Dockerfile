FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies with increased timeouts for esbuild
RUN npm config set fetch-timeout 120000 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm ci --ignore-scripts

# Copy source code
COPY . .

# Build the application
RUN npm run build && npx prisma generate

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "dist/index.js"]
