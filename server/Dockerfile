# Use an official Node.js runtime as a parent image
FROM node:22

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy only package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install dependencies with npm ci for a clean install, and optimize for CI
RUN npm ci --prefer-offline --no-audit --no-fund

# Copy the rest of your application code
COPY . .

# Expose the port the app runs on
EXPOSE 3001

# Start the server with the development command
CMD ["npm", "run", "dev", "--", "--host"]
