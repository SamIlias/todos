# Use the official Node.js image to install dependencies and build the project
FROM node:20 AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to cache dependencies
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the project files
COPY . .

# Build the project
RUN npm run build

# --------------------------------------
# Use Nginx to serve static files
FROM nginx:1.25

# Copy the built files from the backend container
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
