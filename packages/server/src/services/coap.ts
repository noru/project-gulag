import * as coap from 'coap'
import MQClient, { QUEUE } from '../clients/mq'
import { Location } from '../model/location'

const Server = coap.createServer()

export const QUEUE_GPS_UPLOAD = 'GPS_UPLOAD'

Server.on('request', function (req, res) {
  let { url, payload } = req
  console.log('Url', url)
  console.log('Payload', payload)
  MQClient.publish({ queue: { name: QUEUE.GPS_UPLOAD } }, payload)
  res.end()
})

Server.listen(function () {
  console.log('COAP Server Started.')
})

// /* to ack all messages */
// client.ackAll()

const TestPayload =
  '46,0114013436303131333031333936303533371A5E8EBB7501589FAE06CA2D460000000020000C00070007000053C2'
const location = new Location(TestPayload)
MQClient.publish({ queue: { name: QUEUE.GPS_UPLOAD } }, location.toJson())
