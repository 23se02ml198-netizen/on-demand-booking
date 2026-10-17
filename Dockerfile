FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy project files
COPY . .

# Expose port
EXPOSE 3000

ENV PORT=3000
ENV NODE_ENV=production

# Start application
CMD ["node", "server.js"]
