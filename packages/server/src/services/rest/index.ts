import Koa from 'koa'
import serve from 'koa-static'
// import * as mount from 'koa-mount'
import * as prettyjson from 'prettyjson'
import { logger } from './logging'
import config from '../../../config'
import routes from './routes'

const staticServer = new Koa()
staticServer.use(serve(config.staticContentPath, {}))

const fileStorage = new Koa()
fileStorage.use(serve(config.volumn))
fileStorage.use(serve(config.rootPath + config.tempFileDir))

const app = new Koa()
// app.use(mount('/static', staticServer))
// app.use(mount('/files/', fileStorage))
app.use(logger)
app.use(routes)

app.listen(config.port)

console.info(`Server running on port ${config.port}`)
console.info('With configuration:')
console.info(prettyjson.render(config))
