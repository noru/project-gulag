import { observable } from 'mobx'
import { authService } from '#/services'
import { TOKEN_KEY } from '#/services/axios'
import { attempt } from '@drewxiu/utils/lib'
import jwtDecode from 'jwt-decode'

export const AuthStore = observable({
  user: attempt(
    () => jwtDecode(localStorage.getItem(TOKEN_KEY)!).payload,
    null
  ),

  get isAuthenticated() {
    return !!this.user
  },

  async login(username: string, password: string) {
    this.user = authService.login(username, password)
    function reauth() {
      authService.reauth()
      setTimeout(reauth, 60 * 1000 * 25)
    }
    reauth()
  },
})
