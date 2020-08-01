import { randomInt } from '@drewxiu/utils/lib'
import { GPSMessage } from '@/types/shared'
import { dateStr } from '#/utils'
import { IPersonale } from '@/clients/mongo/models/personale'
import { LineSegment } from '#/utils/geo'
import groundOverlayUrl from '#/assets/img/ground_overlay2.png'

export { groundOverlayUrl }

const token = randomInt(1000000000) + '' // mark uniqueness of the client, backend use it to create a dedicated queue for streaming data
const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
export const wsUrl = `${protocol}//${window.location.host}/ws/gps/${token}`

export const LoadingText = '加载中...'
export const infoWindowTemplate = (mark: GPSMessage, person?: IPersonale) => {
  let { imei, t, v } = mark
  let { name = LoadingText, id = LoadingText, jobTitle = LoadingText } = person || {}
  let date = dateStr(t)
  let batteryBar = (v / 22) | 0
  return `
    <div class="infowindow personale-marker">
      <div class="infowindow-row">
        <span>IMEI：</span>
        <span>${imei}</span>
      </div>
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

let mark
export function calculateRate() {
  let l = mark
  mark = Date.now()
  if (!l) {
    return 0
  }
  return 1000 / (mark - l)
}

export const BaiduOffset = {
  lng: 0.019619,
  lat: 0.007544,
}

export function applyOffset2(lng, lat) {
  return [lng + BaiduOffset.lng, lat + BaiduOffset.lat]
}

export function applyOffset(p: BMap.Point): BMap.Point {
  return {
    lng: p.lng + BaiduOffset.lng,
    lat: p.lat + BaiduOffset.lat,
  }
}

export const Center = { lng: 119.753755, lat: 49.387735 }

export const RestrictArea = [
  { lng: 119.691499503, lat: 49.416186823 },
  { lng: 119.801371086, lat: 49.416020814 },
  { lng: 119.801122579, lat: 49.362261496 },
  { lng: 119.691371308, lat: 49.362422946 },
].map(applyOffset)

export function normalizeLL({ lng, lat }) {
  let x = (lng - Center.lng) * 100
  let y = (lat - Center.lat) * 100
  return { x, y }
}

export const RestrictAreaPoint = RestrictArea.map(normalizeLL).reduce((prev, next, i, arr) => {
  let p2 = arr[i + 1] || arr[0]
  prev.push({ p1: next, p2 })
  return prev
}, [] as LineSegment[])

export const groundOverlayBound: [BMap.Point, BMap.Point] = [
  { lng: 119.691371308, lat: 49.362422946 },
  { lng: 119.801371086, lat: 49.416020814 },
].map(applyOffset) as [BMap.Point, BMap.Point]
