import Router from 'koa-router'
import jwt from 'jsonwebtoken'
import mongoClient from '../../../clients/mongo'
import { responseHelper, ErrorCode } from './utils/response'

const { metadata, user } = mongoClient
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
  let reject = () => responseHelper(ctx, ErrorCode.Unauthorized)
  if (username === '$uper') {
    let flag = await metadata.findOne({ name: 'super_user_disabled' })
    if (flag?.data === true || password !== KOA_SUPER_PASS) {
      reject()
    } else {
      issue({ username, displayName: '超级用户' })
    }
    return
  }

  let userData = await user.authenticate(username, password)
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

router.post('/api/authInit', async (ctx) => {
  await metadata.update(
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

router.get('/api/users', async (ctx) => {
  ctx.body = await user.allUsers()
})

router.post('/api/users', async (ctx) => {
  let { username, password, ...rest } = ctx.request.body
  await user.createUser(username, password, rest)
})

export const auth = router.routes()
