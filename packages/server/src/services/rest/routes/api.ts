import Router from 'koa-router'
import jwt from 'jsonwebtoken'

const router = new Router()

router.post('/api/authenticate', async (ctx) => {
  let { user, password } = ctx.request.body

  if (user === 'test' && password === 'abcd') {
    let token = jwt.sign({ foo: 'bar' }, 'sometext', { expiresIn: '0.5h' })
    let serverTime = Date.now()
    ctx.body = {
      token,
      expiresIn: serverTime + 1800000,
      serverTime,
    }
  } else {
    ctx.status = 401
    ctx.body = {
      error: 'invalid_credentials',
    }
  }
})

router.post('/api/test', async (ctx) => {
  ctx.body = {
    data: 'abc',
  }
})

export const api = router.routes()
