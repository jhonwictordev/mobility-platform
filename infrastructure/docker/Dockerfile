# Multi-stage production Dockerfile for Mobility Platform API
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY services/api/package*.json ./services/api/
COPY packages/shared/package*.json ./packages/shared/

RUN npm install --workspace=services/api --workspace=packages/shared

COPY packages/shared ./packages/shared
COPY services/api ./services/api

RUN cd services/api && npm run build

# Production Runner Stage
FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/services/api/package*.json ./services/api/
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/services/api/dist ./services/api/dist

EXPOSE 3001

CMD ["node", "services/api/dist/main.js"]
