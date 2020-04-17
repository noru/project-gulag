import Koa from 'koa'
import mount from 'koa-mount'
import bodyParser from 'koa-bodyparser'
import serve from 'koa-static'
import { logger, koaLogger } from './logging'
import { shared, api, StaticsPath } from './routes'
import jwt from 'koa-jwt'

const { KOA_PORT } = process.env

const statics = new Koa()
statics.use(serve(StaticsPath))

const app = new Koa()
app.use(bodyParser())
app.use(koaLogger)
app.use(mount(statics))

app.use(jwt({ secret: 'sometext' }).unless({ path: [/^\/api\/authenticate/, /^\/health/] }))
app.use(api)
app.use(shared)

app.listen(KOA_PORT)

logger(`Server running on port ${KOA_PORT}`)
