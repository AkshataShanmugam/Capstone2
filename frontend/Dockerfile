# Use official Node.js image as the base image
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to install dependencies first
COPY package.json package-lock.json* ./

# Install project dependencies
RUN npm install

# Copy all the files from your local machine to the container
COPY . .

# Build the Vite project
RUN npm run build

# Expose the port that your app will run on (default for Vite is 5173)
EXPOSE 5173

# Start the app (use npm run dev in development)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
