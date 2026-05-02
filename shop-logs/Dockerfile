FROM node:22-alpine
WORKDIR /app
COPY package.json ./
RUN npm install
COPY server/ ./server/
COPY public/ ./public/
EXPOSE 7000
CMD ["node", "server/index.mjs"]
