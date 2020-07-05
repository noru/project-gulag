import { dateStr } from '#/utils'

export interface TrackPoint {
  Altitude: number
  Direction: number
  IMSI: string
  Latitude: number
  Longitude: number
  Speed: number
  UTC: number
  Volts: number
}

export const infoWindowTemplate = (data: TrackPoint) => {
  let { Latitude, Longitude, Direction, Speed, UTC, Volts } = data
  let date = dateStr(UTC)
  let batteryBar = (Volts / 22) | 0
  return `
  <div class="infowindow personale-marker">
    <div class="infowindow-row">
      <span>时间：</span>
      <span>${date}</span>
    </div>
    <div class="infowindow-row">
      <span>经度：</span>
      <span>${Longitude}</span>
    </div>
    <div class="infowindow-row">
      <span>纬度：</span>
      <span>${Latitude}</span>
    </div>
    <div class="infowindow-row">
      <span>方向：</span>
      <span>${Direction}</span>
    </div>
    <div class="infowindow-row">
      <span>速度：</span>
      <span>${Speed}</span>
    </div>
    <div class="infowindow-row">
      <span>电量：</span>
      <span>${Volts}%
        <span class="battery bar-${batteryBar}">${'<i></i>'.repeat(batteryBar)}</span>
      </span>
    </div>
  </div>
  `
}
