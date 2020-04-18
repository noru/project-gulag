import { client } from './axios'

class AuthService {
  login(username: string, password: string) {
    return client.post('/api/authenticate', { username, password }).then((resp) => resp.data)
  }

  reauth() {
    return client.post('/api/reauth')
  }
}

export const authService = new AuthService()
