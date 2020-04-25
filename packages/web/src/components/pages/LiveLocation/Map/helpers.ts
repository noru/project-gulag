import { randomInt } from '@drewxiu/utils/lib'
import { GPSMessage } from '@/types/shared'
import { dateStr } from '#/utils'
import { IPersonale } from '@/clients/mongo/models/personale'

const token = randomInt(1000000000) + '' // mark uniqueness of the client, backend use it to create a dedicated queue for streaming data
const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
export const wsUrl = `${protocol}//${window.location.host}/ws/gps/${token}`

export const LoadingText = '加载中...'
export const infoWindowTemplate = (mark: GPSMessage, person?: IPersonale) => {
  let { imei, t, v } = mark
  let { name = LoadingText, id = LoadingText, jobTitle = LoadingText } = person || {}
  let date = dateStr(t)
  if (v > 80) v = 100
  if (v < 15) v = 0
  let batteryBar = (v / 25) | 0
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
    data: GPSMessage
    marker: BMap.Marker
    type: MarkerType
  }
}
