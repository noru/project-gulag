import { observable } from 'mobx'
import { adminService } from '#/services'
import { IPersonale } from '@/clients/mongo/models/personale'

interface PersonaleCache {
  [key: string]: IPersonale
}

export const PersonaleStore = observable({
  personales: [] as IPersonale[],

  personalesById: {} as PersonaleCache,
  personalesByImei: {} as PersonaleCache,

  async getPersonale(id: string) {
    let result: IPersonale =
      this.personalesById[id] ||
      this.personales.find((p) => p.id === id) ||
      (await adminService.getPersonaleById(id))

    this.personalesById[id] = result
    return result
  },

  async getPersonaleByImei(imei: string) {
    let result: IPersonale =
      this.personalesByImei[imei] ||
      this.personales.find((p) => p.imei === imei) ||
      (await adminService.getPersonaleByImei(imei))

    this.personalesByImei[imei] = result
    return result
  },

  async getAllPersonales() {
    this.personales = await adminService.getAllPersonales()
  },

  async createPersonale(data) {
    return await adminService.createPersonale(data)
  },

  async updatePersonale(data) {
    return await adminService.updatePersonale(data)
  },

  async deletePersonale(id: string) {
    await adminService.deletePersonale(id)
    this.getAllPersonales()
  },
})
