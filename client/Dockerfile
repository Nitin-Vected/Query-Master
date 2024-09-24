# Step 1: Build the React Vite app
FROM node:22 AS build

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire application code to the container
COPY . .

# Build the React app for production
RUN npm run build

# Step 2: Set up Nginx to serve the static files
FROM nginx:alpine

# Create SSL directory
RUN mkdir -p /etc/nginx/ssl

# Copy built assets from the previous stage
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Copy your SSL certificates
COPY certificate.crt /etc/nginx/ssl/certificate.crt
COPY private.key /etc/nginx/ssl/private.key

# Copy a custom Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port Nginx will run on
EXPOSE 3000

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
