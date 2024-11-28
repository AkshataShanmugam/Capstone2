# Use official Node.js image from Docker Hub (Alpine version for smaller size)
FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json for better cache management
COPY package*.json ./

# Install dependencies with extended timeout and alternative registry (optional)
RUN npm install --fetch-timeout=600000 --timeout=600000

# Copy the rest of your application code
COPY . .

# Expose the port your app runs on
EXPOSE 5000

# Command to run the application
CMD ["node", "server.js"]
