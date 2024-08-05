# Base image
FROM node:20-alpine

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Copy the .env file
COPY .env ./

# Start the server using the production build
CMD ["npm", "run", "start:dev"]
