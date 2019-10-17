FROM node:10

WORKDIR /app/

RUN apt-get update && apt-get install -y \
	libcairo2-dev \
	libjpeg-dev \
	libpango1.0-dev \
	libgif-dev \
	libpng-dev \
	build-essential \
	g++

COPY ./classifier/package.json /app

RUN yarn global add supervisor
RUN yarn

COPY ./classifier/dist /app/dist

EXPOSE 8080

CMD ["yarn", "run", "serve"]