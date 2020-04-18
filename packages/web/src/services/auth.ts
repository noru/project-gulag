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
}

export const authService = new AuthService()
