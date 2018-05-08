FROM node:10-alpine

RUN mkdir /sprinkler
WORKDIR /sprinkler

COPY app/ app/
COPY package.json .
COPY package-lock.json .

RUN apk add --no-cache make gcc g++ python && \
    npm install --production --silent && \
    apk del make gcc g++ python

RUN npm install

CMD ["node", "app/index.js"]
