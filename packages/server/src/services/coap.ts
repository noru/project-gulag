import * as coap from 'coap'
import { client } from '../clients/mq'
import { Location } from '../models/location'
import { getLogger } from '../utils'

const PORT = process.env.NODE_ENV === 'development' ? 15683 : 5683
const Server = coap.createServer()
const logger = getLogger('COAP SERVER')

const CONNECTIVITY_OK = Uint8Array.from([0xaa, 0xaa, 0, 0])
const UPLOAD_GPS_OK = Uint8Array.from([0xcc, 0xcc, 0, 0])
const ALARM_OK = Uint8Array.from([0xdd, 0xdd, 0, 0])

Server.on('request', function (req, res) {
  let { payload } = req
  let raw: string = payload.toString()

  let funcCode = raw.substr(0, 2)

  switch (funcCode) {
    case '00':
      logger('Handshake', raw)
      res.end(CONNECTIVITY_OK)
      break
    case '01':
      logger('GPS', raw)
      handleGPSUpload(raw, res)
      break
    case '03':
      res.end(ALARM_OK)
      break
    default:
      logger.error('Unknown', raw)
      res.end()
  }
})

Server.listen(PORT, function () {
  logger('COAP Server Started on port ' + PORT)
})

function handleGPSUpload(payload, res) {
  let location = new Location(payload)
  if (location.isValid) {
    let json = location.toJson()
    client.publishGPS(json)
    res.end(UPLOAD_GPS_OK)
  } else {
    logger.error('invalid gps payload: ', payload)
    res.end('Invalid Upload GPS payload')
  }
}
