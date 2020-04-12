import { connection } from '../clients/mongo'

const PersonaleModel = connection.model('Personale')

class PersonaleModule {
  async getById(Id: string) {
    return await PersonaleModel.findOne({ Id })
  }

  async getByIMSI(IMSI: string) {
    return await PersonaleModel.findOne({ IMSI })
  }

  async upsert(user) {
    return await new PersonaleModel({
      ...user,
    }).save()
  }
}

export default new PersonaleModule()
