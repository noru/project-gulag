import Router from 'koa-router'
import mongoClient from '../../../clients/mongo'
import { responseHelper as error, ErrorCode, ok } from './utils/response'

const model = mongoClient.personale

const router = new Router()

router.get('/api/personales', async (ctx) => {
  ctx.body = await model.find()
})

router.get('/api/personales/:id', async (ctx) => {
  let resp = await model.findOne({ id: ctx.params.id })
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

export const personale = router.routes()
