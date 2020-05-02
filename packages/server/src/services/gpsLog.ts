import { client } from '#/clients/mq'
import { LocationMessage } from '#/models/location'
import { getLogger } from '#/utils'
import mongoClient from '#/clients/mongo'

const model = mongoClient.gps

const logger = getLogger('GPS LOG')

let batch: LocationMessage[] = []

function mapper(message: LocationMessage) {
  return {
    imei: message.IMSI,
    timestamp: message.UTC,
    data: message
  }
}

client.gpsLogConsume((data: LocationMessage) => {

  logger('GPS Log incomming', data)
  batch.push(data)
  if (batch.length > 1000) {
    logger(`Write ${batch.length} GPS Log to DB`)
    model.insertMany(batch.map(mapper), (e, data) => {
      logger.error('Error writing to db', e, data)
    })
    batch.length = 0
  }
  return Promise.resolve()
})