# Use the official Node.js image as the base image
FROM node:22

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

RUN apt-get update && apt-get install -y postgresql-client

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the application port (make sure it matches the PORT in your .env file)
EXPOSE ${PORT}

# Start the application
CMD ["npm", "start"]