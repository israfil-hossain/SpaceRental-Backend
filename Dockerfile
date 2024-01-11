# Use Node.js LTS Alpine as the base image
FROM node:lts-alpine as base

# Build stage
FROM base as builder
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

# Run stage
FROM base as runner
WORKDIR /app
COPY --from=builder /app/dist .
EXPOSE 4000
CMD ["node", "main.js"]
