import { connection } from '../clients/mongo'

const PersonaleModel = connection.model('Personale')

class PersonaleModule {
  async getUserByID(Id: string) {
    return await PersonaleModel.findOne({ Id })
  }

  async getUserByIMSE(IMSI: string) {
    return await PersonaleModel.findOne({ IMSI })
  }

  async upsertUser(user) {
    return await new PersonaleModel({
      ...user,
    }).save()
  }
}

export default new PersonaleModule()
