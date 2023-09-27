# syntax=docker/dockerfile:1

FROM node:18-alpine

WORKDIR /app

# Install app dependencies
COPY --chown=node:node package*.json ./
RUN npm ci

# Bundle app source
COPY --chown=node:node . .

USER node

CMD ["node", "src/server.js"]

EXPOSE 3001