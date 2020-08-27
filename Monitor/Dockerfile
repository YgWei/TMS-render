FROM node:10-alpine AS builder
WORKDIR /home/node/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

#========================================================
FROM node:10-alpine
ENV NODE_ENV=production

WORKDIR /home/node/app

COPY package.json package-lock.json ./
RUN npm install \
 && npm cache clean --force

COPY --from=builder /home/node/app/dist ./dist
COPY config/watch.json ./config/
COPY .env .babelrc ./

RUN mkdir -p logs input error storage

EXPOSE 8080

CMD npm start
