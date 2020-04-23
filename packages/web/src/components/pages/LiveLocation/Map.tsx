import React from 'react'
import { withMap } from '@uiw/react-baidu-map'
import { WithMapProps } from '@uiw/react-baidu-map/lib/cjs/withMap'
import { attempt, randomInt } from '@drewxiu/utils/lib'
import { GPSMessage } from '@/types/shared'
import { PersonaleStore } from '#/stores'

const token = randomInt(1000000000) + '' // mark uniqueness of the client, backend use it to create a dedicated queue for streaming data
const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
const wsUrl = `${protocol}//${window.location.host}/ws/gps/${token}`
const LoadingText = '加载中...'
const infoWindowTemplate = (
  imei,
  name = LoadingText,
  id = LoadingText,
  jobTitle = LoadingText
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
</div>
`
const infoWindowOffset = { width: 10, height: -10 }
interface Markers {
  [imei: string]: GPSMessage
}
class Map extends React.Component<Required<WithMapProps>> {
  static paintInterval = 5000

  intervalId: any = 0
  markers: Markers = {}
  infoWindow!: BMap.InfoWindow

  client!: WebSocket
  initMap() {
    const { BMap, map } = this.props
    this.infoWindow = new BMap.InfoWindow('', { offset: infoWindowOffset })

    setTimeout(() => {
      map.enableScrollWheelZoom()
      map.centerAndZoom(new BMap.Point(120.2027911, 49.14078494), 12)
      map.addControl(new BMap.NavigationControl())
      let restrictArea = new BMap.Polygon([
        { lng: 120.2781947, lat: 49.18461658 },
        { lng: 120.0943625, lat: 49.14332039 },
        { lng: 120.1884636, lat: 49.10852722 },
        { lng: 120.2938367, lat: 49.14605369 },
      ])
      restrictArea.setFillOpacity(0.8)
      map.addOverlay(restrictArea)
    }, 1000)
  }

  initWS() {
    let client = new WebSocket(wsUrl)!
    client.onmessage = this.onMessage
    client.onerror = this.onError
    client.onclose = this.onClose
    this.client = client
  }

  onMessage = ({ data }) => {
    let mark = attempt(() => JSON.parse(data))
    console.debug('Incomming', data)
    if (mark) {
      this.markers[mark.imei] = mark
    }
  }

  onError = () => {
    this.initWS()
  }

  onClose = () => {
    console.debug('WS closed')
  }

  paintMarkers() {
    const { BMap, map } = this.props
    this.clearMarkers()
    Object.entries(this.markers).forEach(([_, mark]) => {
      let { lng, lat } = mark
      let marker = new BMap.Marker({ lat, lng })
      marker['type'] = 'marker'
      marker.addEventListener('mouseover', () =>
        this.showInfoWindow(mark, marker)
      )
      marker.addEventListener('mouseout', () => this.closeInfoWindow(marker))
      map.addOverlay(marker)
    })
  }

  clearMarkers() {
    const { map } = this.props
    let all = map.getOverlays()
    all.forEach((i) => {
      if (i['type'] === 'marker') {
        map.removeOverlay(i)
      }
    })
  }

  showInfoWindow(mark: GPSMessage, marker: BMap.Marker) {
    this.infoWindow.setContent(infoWindowTemplate(mark.imei))
    PersonaleStore.getPersonaleByImei(mark.imei).then((personale) =>
      this.infoWindow.setContent(
        infoWindowTemplate(
          mark.imei,
          personale.name,
          personale.id,
          personale.jobTitle
        )
      )
    )
    marker.openInfoWindow(this.infoWindow)
  }

  closeInfoWindow = (marker: BMap.Marker) => {
    marker.closeInfoWindow()
  }

  componentDidMount() {
    this.initMap()
    this.initWS()
    this.intervalId = setInterval(() => {
      this.paintMarkers()
    }, Map.paintInterval)
  }

  componentWillUnmount() {
    clearInterval(this.intervalId)
    this.client && this.client.close()
  }

  render() {
    return null
  }
}

export const CustomMap = withMap(Map as any)
