# Именованная стадия устраняет ошибку development из методички.
FROM node:24-alpine AS development
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

FROM development AS test
RUN npm run lint && npm test && npm run build
CMD ["npm", "test"]

# Последняя стадия содержит только приложение, без Jest и ESLint.
FROM node:24-alpine AS production
WORKDIR /app
COPY --from=test /app/dist ./src
USER node
CMD ["node", "src/app.js"]
