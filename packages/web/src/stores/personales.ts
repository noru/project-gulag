import { observable } from 'mobx'
import { adminService } from '#/services'

export const PersonaleStore = observable({
  personales: [],

  async getAllPersonales() {
    this.personales = await adminService.getAllPersonales()
  },
})
