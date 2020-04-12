import * as coap from 'coap'
import MQClient, { QUEUE } from '../clients/mq'
import { Location } from '../models/location'

const Server = coap.createServer()

export const QUEUE_GPS_UPLOAD = 'GPS_UPLOAD'

Server.on('request', function (req, res) {
  let { url, payload } = req
  console.info('Url', url)
  console.info('Payload', payload)
  let location = new Location(payload)
  if (location.isValid) {
    MQClient.publish({ queue: { name: QUEUE.GPS_UPLOAD } }, location.toJson())
    res.end('OK')
  } else {
    res.end('Invalid payload')
  }
})

Server.listen(function () {
  console.info('COAP Server Started.')
})
