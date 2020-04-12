import mongoose from 'mongoose'
import { Personale } from './models/personale'

mongoose.model('Personale', Personale)

const connect = async () =>
  await mongoose.connect(
    `mongodb://${process.env.MONGO_HOST}/${process.env.MONGO_DB}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      user: process.env.MONGO_USER,
      pass: process.env.MONGO_PASS,
      authSource: 'admin',
    },
  )

export const connection = mongoose.connection

connection.on('connected', () => {
  console.info('MongoDB successfully connected')
})

connection.on('disconnected', () => {
  console.info('MongoDB disconnected. Retrying...')
  connect()
})

connect()

export default connection
