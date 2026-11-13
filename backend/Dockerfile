FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY prisma ./prisma
RUN npx prisma generate
COPY . .
RUN mkdir -p /app/node_modules/.cache && chown -R node:node /app
ENV NODE_ENV=production
USER node
EXPOSE 3000
CMD ["node", "server.js"]
