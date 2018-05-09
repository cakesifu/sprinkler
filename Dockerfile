FROM resin/raspberry-pi-alpine-node:8 as base

RUN mkdir /sprinkler
WORKDIR /sprinkler

COPY package.json .
COPY package-lock.json .

RUN apk add --no-cache make gcc g++ python
RUN npm install --production --silent

FROM resin/raspberry-pi-alpine-node:8

RUN mkdir /sprinkler
WORKDIR /sprinkler

COPY app/ app/
COPY package.json .
COPY package-lock.json .
COPY --from=base /sprinkler/node_modules node_modules/

CMD ["node", "app/index.js"]
