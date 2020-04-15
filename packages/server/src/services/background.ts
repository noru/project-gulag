import MQClient, { QUEUE } from '../clients/mq'
import { LocationMeta } from '../models/location'
import { dateStr } from '../utils'
import fs from 'fs'

class LocationLogGenerator {
  static Limit = 100
  static Interval = 60000 // 60 sec

  LocationRecords: LocationMeta[] = []

  constructor() {
    this.generate()
  }

  push(location: LocationMeta) {
    this.LocationRecords.push(location)
  }

  generate() {
    setTimeout(() => {
      try {
        if (this.LocationRecords.length > 0) {
          console.info('Generating Location File...')
          let date = dateStr()
          let fileName = `${'单位编码'}_SSSJ_${date}.txt`
          let fileBody =
            `${date};${this.LocationRecords.length}~` + this.getLines() + '~||'
          this.LocationRecords = []

          console.info(`File Name: ${fileName}`)
          fs.writeFile(
            process.env.FTP_LOCAL_DIR + '/' + fileName.replace(/:/g, '_'),
            fileBody,
            function (e) {
              if (e) {
                // TODO: logging
                console.error(e)
              } else {
                console.info(`File Generated: ${fileName}`)
              }
            },
          )
        }
      } catch (error) {
        // TODO: logging
      }
      this.generate()
    }, LocationLogGenerator.Interval)
  }

  getHeader() {
    return
  }

  getLines() {
    return this.LocationRecords.map((loc) =>
      LocationLineFormatter(
        '0',
        '0',
        'person',
        loc.Longitude,
        loc.Latitude,
        loc.Altitude,
        dateStr(loc.UTC, 8),
        '采区一',
        '1',
        '1',
      ),
    ).join('~')
  }
}

const locationLogGenerator = new LocationLogGenerator()

MQClient.consume({ queue: { name: QUEUE.GPS_UPLOAD } }, (data) => {
  console.info('Incomming location record')
  locationLogGenerator.push(data)
  return Promise.resolve()
})

const LocationLineFormatter = (
  terminalId,
  vehicleId,
  personId,
  latitude,
  longitude,
  altitude,
  datetime,
  area,
  terminalStatus,
  personStatus,
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
  return `${terminalId};${vehicleId};${personId};${latitude};${longitude};${altitude};${datetime};${area};${terminalStatus};${personStatus};`
}

// setTimeout(async () => {
//   // PersonaleModule.upsertUser({
//   //   Id: '123123',
//   //   IMSI: '41234124123',
//   // })
//   let result = await PersonaleModule.getById('123123')
//   console.log('test mongo', result)
// }, 3000)
