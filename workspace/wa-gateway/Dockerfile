FROM node:20-alpine
RUN apk add --no-cache git
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --production && apk del git
COPY src ./src
EXPOSE 3002
CMD ["node", "src/server.js"]
