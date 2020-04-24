import { client } from '../clients/mq'
import { LocationMeta } from '../models/location'
import { dateStr, getLogger } from '../utils'
import fs from 'fs'
import personaleModule from '../modules/personale'

const logger = getLogger('Worker')
const TENENT = '140102B0011010199002'

class LocationLogGenerator {
  static Interval = 60000 // 60 sec

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
          let date = dateStr()
          let fileName = `${TENENT}_SSSJ_${date.replace(/:/g, '_')}.txt`
          let fileBody = `${date};${this.LocationRecords.length}~` + (await this.getLines()) + '~||'
          this.LocationRecords = []

          fs.writeFile(process.env.FTP_LOCAL_DIR + '/' + fileName, fileBody, function (e) {
            if (e) {
              logger.error(e)
            } else {
              logger(`File Generated: ${fileName}`)
            }
          })
        }
      } catch (e) {
        logger.error(e)
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

      lines.push(
        LocationLineFormatter(
          loc.IMSI,
          loc.Longitude,
          loc.Latitude,
          loc.Altitude,
          dateStr(loc.UTC, 8),
          '采区一',
          user.vehicleTerminalId,
          user.vehicleId,
          '1',
          '1',
        ),
      )
    }

    return lines.join('~')
  }
}

const locationLogGenerator = new LocationLogGenerator()

client.ftpConsume((data) => {
  logger('Incomming location record')
  locationLogGenerator.push(data)
  return Promise.resolve()
})

const LocationLineFormatter = (
  imei,
  latitude,
  longitude,
  altitude,
  datetime,
  area,
  vehicleTerminalId = '',
  vehicleId = '',
  terminalStatus = '1',
  personStatus = '1',
) => {
  // 1	车载定位终端编号
  // 2	车辆编号
  // 3	人员卡编码
  // 4	经度	2000 国家大地坐标系
  // 5	纬度	2000 国家大地坐标系
  // 6	高程	单位米，精确到毫米
  // 7	时间
  // 8	区域位置
  // 9	车载定位终端状态	1-正常;2-超速报警；3-超时停车；4-紧急报警；5-系统掉电；6-越界报警
  // 10	人员状态	1-在线；2-掉线
  // e.g. 140102B001101010000290001;车辆编号;140102B001101000000200001;116.397784;39.916321;75.000;2016-06-24 11:24:24;采区一;1;1
  return `${vehicleTerminalId};${vehicleId};${imei};${latitude};${longitude};${altitude};${datetime};${area};${terminalStatus};${personStatus};`
}
