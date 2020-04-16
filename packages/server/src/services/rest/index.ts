import Koa from 'koa'
import mount from 'koa-mount'
import serve from 'koa-static'
import { logger, koaLogger } from './logging'
import routes, { StaticsPath } from './routes'

const { KOA_PORT } = process.env

const statics = new Koa()
statics.use(serve(StaticsPath))

const app = new Koa()
app.use(koaLogger)
app.use(mount(statics))
app.use(routes)

app.listen(KOA_PORT)

logger(`Server running on port ${KOA_PORT}`)
