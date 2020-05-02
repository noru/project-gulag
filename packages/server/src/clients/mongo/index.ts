import mongoose from 'mongoose'
import { getLogger } from '../../utils'
import personale from './models/personale'
import user from './models/user'
import metadata from './models/meta'
import gps from './models/gps'

const logger = getLogger('DB')

const connect = async () =>
  await mongoose.connect(`mongodb://${process.env.MONGO_HOST}/${process.env.MONGO_DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASS,
    authSource: process.env.MONGO_DB,
  })

export const connection = mongoose.connection

connection.on('connected', () => {
  logger('MongoDB successfully connected')
})

connection.on('disconnected', () => {
  logger('MongoDB disconnected. Retrying...')
  connect()
})

connect()

class MongoClient {
  connection = connection
  metadata = metadata
  user = user
  personale = personale
  gps = gps
}

export default new MongoClient()
