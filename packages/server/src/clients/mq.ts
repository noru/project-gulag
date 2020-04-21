import RabbitMQClient from 'node-rabbitmq-client'

export const QUEUE = {
  GPS_UPLOAD: {
    name: 'GPS_UPLOAD',
  } ,
  GPS_LIVE : {
    name: 'GPS_LIVE',
    options: {
      durable: true,
      arguments: {
        'x-message-ttl': 10000, // 10sec,
        'x-max-length': 1000
      }
    }
  }
}



const client = new RabbitMQClient({
  port: 5672,
  host: process.env.MQ_HOST,
  username: process.env.MQ_USER,
  password: process.env.MQ_PASS,
})


export default client
