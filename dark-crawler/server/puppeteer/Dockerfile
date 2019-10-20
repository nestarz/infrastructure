
FROM buildkite/puppeteer:latest

WORKDIR /app/

COPY ./server/puppeteer/package.json /app

RUN yarn

ENV WEBSKD_VERSION 0.3.1
RUN wget https://github.com/joewalnes/websocketd/releases/download/v$WEBSKD_VERSION/websocketd-$WEBSKD_VERSION\_amd64.deb && \
  dpkg -i websocketd-$WEBSKD_VERSION\_amd64.deb && \
  rm websocketd-$WEBSKD_VERSION\_amd64.deb && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*

COPY ./server/puppeteer/src /app/src
COPY ./server/puppeteer/assets /app/assets

ENV PATH="${PATH}:/node_modules/.bin"