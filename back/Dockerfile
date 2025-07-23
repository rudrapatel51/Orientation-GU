# Use official Node.js LTS image
FROM node:latest as build

RUN apt-get update && apt-get install -y \
    curl \
    wget \
    vim \
    openssl \
    && apt-get clean

# Set working directory
WORKDIR /app

# Copy package.json and install only prod dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .


RUN npm install prisma

RUN npx prisma generate

# Expose port (match your Express.js port)
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
