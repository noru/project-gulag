import { GPSMessage } from '@/types/shared'
import { dateStr } from '#/utils'
import { IPersonale } from '@/clients/mongo/models/personale'

export const infoWindowTemplate = (mark: GPSMessage, person?: IPersonale) => {
  let { imei, t, v } = mark
  let { name, id, jobTitle } = person || {}
  let date = dateStr(t)
  let batteryBar = (v / 22) | 0
  return `
  <div class="infowindow personale-marker">
    <div class="infowindow-row">
      <span>IMEI：</span>
      <span>${imei}</span>
    </div>
    <div>
    <div class="infowindow-row">
      <span>时间：</span>
      <span>${date}</span>
    </div>
    <div class="infowindow-row">
      <span>电量：</span>
      <span>${v}%
        <span class="battery bar-${batteryBar}">${'<i></i>'.repeat(batteryBar)}</span>
      </span>
    </div>
    <div class="infowindow-row">
      <span>姓名：</span>
      <span>${name}</span>
    </div>
    <div class="infowindow-row">
      <span>人员卡编码：</span>
      <span>${id}</span>
    </div>
    <div class="infowindow-row">
      <span>工种：</span>
      <span>${jobTitle}</span>
    </div>
    
  </div>
  `
}

export enum MarkerType {
  Personale,
}

export interface Markers {
  [imei: string]: {
    type: MarkerType
    marker: BMap.Marker
    data: GPSMessage
    receivedAt: number
    alert: boolean
  }
}
