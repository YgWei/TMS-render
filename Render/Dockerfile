FROM node:12.16.3-alpine3.11 AS builder
WORKDIR /home/node/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

###############################################################################
FROM node:12.16.3-alpine3.11
ENV NODE_ENV production

WORKDIR /home/node/app

COPY package.json package-lock.json ./
RUN npm install \
    && npm cache clean --force

COPY --from=builder /home/node/app/dist ./dist
COPY .env .babelrc ./

RUN mkdir -p logs storage

CMD npm run start