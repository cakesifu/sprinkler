FROM resin/raspberry-pi-node:8 as base

RUN mkdir /sprinkler
WORKDIR /sprinkler

COPY app/ app/
COPY package.json .
COPY package-lock.json .

RUN npm install

CMD ["node", "app/index.js"]
