FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/dist ./dist
COPY package.json .
RUN npm install --production

# Or whatever port your chat service uses
EXPOSE 4000
CMD ["npm", "start"]
