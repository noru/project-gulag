import { randomInt } from '@drewxiu/utils/lib'
import { GPSMessage } from '@/types/shared'

const token = randomInt(1000000000) + '' // mark uniqueness of the client, backend use it to create a dedicated queue for streaming data
const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
export const wsUrl = `${protocol}//${window.location.host}/ws/gps/${token}`

export const LoadingText = '加载中...'
export const infoWindowTemplate = (
  imei,
  name = LoadingText,
  id = LoadingText,
  jobTitle = LoadingText,
  time = LoadingText
) => `
<div class="infowindow personale-marker">
  <div class="infowindow-row">
    <span>IMEI：</span>
    <span>${imei}</span>
  </div>
  <div>
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
  <div class="infowindow-row">
    <span>时间：</span>
    <span>${time}</span>
  </div>
</div>
`
export interface Markers {
  [imei: string]: GPSMessage
}
