ARG FOO=bar
FROM node:13.13.0

RUN npm i -g cnpm
RUN mkdir -p /app/ftp

# install node modules at front for caching
RUN mkdir -p /app/packages/server
RUN mkdir -p /app/packages/web
COPY ./packages/server/package.json /app/packages/server
COPY ./packages/web/package.json /app/packages/web
WORKDIR /app/packages/server
RUN cnpm install --silent
WORKDIR /app/packages/web
RUN cnpm install --silent

WORKDIR /app

# skip cache for following steps
ADD "https://www.random.org/cgi-bin/randbyte?nbytes=10&format=h" skipcache
RUN git clone https://github.com/noru/project-gulag.git
RUN cp -r /app/project-gulag/* /app/

# build web files
WORKDIR /app/packages/web
RUN npm run build

# build and start the server
WORKDIR /app/packages/server
RUN npm run build

# Environment vars & credentials
COPY ./docker/.env /app/packages/server/.env

# CoAP port
EXPOSE 5683
# Web & API port
EXPOSE 80

CMD npm run prod