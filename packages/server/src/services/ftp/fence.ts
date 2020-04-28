import { getLogger, dataStrOnlyNum } from '../../utils'
import fs from 'fs'
import { TENANT } from './location'
import { Fence } from '#/types/shared'

const logger = getLogger('Location Worker')

const fence: Fence = {
  id: '140102B001101019900200001',
  name: '采区一',
  vertices: [
    { id: '0001', index: 1, lng: 120.2781947, lat: 49.18461658, alt: 659 },
    { id: '0002', index: 2, lng: 120.0943625, lat: 49.14332039, alt: 659 },
    { id: '0003', index: 3, lng: 120.1884636, lat: 49.10852722, alt: 659 },
    { id: '0004', index: 4, lng: 120.2938367, lat: 49.14605369, alt: 659 },
  ],
}

class FenceDataGenerator {
  static Interval = 60000 * 60 * 24 // 1 day

  constructor() {
    this.generate()
  }

  generate() {
    setTimeout(async () => {
      try {
        logger(`Generating Personales File ...`)
        let date = dataStrOnlyNum()
        let fileName = `${TENANT}_DZWL_${date}.txt`
        let headLine = `${date};${fence.vertices.length}~`
        let fileBody = headLine + this.getLines(fence) + '~||'
        fs.writeFile(process.env.FTP_LOCAL_DIR + '/' + fileName, fileBody, function (e) {
          if (e) {
            logger.error(e)
          } else {
            logger(`Fence File Generated: ${fileName}`)
          }
        })
      } catch (e) {
        logger.error(e)
      }
      this.generate()
    }, FenceDataGenerator.Interval)
  }

  getLines(fence: Fence) {
    // 1	围栏区域编码
    // 2	区域说明
    // 3	在本区域内拐点编码
    // 4	经度	2000 国家大地坐标系
    // 5	纬度	2000 国家大地坐标系
    // 6	高程	单位米，精确到毫米
    let { id, name, vertices } = fence
    let common = `${id};${name}`
    return vertices.map((v) => `${common};${v.lat};${v.lng};${v.alt}`).join('~')
  }
}

export const fenceDataGenerator = new FenceDataGenerator()
