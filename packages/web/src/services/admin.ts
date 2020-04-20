import { client } from './axios'
class AdminService {
  async getAllPersonales() {
    return await client.get('/api/personales').then((resp) => resp.data)
  }

  async updatePersonale(data) {
    return await client
      .put('/api/personales/' + data.id, data)
      .then((resp) => resp.data)
  }
}

export const adminService = new AdminService()
