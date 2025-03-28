# Stage 1: Build the application
FROM node:22-alpine as builder

WORKDIR /usr/src/app

# Install pnpm
RUN corepack enable
RUN corepack prepare pnpm@latest --activate

# Copy package.json and pnpm lock file
COPY ["package.json", "pnpm-lock.yaml", ".env", "./"]

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of your application code
COPY . .

# Build the application
RUN pnpm build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy the build artifacts from the builder stage to nginx html folder
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

# Copy nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
