import Router from 'koa-router'
import { getLogger } from '#/utils'
import { client } from '#/clients/mq'

const router = new Router()
const logger = getLogger('WS')
router.all('/ws/gps', async (ctx: any) => {
  // let batch = new Array
  ctx.websocket.send('Connected. GPS data ready for streaming.')
  let stopConsume = await client.webConsume(ctx.hostname, (data) => {
    logger('Sending location data through websocket')
    ctx.websocket.send(
      JSON.stringify({
        imei: data.IMSI,
        lat: data.Latitude,
        lng: data.Longitude,
      }),
    )
    return Promise.resolve()
  })

  ctx.websocket.on('close', () => {
    logger('ws close')
    stopConsume()
  })

  ctx.websocket.on('open', () => {
    logger('ws open')
  })
})

export const ws = router.routes()
