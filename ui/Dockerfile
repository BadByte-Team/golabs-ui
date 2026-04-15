# Stage 1: Build the Vue application
FROM node:22-alpine AS build-stage

WORKDIR /app

# Enable Corepack for Yarn 3/4 if needed, or just rely on standard yarn
RUN corepack enable

# Copy package management files
COPY package.json yarn.lock ./

# Install dependencies (use --immutable equivalent if on Yarn berry, or frozen-lockfile for classic)
RUN yarn install --frozen-lockfile || yarn install --immutable

# Copy standard project files
COPY . .

# Build the project
RUN yarn build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine AS production-stage

# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the build output to Nginx's static file directory
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
