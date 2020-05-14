import { client } from '#/clients/mq'
import { LocationMessage } from '#/models/location'
import { getLogger } from '#/utils'
import mongoClient from '#/clients/mongo'
import dayjs from 'dayjs'

const model = mongoClient.gps

const logger = getLogger('GPS LOG')

let batch: LocationMessage[] = []

function mapper(message: LocationMessage) {
  return {
    imei: message.IMSI,
    timestamp: message.UTC,
    data: message,
  }
}

client.gpsLogConsume((data: LocationMessage) => {
  logger('GPS Log incoming', data)
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

setInterval(() => {
  let oneMonthAgo = dayjs().subtract(1, 'month')
  model.deleteMany({ timestamp: { $lt: oneMonthAgo.valueOf() } }, (err) => {
    if (err) {
      logger.error('Error clean gps log', err)
    } else {
      logger.info(`Data older than ${oneMonthAgo.toISOString()} cleaned`)
    }
  })
}, 8.64e7 /* one day */)
