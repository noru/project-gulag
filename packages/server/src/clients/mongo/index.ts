import mongoose from 'mongoose'
import { getLogger } from '../../utils'
import { Personale } from './models/personale'
import { User } from './models/user'
import metadata from './models/meta'

const logger = getLogger('DB')

const connect = async () =>
  await mongoose.connect(`mongodb://${process.env.MONGO_HOST}/${process.env.MONGO_DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASS,
    authSource: 'admin',
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
  user = mongoose.model('User', User)
  personale = mongoose.model('Personale', Personale)
}

export default new MongoClient()
