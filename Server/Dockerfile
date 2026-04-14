# Start your image with a node base image
FROM node:22-alpine

# The /app directory should act as the main application directory
WORKDIR /Nhanify

# Copy local directories to the current local directory of our docker image (/app)/
COPY --exclude=./Dockerfile ./ ./

# Install node packages 
RUN npm install

EXPOSE 3015

# Start the app using serve command
CMD [ "node", "app.js" ]
CMD [ "npm", "run", "start" ]