import amqp from 'amqp-connection-manager'
import { Channel } from 'amqplib'
import { getLogger } from '#/utils'
import { connection } from 'mongoose'
const { MQ_HOST, MQ_USER, MQ_PASS } = process.env

const logger = getLogger('MQ')
const URL = `amqp://${MQ_USER}:${MQ_PASS}@${MQ_HOST}`
const CONNECTION = amqp.connect([URL], {
  json: true,
  heartbeatIntervalInSeconds: 5,
  reconnectTimeInSeconds: 10,
})
CONNECTION.on('connect', () => {
  logger('Connected to RabbitMQ server')
})

CONNECTION.on('disconnect', (params) => {
  logger.error('RabbitMQ server is disconnected', params.err)
})

enum ChannelKey {
  PublishGPS = 'publish_gps',
  FTPConsume = 'ftp_consume',
  WebConsume = 'web_consume',
  GpsLogConsume = 'gps_log_consume'
}

class MQClient {
  static Exchange = 'gps_live'

  wrappers = []

  getChannelWrapper(key: ChannelKey, setup?: (channel: Channel) => Promise<any>) {
    let wrapper = this.wrappers[key]
    if (!wrapper) {
      wrapper = this.wrappers[key] = CONNECTION.createChannel({
        async setup(ch) {
          await ch.assertExchange(MQClient.Exchange, 'topic', { durable: true })
          return setup && setup(ch)
        },
      })
    }
    return wrapper
  }

  async publishGPS(data) {
    logger('Publishing GPS data...', data)
    let channelWrapper = this.getChannelWrapper(ChannelKey.PublishGPS, (ch) => {
      return ch.assertExchange(MQClient.Exchange, 'topic', { durable: true })
    })
    return channelWrapper.publish(MQClient.Exchange, '', Buffer.from(JSON.stringify(data)))
  }

  gpsLogConsume(handler) {
    let queue = QUEUE.GPS_LOG
    let wrapper = this.getChannelWrapper(ChannelKey.GpsLogConsume, async (ch: Channel) => {
      let assertQueue = await ch.assertQueue(queue.name, queue.options)
      await ch.bindQueue(assertQueue.queue, MQClient.Exchange, '')
      return await ch.consume(queue.name, (data) => {
        try {
          let message = JSON.parse(data!.content.toString())
          return handler(message).then(() => {
            ch.ack(data!)
            return Promise.resolve(data)
          })
        } catch (error) {
          logger.error(`Malformed message from queue ${queue.name}`, error, data)
        }
      })
    })
    wrapper
      .waitForConnect()
      .then(() => {
        logger(`Consumption from ${queue.name} started!`)
      })
      .catch((e) => logger.error('Consumption error', e))
  }

  ftpConsume(handler) {
    let queue = QUEUE.GPS_UPLOAD
    let wrapper = this.getChannelWrapper(ChannelKey.FTPConsume, async (ch: Channel) => {
      let assertQueue = await ch.assertQueue(queue.name, queue.options)
      await ch.bindQueue(assertQueue.queue, MQClient.Exchange, '')
      return await ch.consume(queue.name, (data) => {
        try {
          let message = JSON.parse(data!.content.toString())
          return handler(message).then(() => {
            ch.ack(data!)
            return Promise.resolve(data)
          })
        } catch (error) {
          logger.error(`Malformed message from queue ${queue.name}`, error, data)
        }
      })
    })
    wrapper
      .waitForConnect()
      .then(() => {
        logger(`Consumption from ${queue.name} started!`)
      })
      .catch((e) => logger.error('Consumption error', e))
  }

  webConsume(token, handler: (data: any) => Promise<any>) {
    let queue = QUEUE.GPS_LIVE
    let nameWithToken = queue.name + '-' + token

    return new Promise<() => void>((resolve) => {
      let wrapper = this.getChannelWrapper(ChannelKey.WebConsume)
      wrapper.addSetup(async (ch) => {
        let assertQueue = await ch.assertQueue(nameWithToken, queue.options)
        await ch.bindQueue(assertQueue.queue, MQClient.Exchange, '')
        let consume = await ch.consume(nameWithToken, (data) => {
          try {
            let message = JSON.parse(data!.content.toString())
            return handler(message).then(() => {
              ch.ack(data!)
              return Promise.resolve(data)
            })
          } catch (error) {
            logger.error(`Malformed message from queue ${queue.name}`, error, data)
          }
        })
        // return a teardown function for caller
        resolve(() => ch.cancel(consume.consumerTag))
      })
      wrapper
        .waitForConnect()
        .then(() => {
          logger(`Consumption from ${queue.name} started!`)
        })
        .catch((e) => logger.error('Consumption error', e))
    })
  }

  async shutdown() {
    connection.close(() => {
      logger('MQ client shut down')
    })
  }
}

const QUEUE = {
  GPS_UPLOAD: {
    name: 'GPS_UPLOAD',
    options: { durable: true },
  },
  GPS_LIVE: {
    name: 'GPS_LIVE',
    options: {
      durable: false,
      arguments: {
        'x-message-ttl': 10000, // 10sec,
        'x-max-length': 1000,
        'x-expires': 180000, // 3min
      },
    },
  },
  GPS_LOG: {
    name: 'GPS_LOG',
    options: {
      durable: true,
    },
  }
}

export const client = new MQClient()
