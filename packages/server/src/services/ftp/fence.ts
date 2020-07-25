import { getLogger, dateStrOnlyNum, dateStr } from '../../utils'
import fs from 'fs'
import { TENANT } from './location'
import { Fence, FenceVertex } from '#/types/shared'
import { CronJob } from 'cron'

const logger = getLogger('Fence Worker')

const fence: Fence = {
  id: '150724B001200051005400001',
  name: '采区一',
  outer: [
    { id: '0001', index: 1, lng: 120.2781947, lat: 49.18461658, alt: 659.0 },
    { id: '0002', index: 2, lng: 120.2938367, lat: 49.14605369, alt: 659.0 },
    { id: '0003', index: 3, lng: 120.1884636, lat: 49.10852722, alt: 659.0 },
    { id: '0004', index: 4, lng: 120.0943625, lat: 49.14332039, alt: 659.0 },
  ],
  inner: [],
}

class FenceDataGenerator {

  generate() {
    try {
      logger(`Generating Fence File ...`)
      let date = dateStrOnlyNum()
      let fileName = `${TENANT}_DZWL_${date}.txt`
      let headLine = `${dateStr()};${fence.outer.length}~`
      let outer = `${fence.id};${fence.name};${this.getLines(fence.outer)};`
      let inner = `${fence.inner.map((i) => this.getLines(i)).join('/')}`

      let fileBody = headLine + outer + inner + '~||'
      fs.writeFile(process.env.FTP_LOCAL_DIR + '/' + fileName, fileBody, function (e) {
        if (e) {
          logger.error('WriteFileError', fileName, e)
        } else {
          logger(`Fence File Generated: ${fileName}`)
        }
      })
    } catch (e) {
      logger.error('GenerationError', e)
    }
  }

  getLines(vertices: FenceVertex[]) {
    // 4	经度	2000 国家大地坐标系
    // 5	纬度	2000 国家大地坐标系
    // 6	高程	单位米，精确到毫米
    return vertices.map((v) => `${v.lat},${v.lng},${v.alt}`).join('&')
  }
}

export const fenceDataGenerator = new FenceDataGenerator()

const job = new CronJob('00 00 00 * * *', function () {
  fenceDataGenerator.generate()
})
job.start()