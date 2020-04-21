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

  async reauth() {
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

  async deleteUser(username: string) {
    await client.delete('/api/users/' + username)
  }
}

export const authService = new AuthService()
