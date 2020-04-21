import { observable } from 'mobx'
import { adminService } from '#/services'

export const PersonaleStore = observable({
  personales: [],

  async getPersonale(id: string) {
    return (
      this.personales.find((p) => p.id === id) ||
      (await adminService.getPersonaleById(id))
    )
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