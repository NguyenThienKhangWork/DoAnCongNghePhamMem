# Frontend - React + Vite + TailwindCSS
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build app
RUN npm run build

# Serve with lightweight HTTP server
FROM node:18-alpine
RUN npm install -g serve
WORKDIR /app
COPY --from=0 /app/dist .

EXPOSE 5173

CMD ["serve", "-s", ".", "-l", "5173", "--no-clipboard"]
