import * as coap from 'coap'
import MQClient, { QUEUE } from '../clients/mq'
import { Location } from '../models/location'

const Server = coap.createServer()

export const QUEUE_GPS_UPLOAD = 'GPS_UPLOAD'

Server.on('request', function (req, res) {
  let { url, payload } = req
  payload = payload.toString()
  console.info('Url', url)
  console.info('Payload', payload)
  let location = new Location(payload)
  if (location.isValid) {
    MQClient.publish({ queue: { name: QUEUE.GPS_UPLOAD } }, location.toJson())
    res.end(Uint8Array.from([170, 170, 0, 0])) // OK code as requirement
  } else {
    res.end('Invalid payload')
  }
})

Server.listen(function () {
  console.info('COAP Server Started.')
})
