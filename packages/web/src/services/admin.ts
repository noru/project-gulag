import { client } from './axios'
import { Moment } from 'moment'

class AdminService {
  async getPersonaleById(id) {
    return await client.get('/api/personales/' + id).then((resp) => resp.data.detail)
  }

  async getPersonaleByImei(imei) {
    return await client.get(`/api/personales/${imei}?type=imei`).then((resp) => resp.data.detail)
  }
  async getAllPersonales() {
    return await client.get('/api/personales').then((resp) => resp.data)
  }

  async createPersonale(data) {
    return await client.post('/api/personales', data).then((resp) => resp.data)
  }

  async updatePersonale(data) {
    return await client.put('/api/personales/' + data.id, data).then((resp) => resp.data)
  }

  async deletePersonale(id: string) {
    return await client.delete(`/api/personales/${id}`)
  }

  async getTrack(imei, from = Date.now() - 86400000, to = Date.now()) {
    return await client.get(`/api/gps/logs/${imei}?from=${from}&to=${to}`).then((resp) => resp.data)
  }

  async isAttendant(imei, date: Moment) {
    let from = date.startOf('day').valueOf()
    let to = date.endOf('day').valueOf()
    return await client.head(`/api/gps/logs/peek/${imei}?from=${from}&to=${to}`)
  }

  async getAttendanceReport(from: Moment, to: Moment) {
    return await client
      .get(`/api/attendanceReport?from=${from.valueOf()}&to=${to.valueOf()}`)
      .then((resp) => resp.data)
  }
}

export const adminService = new AdminService()
