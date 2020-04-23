import { client } from '#/clients/mq'
import { getLogger } from '#/utils'
import Router from 'koa-router'
import { random } from '@drewxiu/utils/cjs'
import { LocationMessage } from '#/models/location'

const router = new Router()
const logger = getLogger('MOCK')

// var req = coap.request('coap://localhost')

let mocks = new Map()

router.get('/api/mock/gps', (ctx) => {
  let { count = 10 } = ctx.request.query
  let seed = mocks.size + ''
  mocks.set(
    seed,
    Array.from({ length: count }).map((_, i) => PosGenerator(seed, i)),
  )
  logger('Mock created and start steaming data...')
  startMockGPS(seed)
  ctx.body = seed
})

router.delete('/api/mock/gps/:seed', (ctx) => {
  let { seed } = ctx.params
  if (mocks.has(seed)) {
    mocks.delete(seed)
    ctx.status = 200
    logger('Mock deleted')
  } else {
    ctx.status = 404
  }
})

export const mock = router.routes()

const MOCK_INTERVAL = 10000
const CENTER = { lng: 120.2027911, lat: 49.14078494 }
async function startMockGPS(seed: string) {
  let initials = mocks.get(seed)

  if (!initials || initials.length === 0) return

  for (let i = 0; i < initials.length; i++) {
    let init = initials[i]
    let json: LocationMessage = {
      IMSI: init.imei,
      Latitude: init.lat += random(-1, 1) * 0.0005,
      Longitude: init.lng += random(-1, 1) * 0.0008,
      Altitude: 123,
      Speed: random(0, 10),
      Direction: random(0, 4),
      Volts: random(1, 100),
      UTC: Date.now(),
    }
    client.publishGPS(json)
    await new Promise((resolve) => {
      setTimeout(resolve, MOCK_INTERVAL / initials.length)
    })
  }
  setTimeout(startMockGPS, 0, seed)
}

function PosGenerator(seed: string, i: number) {
  let imei = '000000000000000' + seed + i
  imei = imei.substring(imei.length - 15)
  return {
    ...CENTER,
    imei,
  }
}
