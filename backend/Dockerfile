# Base image
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy package.json
COPY package.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Copy the .env file
COPY .env ./

# Start the server using the production build
CMD ["npm", "run", "start:dev"]
