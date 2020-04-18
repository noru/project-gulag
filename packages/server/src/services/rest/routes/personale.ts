import Router from 'koa-router'
import mongoClient from '../../../clients/mongo'

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
        ctx.status = 400
        ctx.body = { error: 'invalid_params', detail: e }
        break
      case 'MongoError':
        switch (e.code) {
          case 11000:
            ctx.status = 400
            ctx.body = { error: 'duplicate_id', detail: e }
            break
          default:
            ctx.status = 500
            ctx.body = { error: 'unkown', detail: e }
        }
      default:
        ctx.status = 500
    }
  }
})

export const personale = router.routes()
