import Router from 'koa-router'
import jwt from 'jsonwebtoken'

const { KOA_JWT_SECRET } = process.env
const router = new Router()

const genJWT = (payload) => jwt.sign({ payload }, KOA_JWT_SECRET, { expiresIn: '0.5h' })

router.post('/api/authenticate', async (ctx) => {
  let { user, password } = ctx.request.body

  if (user === 'test' && password === 'abcd') {
    let token = genJWT({ foo: 'bar' })
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

router.post('/api/reauth', async (ctx) => {
  let token = genJWT(ctx.state.user.payload)
  let serverTime = Date.now()
  ctx.body = {
    token,
    expiresIn: serverTime + 1800000,
    serverTime,
  }
})

export const api = router.routes()
