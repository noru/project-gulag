import Router from 'koa-router'
import jwt from 'jsonwebtoken'
import mongoClient from '../../../clients/mongo'

const { KOA_JWT_SECRET, KOA_SUPER_PASS } = process.env
const router = new Router()

const genJWT = (payload) => jwt.sign({ payload }, KOA_JWT_SECRET, { expiresIn: '0.5h' })

router.post('/api/authenticate', async (ctx) => {
  let { username, password } = ctx.request.body

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
  if (username === '$uper') {
    let flag = await mongoClient.metadata.findOne({ name: 'super_user_disabled' })
    if (flag?.data === true || password !== KOA_SUPER_PASS) {
      reject()
    } else {
      issue({ username })
    }
    return
  }

  let userData = await mongoClient.user.authenticate(username, password)
  if (userData) {
    issue(userData)
  } else {
    reject()
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
  await mongoClient.user.update(
    { username: 'admin' },
    {
      username: 'admin',
      email: 'admin@admin.com',
      role: 'admin',
      displayName: 'I am Admin',
      salt: 'randomstr',
      hashedPwd: '6887a953000343b53d1c42219ecd066f1e3b6102382807cccb2646513c817082',
    },
    { upsert: true, setDefaultsOnInsert: true },
  )
  ctx.body = 'OK'
})

export const api = router.routes()