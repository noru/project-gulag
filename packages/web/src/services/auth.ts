import { client, TOKEN_KEY } from './axios'
import jwtDecode from 'jwt-decode'
class AuthService {
  async login(username: string, password: string) {
    let {
      data: { token },
    } = await client.post('/api/authenticate', {
      username,
      password,
    })
    return this.decodeAndCache(token)
  }

  reauth = async () => {
    const {
      data: { token },
    } = await client.post('/api/reauth')
    this.decodeAndCache(token)
  }

  private decodeAndCache(token: string) {
    localStorage.setItem(TOKEN_KEY, token)
    return jwtDecode(token).payload
  }

  async getUser(username: string) {
    let {
      data: { detail },
    } = await client.get('/api/users/' + username)
    return detail
  }

  async getUsers() {
    let { data } = await client.get('/api/users')
    return data
  }

  async createUser(data) {
    await client.post('/api/users', data)
  }

  async updateUser(username: string, data) {
    await client.put('/api/users/' + username, data)
  }

  async updateUserPassword(username: string, data: { oldPassword: string; newPassword: string }) {
    await client.put(`/api/users/${username}/password`, data)
  }

  async deleteUser(username: string) {
    await client.delete('/api/users/' + username)
  }
}

export const authService = new AuthService()
