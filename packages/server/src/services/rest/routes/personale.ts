import Router from 'koa-router'
import mongoClient from '../../../clients/mongo'
import { responseHelper as r, ErrorCode } from './utils/response'

const model = mongoClient.personale

const router = new Router()

router.get('/api/personales', async (ctx) => {
  ctx.body = await model.find()
})

router.get('/api/personales/:id', async (ctx) => {
  let result = await model.findByIMEI(ctx.params.id)
  ctx.body = result
  ctx.status = result ? 200 : 404
})

router.post('/api/personales', async (ctx) => {
  try {
    let body = ctx.request.body
    let resp = await model.create(body)
    ctx.body = resp
  } catch (e) {
    switch (e.name) {
      case 'ValidationError':
        r(ctx, ErrorCode.InvalidParams, e)
        break
      case 'MongoError':
        switch (e.code) {
          case 11000:
            r(ctx, ErrorCode.DuplicatedId, e)
            break
          default:
            r(ctx, ErrorCode.Unknown, e)
        }
      default:
        r(ctx, ErrorCode.Unknown, e)
    }
  }
})

export const personale = router.routes()
