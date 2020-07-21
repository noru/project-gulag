import { client } from '../../clients/mq'
import { LocationMeta } from '../../models/location'
import { getLogger, dateStrOnlyNum } from '../../utils'
import fs from 'fs'
import personaleModule from '../../modules/personale'

const logger = getLogger('FTP')
export const TENANT = '150724B0012000510054'

class LocationLogGenerator {
  static Interval = 30000 // 30 sec

  LocationRecords: LocationMeta[] = []

  constructor() {
    this.generate()
  }

  push(location: LocationMeta) {
    this.LocationRecords.push(location)
  }

  generate() {
    setTimeout(async () => {
      try {
        if (this.LocationRecords.length > 0) {
          logger(`Generating Location File for ${this.LocationRecords.length} records...`)
          let date = dateStrOnlyNum()
          let fileName = `${TENANT}_SSWJ_${date}.txt`
          let fileBody = `${date};${this.LocationRecords.length}~` + (await this.getLines()) + '~||'
          this.LocationRecords = []

          fs.writeFile(process.env.FTP_LOCAL_DIR + '/' + fileName, fileBody, function (e) {
            if (e) {
              logger.error('WriteFileError', fileName, e)
            } else {
              logger(`Location File Generated: ${fileName}`)
            }
          })
        }
      } catch (e) {
        logger.error('GenerationError', e)
      }
      this.generate()
    }, LocationLogGenerator.Interval)
  }

  async getLines() {
    let lines = new Array()

    for (let i = 0; i < this.LocationRecords.length; i++) {
      let loc = this.LocationRecords[i]
      let user = await personaleModule.getByIMSI(loc.IMSI)
      if (!user) continue
      lines.push(LocationLineFormatter(user.id, loc.Longitude, loc.Latitude, loc.Altitude, '采区一', '1'))
    }

    return lines.join('~')
  }
}

const locationLogGenerator = new LocationLogGenerator()

client.ftpConsume((data) => {
  logger('Incoming location record', data)
  locationLogGenerator.push(data)
  return Promise.resolve()
})

const LocationLineFormatter = (imei, latitude, longitude, altitude, area, terminalStatus = '1') => {
  // 1	人员卡编码
  // 2	经度	2000 国家大地坐标系
  // 3	纬度	2000 国家大地坐标系
  // 4	高程	单位米，精确到毫米
  // 5	区域位置
  // 6	人员定位终端状态	1-正常;2-超时报警；3-越界报警；4-呼叫报警；5-系统掉电
  return `${imei};${latitude};${longitude};${altitude};${area};${terminalStatus}`
}
