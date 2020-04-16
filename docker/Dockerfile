ARG FOO=bar
FROM node:13.13.0

RUN npm i -g cnpm
RUN mkdir /app
WORKDIR /app
RUN mkdir ftp

ARG FOO
RUN git clone https://github.com/noru/project-gulag.git

# Environment vars & credentials
COPY ./.dev.env /app/project-gulag/packages/server/.env

# build web files
WORKDIR /app/project-gulag/packages/web
RUN cnpm install --silent
RUN npm run build

# build and start the server
WORKDIR /app/project-gulag/packages/server
RUN cnpm install --silent
RUN npm run build

EXPOSE 5683
EXPOSE 80

CMD npm run prod