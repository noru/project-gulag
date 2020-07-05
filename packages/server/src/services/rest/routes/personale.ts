import Router from 'koa-router'
import mongoClient from '#/clients/mongo'
import { responseHelper as error, ErrorCode, ok } from './utils/response'
import dayjs from 'dayjs'
const model = mongoClient.personale

const router = new Router()

router.get('/api/personales', async (ctx) => {
  ctx.body = await model.find()
})

router.get('/api/personales/:id', async (ctx) => {
  let { type = 'id' } = ctx.request.query
  let { id } = ctx.params
  let resp
  switch (type) {
    case 'imei':
      resp = await model.findByIMEI(id)
      break
    default:
      resp = await model.findOne({ id })
  }

  resp ? ok(ctx, resp) : error(ctx, ErrorCode.NotFound)
})

router.post('/api/personales', async (ctx) => {
  try {
    let body = ctx.request.body
    let resp = await model.create(body)
    ctx.body = resp
  } catch (e) {
    switch (e.name) {
      case 'ValidationError':
        error(ctx, ErrorCode.InvalidParams, e)
        break
      case 'MongoError':
        switch (e.code) {
          case 11000:
            error(ctx, ErrorCode.DuplicatedId, e)
            break
          default:
            error(ctx, ErrorCode.Unknown, e)
        }
        break
      default:
        error(ctx, ErrorCode.Unknown, e)
    }
  }
})

router.put('/api/personales/:id', async (ctx) => {
  let { id } = ctx.params
  let body = ctx.request.body
  body.id = id
  body.updateAt = Date.now()
  let resp = await model.updateOne({ id }, body)
  if (resp.n === 0) {
    error(ctx, ErrorCode.NotFound)
  } else {
    ok(ctx, resp)
  }
})

router.delete('/api/personales/:id', async (ctx) => {
  let { id } = ctx.params
  let resp = await model.deleteOne({ id })
  if (resp.n === 0) {
    error(ctx, ErrorCode.NotFound)
  } else {
    ok(ctx, resp)
  }
})

router.get('/api/attendanceReport', async (ctx) => {
  let { from, to } = ctx.request.query
  if (isNaN(from) || isNaN(to)) {
    error(ctx, ErrorCode.InvalidParams, new Error('Invalid params, not number'))
    return
  }
  if (+from > +to) {
    error(ctx, ErrorCode.InvalidParams, new Error('Invalid time range'))
    return
  }

  let start = dayjs(+from).startOf('day')
  let end = dayjs(+to).startOf('day')

  let header = {
    [start.format('YYYY-MM-DD')]: start,
  }
  while (start.isBefore(end)) {
    header[start.format('YYYY-MM-DD')] = start
    start = start.add(1, 'day')
  }

  let all = await model.find()

  let report = new Array

  for (let i = 0; i < all.length; i++) {
    const p = all[i];
    let record: any = {
      ...header
    }
    for (let r in record) {
      let date = record[r]
      if (await mongoClient.gps.findOne({ imei: p.imei, timestamp: { $gt: date.valueOf(), $lt: date.endOf('day').valueOf() } })) {
        record[r] = true
      } else {
        record[r] = false
      }
    }
    report.push({
      'imei': p.imei,
      'id': p.id,
      'name': p.name,
      ...record,
    })
  }
  ok(ctx, report)

})

export const personale = router.routes()
