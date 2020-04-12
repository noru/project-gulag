import MQClient, { QUEUE } from '../clients/mq'
import { Location, LocationMeta } from '../models/location'
import { dateStr } from '../utils'
import fs from 'fs'
import PersonaleModule from '../modules/personale'

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

setTimeout(async () => {
  // PersonaleModule.upsertUser({
  //   Id: '123123',
  //   IMSI: '41234124123',
  // })
  let result = await PersonaleModule.getById('123123')
  console.log('test mongo', result)
}, 3000)
;`46,0114013436303131333031333936303533371A5E8EBB7501589FAE06CA2D460000000020000C00070007000053C2
46,0114013436303131333033363633373234361A5E92D5FA01589FBB06CA2D57000000004C004D001B001B00003B03
46,0114013436303131333033363633373234361A5E92D62201589FE806CA2D5D000000FF03004C001B001B00003E17
46,0114013436303131333033363633373234361A5E92D65B01589F2F06CA2D61000000000E004A001B001B00003FA6
46,0114013436303131333033363633373234361A5E92D69D01589E9D06CA2D53020000000E001D001D001D00003F20
46,0114013436303131333033363633373234361A5E92D6D301589DE906CA2E5600000000700047001B001B00003E2A
46,0114013436303131333033363633373234361A5E92D6FF01589F6206CA2E0700000000A30046001B001B00003FB5
46,0114013436303131333033363633373234361A5E92D75C01589F7906CA2CA4000000000A0038000B000B00003EFD`
  .split('\n')
  .forEach((str) => {
    let location = new Location(str)
    console.log(location.isValid)
    if (location.isValid) {
      MQClient.publish({ queue: { name: QUEUE.GPS_UPLOAD } }, location.toJson())
    }
  })
