# Use the official Node.js image from the Docker Hub
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Copy the .env file into the container
COPY .env .env

# Expose the port the app will run on
EXPOSE 5000

# Command to run the app
CMD ["node", "server.js"]
