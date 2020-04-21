import mongoClient from '../clients/mongo'
import NodeCache from 'node-cache'
import { IPersonaleDoc } from '#/clients/mongo/models/personale'

const cache = new NodeCache({ stdTTL: 3600, checkperiod: 3600 })
const personale = mongoClient.personale

class PersonaleModule {

  async getByIMSI(imei: string) {
    let key = '$imei_' + imei
    let user = cache.get<IPersonaleDoc>(key)
    if (!user) {
      user = await personale.findByIMEI(imei) || undefined
      user && cache.set(key, user)
    }
    return user
  }

}

export default new PersonaleModule()
