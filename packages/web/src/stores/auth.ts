import { observable } from 'mobx'
import { authService } from '#/services'
import { TOKEN_KEY } from '#/services/axios'
import { attempt } from '@drewxiu/utils/lib'
import jwtDecode from 'jwt-decode'

let reauthTimer

export const AuthStore = observable({
  users: [],
  user: attempt(() => jwtDecode(localStorage.getItem(TOKEN_KEY)!).payload, null),

  get isAuthenticated() {
    return !!this.user
  },

  async createUser(data) {
    await authService.createUser(data)
  },
  async deleteUser(username: string) {
    await authService.deleteUser(username)
    this.getUsers()
  },
  async getUser(username: string) {
    return this.users.find((u) => u.username === username) || (await authService.getUser(username))
  },
  async getUsers() {
    this.users = await authService.getUsers()
  },

  async login(username: string, password: string) {
    this.user = await authService.login(username, password)
    return this.user
  },

  logout() {
    clearTimeout(reauthTimer)
    localStorage.removeItem(TOKEN_KEY)
  },
})
