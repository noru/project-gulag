import Router from 'koa-router'
import path from 'path'
import { createReadStream } from 'fs'
const { KOA_STATICS_PATH } = process.env
export const StaticsPath = path.resolve(__dirname, KOA_STATICS_PATH!)
const router = new Router()

router.get('/health', async (ctx) => {
  ctx.body = 'Server is running fine *★,°*:.☆(￣▽￣)/$:*.°★* 。'
})

router.all('/*', async (ctx, _next) => {
  ctx.type = 'html'
  ctx.body = createReadStream(`${StaticsPath}/index.html`)
})

export default router.routes()
export { router }
