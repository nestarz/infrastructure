
FROM buildkite/puppeteer:latest

WORKDIR /app/

COPY ./server/puppeteer/package.json /app

RUN yarn

COPY ./server/puppeteer/src /app/src
COPY ./server/puppeteer/assets /app/assets

ENV PATH="${PATH}:/node_modules/.bin"