import Router from 'koa-router'
import jwt from 'jsonwebtoken'
import mongoClient from '../../../clients/mongo'

const { KOA_JWT_SECRET, KOA_SUPER_PASS } = process.env
const router = new Router()

const genJWT = (payload) => jwt.sign({ payload }, KOA_JWT_SECRET, { expiresIn: '0.5h' })

router.post('/api/authenticate', async (ctx) => {
  let { user, password } = ctx.request.body

  let issue = (data) => {
    let token = genJWT(data)
    let serverTime = Date.now()
    ctx.body = {
      token,
      expiresIn: serverTime + 1800000,
      serverTime,
    }
  }
  let reject = () => {
    ctx.status = 401
    ctx.body = {
      error: 'invalid_credentials',
    }
  }
  if (user === '$uper') {
    let flag = await mongoClient.metadata.findOne({ name: 'super_user_disabled' })
    if (flag?.data === true || password !== KOA_SUPER_PASS) {
      reject()
    } else {
      issue({ user })
    }
    return
  }

  // let user = await mongoClient.user.findOne({ name: user })
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

router.post('/api/init', async (ctx) => {
  await mongoClient.metadata.update(
    { name: 'super_user_disabled' },
    {
      name: 'super_user_disabled',
      description: "Allow super user login or not. Useful at the beginning where no user's been created",
      data: false,
    },
    { upsert: true, setDefaultsOnInsert: true },
  )
  ctx.body = 'OK'
})

export const api = router.routes()
