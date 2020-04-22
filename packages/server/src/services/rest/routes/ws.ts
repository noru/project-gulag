import Router from 'koa-router'
import { getLogger } from '#/utils'
import MQClient, { QUEUE } from '#/clients/mq'

const router = new Router()
const logger = getLogger('WS')
router.all('/ws/gps', (ctx: any) => {

  // let batch = new Array

  ctx.websocket.send('Hello World');
  MQClient.consume({ queue: QUEUE.GPS_LIVE }, (data) => {

    logger('Sending location data through websocket')
    ctx.websocket.send(JSON.stringify({
      imei: data.IMSI,
      lat: data.Latitude,
      lng: data.Longitude,
    }))
    return Promise.resolve()
  })

})

export const ws = router.routes()