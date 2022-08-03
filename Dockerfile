FROM node:16 as local
USER node
WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./
RUN npm install
RUN npm install global --production --remove-dev eslint;
COPY --chown=node:node . .

EXPOSE 8080