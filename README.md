# Project Gulag

## Structure

```
.(project root)
├── docker
│ ├── Dockerfile
│ ├── docker-compose.yml
│ └── .env.example
└── packages
├── server
└── web
```

### `/docker`

contains docker swarn config `docker-compose.yml` and the project `Dockerfile` for image build. Read these 2 files for detailed information.

#### Usage

```bash
> cd ./docker
> # rename .env.example to .env and set the correct env variables
> cp ./.env.example ./.env
> docker-compose build
> # after successfully built
> docker-compose up
```

If server started with no errors, you can launch the app by visiting `http://localhost:8081` with your browser.

Also, other ports are open as well:

> `8082` Redis Admin

> `8083` Rabbit MQ

> `8084` Mongo Express

### `/packages/server`

Serveral backend applications running on `nodejs`. Mainly, a `CoAP` server and a HTTP server powered by `Koa.js`.

Check the README.md under this folder for more information.

### `/packages/web`

Single page application powered on `React.js`. After built, this app will be served statically by the server.

Check the README.md under this folder for more information.
