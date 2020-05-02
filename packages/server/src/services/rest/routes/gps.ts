import Router from 'koa-router'
import mongoClient from '#/clients/mongo'
import { responseHelper as error, ErrorCode, ok } from './utils/response'
import dayjs from 'dayjs'

const model = mongoClient.gps

const router = new Router()

router.get('/api/gps/logs/:imei', async (ctx) => {
  let { from, to } = ctx.request.query
  let { imei } = ctx.params

  from = dayjs(from) || dayjs().subtract(1, 'day')
  to = dayjs(to) || dayjs()

  if (from > to) {
    error(ctx, ErrorCode.InvalidParams, new Error('Invalid time range'))
    return
  }

  let result = await model.findByIMEI(imei, from, to)
  ok(ctx, result || [])
})

export const gps = router.routes()
