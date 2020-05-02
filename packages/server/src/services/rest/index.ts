import Koa from 'koa'
import mount from 'koa-mount'
import bodyParser from 'koa-bodyparser'
import serve from 'koa-static'
import websockify from 'koa-websocket'
import { logger, koaLogger } from './logging'
import { shared, auth, personale, ws, gps, mock, StaticsPath } from './routes'
import jwt from 'koa-jwt'

const { KOA_PORT, KOA_JWT_SECRET } = process.env

const statics = new Koa()
statics.use(serve(StaticsPath))

const app = websockify(new Koa())
app.use(bodyParser())
app.use(koaLogger)
app.use(mount(statics))

app.use(jwt({ secret: KOA_JWT_SECRET! }).unless({ path: [/^\/api\/authenticate/, /^\/(?!api)(.*)$/] }))
app.use(auth)
app.use(personale)
app.use(mock)
app.use(gps)
app.use(shared)
app.ws.use(ws)

app.listen(KOA_PORT)

logger(`Server running on port ${KOA_PORT}`)
