FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the backend source code
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose port 5000
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
