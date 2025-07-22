# Use official Node.js LTS image
FROM node:22-alpine as build

# Set working directory
WORKDIR /app

# Copy package.json and install only prod dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .
RUN apk add --no-cache openssl

RUN npm install prisma

RUN npx prisma generate

# Expose port (match your Express.js port)
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
