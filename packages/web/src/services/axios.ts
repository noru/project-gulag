import axios, { AxiosInstance } from 'axios'
import { identity } from 'lodash'

export const TOKEN_KEY = 'gulag_auth_token'
export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function goAuth() {
  localStorage.removeItem(TOKEN_KEY)
  window.location.href = '/login'
}

function _use(interceptor: any, port: any) {
  if (typeof interceptor === 'function') {
    port.use(interceptor)
  } else {
    port.use(interceptor.resolve, interceptor.reject)
  }
}

function AuthTokenInject(request) {
  if (request.url !== '/api/authenticate') {
    request.headers['x-auth-token'] = getAuthToken() || ''
  }
  return request
}

const ReAuthAfter401 = {
  resolve: identity,
  reject(e) {
    if (e.response.status === 401 || e.response.status === 403) {
      goAuth()
    }
    return Promise.reject(e)
  },
}

const TallyUpRequest = (req) => {
  // KycStore.flyingRequest++
  return req
}

const TallyDownRequest = {
  resolve: (req) => {
    // KycStore.flyingRequest--
    return req
  },
  reject(e) {
    // KycStore.flyingRequest--
    return Promise.reject(e)
  },
}

const RequestInterceptors = [AuthTokenInject, TallyUpRequest]
const ResponseInterceptors = [ReAuthAfter401, TallyDownRequest]

RequestInterceptors.forEach((i) => _use(i, axios.interceptors.request))
ResponseInterceptors.forEach((i) => _use(i, axios.interceptors.response))

export const client: AxiosInstance = axios
