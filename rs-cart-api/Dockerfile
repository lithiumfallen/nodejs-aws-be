FROM node:12.20.0-alpine3.12 AS base

WORKDIR app/

FROM base as dependencies
COPY package*.json ./
RUN npm install && npm cache clean --force

FROM dependencies as build
COPY tsconfig*.json ./
COPY ./src ./src
RUN npm run build

FROM node:12.20.0-alpine3.12 AS application
WORKDIR app/
COPY --from=dependencies /app/package.json ./
RUN npm install --only=production
COPY --from=build /app/dist ./dist
EXPOSE 4000
CMD ["npm", "run", "start:prod"]
