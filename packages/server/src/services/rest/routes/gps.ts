import Router from 'koa-router'
import mongoClient from '#/clients/mongo'
import { responseHelper as error, ErrorCode, ok } from './utils/response'

const model = mongoClient.gps

const router = new Router()

router.get('/api/gps/logs/:imei', async (ctx) => {

  let { from = Date.now() - 86400000, to = Date.now() } = ctx.request.query
  let { imei } = ctx.params

  if (isNaN(from) || isNaN(to)) {
    error(ctx, ErrorCode.InvalidParams, new Error('Invalid params, not number'))
    return
  }
  if (from > to) {
    error(ctx, ErrorCode.InvalidParams, new Error('Invalid time range'))
    return
  }

  let result = await model.findByIMEI(imei, +from, +to)
  ok(ctx, result || [])
})

router.head('/api/gps/logs/:imei', async (ctx) => {

  let { from, to } = ctx.request.query
  let { imei } = ctx.params

  if (isNaN(from) || isNaN(to)) {
    error(ctx, ErrorCode.InvalidParams, new Error('Invalid params, not number'))
    return
  }
  if (from > to) {
    error(ctx, ErrorCode.InvalidParams, new Error('Invalid time range'))
    return
  }

  let doc = await model.findOne({ imei, timestamp: { $gt: +from, $lt: +to } })

  doc ? ok(ctx) : error(ctx, ErrorCode.NotFound)
})

export const gps = router.routes()
