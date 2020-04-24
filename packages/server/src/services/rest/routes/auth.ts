import Router from 'koa-router'
import jwt from 'jsonwebtoken'
import mongoClient from '#/clients/mongo'
import { responseHelper as error, ErrorCode, ok } from './utils/response'
import { omitSensitive } from '#/clients/mongo/models/user'

const { metadata, user } = mongoClient
const { KOA_JWT_SECRET, KOA_SUPER_PASS } = process.env
const TOKEN_VALIDITY_PERIOD = 7200000 // 2h

const router = new Router()

const genJWT = (payload) => jwt.sign({ payload }, KOA_JWT_SECRET, { expiresIn: '2h' })

router.post('/api/authenticate', async (ctx) => {
  let { username, password } = ctx.request.body

  let issue = (data) => {
    let token = genJWT(data)
    let serverTime = Date.now()
    ctx.body = {
      token,
      expiresIn: serverTime + TOKEN_VALIDITY_PERIOD,
      serverTime,
    }
  }
  let reject = () => error(ctx, ErrorCode.Unauthorized)
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
    expiresIn: serverTime + TOKEN_VALIDITY_PERIOD,
    serverTime,
  }
})

router.get('/api/users', async (ctx) => {
  ctx.body = await user.allUsers()
})

router.get('/api/users/:username', async (ctx) => {
  let { username } = ctx.params
  let resp = await user.findOne({ username })
  resp ? ok(ctx, omitSensitive(resp)) : error(ctx, ErrorCode.NotFound)
})

router.post('/api/users', async (ctx) => {
  let { username, password, ...rest } = ctx.request.body
  await user.createUser(username, password, rest)
  ctx.body = {
    username,
    ...rest,
  }
})

router.delete('/api/users/:username', async (ctx) => {
  let { username } = ctx.params
  let resp = await user.deleteOne({ username })
  if (resp.n === 0) {
    error(ctx, ErrorCode.NotFound)
  } else {
    ok(ctx, resp)
  }
})

// temp
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

export const auth = router.routes()
