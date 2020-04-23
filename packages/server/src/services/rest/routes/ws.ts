import Router from 'koa-router'
import { getLogger } from '#/utils'
import { client } from '#/clients/mq'
import { LocationMessage } from '#/models/location'

const router = new Router()
const logger = getLogger('WS')
router.all('/ws/gps/:clientId', async (ctx: any) => {
  // let batch = new Array
  let { clientId } = ctx.params
  ctx.websocket.send('Connected. GPS data ready for streaming.')
  let stopConsume = await client.webConsume(clientId, (data: LocationMessage) => {
    logger('Sending location data through websocket')
    ctx.websocket.send(
      JSON.stringify({
        imei: data.IMSI,
        lat: data.Latitude,
        lng: data.Longitude,
        alt: data.Altitude,
        s: data.Speed,
        d: data.Direction,
        t: data.UTC,
        v: data.Volts,
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
