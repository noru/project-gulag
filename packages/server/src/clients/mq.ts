import { connect, Connection, Channel } from 'amqplib'
import { getLogger } from '#/utils'
const { MQ_HOST, MQ_USER, MQ_PASS } = process.env

const logger = getLogger('MQ Client')

class MQClient {
  static Exchange = 'gps_live'
  connection: Promise<Connection>
  channel: Promise<Channel>
  constructor() {
    this.connection = connect(
      {
        hostname: MQ_HOST,
        username: MQ_USER,
        password: MQ_PASS,
      },
      {
        json: true,
        heartbeatIntervalInSeconds: 5,
        reconnectTimeInSeconds: 10,
      },
    )

    this.channel = this.connection
      .then((conn) => {
        return conn.createChannel()
      })
      .then((ch) => {
        ch.assertExchange(MQClient.Exchange, 'topic', { durable: true })
        return ch
      })
  }

  async publishGPS(gpsData) {
    let ch = await this.channel
    ch.publish(MQClient.Exchange, '', Buffer.from(JSON.stringify(gpsData)))
  }

  ftpConsume(handler) {
    let queue = QUEUE.GPS_UPLOAD
    ;(async () => {
      let ch = await this.channel
      let assertQueue = await ch.assertQueue(queue.name, queue.options)
      ch.bindQueue(assertQueue.queue, MQClient.Exchange, ''),
        ch.consume(queue.name, (data) => {
          try {
            let message = JSON.parse(data!.content.toString())
            return handler(message).then(() => {
              ch.ack(data!)
              return Promise.resolve(data)
            })
          } catch (error) {
            logger.error(`Got malformed message from queue ${queue.name}`, error, data)
          }
        })
    })()
  }

  webConsume(token, handler: (data: any) => Promise<any>) {
    let queue = QUEUE.GPS_LIVE
    let nameWithToken = queue.name + '-' + token
    return (async () => {
      let ch = await this.channel
      let assertQueue = await ch.assertQueue(nameWithToken, queue.options)
      ch.bindQueue(assertQueue.queue, MQClient.Exchange, '')
      let consumer = await ch.consume(nameWithToken, (data) => {
        try {
          let message = JSON.parse(data!.content.toString())
          return handler(message).then(() => {
            ch.ack(data!)
            return Promise.resolve(data)
          })
        } catch (error) {
          logger.error(`Got malformed message from queue ${queue.name}`, error, data)
        }
      })
      return () => {
        ch.cancel(consumer.consumerTag)
      }
    })()
  }

  async shutdown() {
    await (await this.channel).close()
    await (await this.connection).close()
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
      durable: true,
      arguments: {
        'x-message-ttl': 10000, // 10sec,
        'x-max-length': 1000,
      },
    },
  },
}

export const client = new MQClient()
