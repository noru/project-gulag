import React from 'react'
import { withMap } from '@uiw/react-baidu-map'
import { WithMapProps } from '@uiw/react-baidu-map/lib/cjs/withMap'
import { attempt } from '@drewxiu/utils/lib'

const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
const wsUrl = protocol + '//' + window.location.host + '/ws/gps'

class Map extends React.Component<Required<WithMapProps>> {
  static paintInterval = 5000

  markers = {}
  intervalId: any = 0

  client!: WebSocket
  initMap() {
    const { BMap, map } = this.props
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
  }

  onMessage = ({ data }) => {
    let mark = attempt(() => JSON.parse(data))
    console.log(data)
    if (mark) {
      this.markers[mark.imei] = mark
    }
  }

  onError = () => {
    this.initWS()
  }

  paintMarkers() {
    const { BMap, map } = this.props
    this.clearMarkers()
    Object.entries(this.markers).forEach(([_, mark]) => {
      let marker = new BMap.Marker(mark as any)
      marker['type'] = 'marker'
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
