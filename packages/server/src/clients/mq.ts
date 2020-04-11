import RabbitMQClient from 'node-rabbitmq-client'

export enum QUEUE {
  GPS_UPLOAD = 'GPS_UPLOAD',
}

const client = new RabbitMQClient({
  port: 5672,
  host: process.env.MQ_HOST,
  username: process.env.MQ_USER,
  password: process.env.MQ_PASS,
})

export default client
