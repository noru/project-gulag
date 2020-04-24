import React from 'react'
import { withMap } from '@uiw/react-baidu-map'
import { WithMapProps } from '@uiw/react-baidu-map/lib/cjs/withMap'
import { attempt } from '@drewxiu/utils/lib'
import { GPSMessage } from '@/types/shared'
import { PersonaleStore } from '#/stores'
import { dateStr } from '#/utils'
import { Markers, wsUrl, infoWindowTemplate } from './helpers'
import spritesheet from '#/assets/img/marker.png'

class Map extends React.Component<Required<WithMapProps>> {
  static paintInterval = 5000

  intervalId: any = 0
  markers: Markers = {}
  infoWindow!: BMap.InfoWindow
  icons!: {
    normal: BMap.Icon
    warn: BMap.Icon
    outdated: BMap.Icon
  }

  client!: WebSocket

  initOverlays() {
    const { BMap } = this.props
    this.icons = {
      normal: new BMap.Icon(spritesheet, new BMap.Size(20, 29), {
        imageOffset: new BMap.Size(-20, 0),
        anchor: new BMap.Size(10, 26),
        infoWindowAnchor: new BMap.Size(10, 0),
      }),
      warn: new BMap.Icon(spritesheet, new BMap.Size(20, 29), {
        anchor: new BMap.Size(10, 26),
        infoWindowAnchor: new BMap.Size(10, 0),
      }),
      outdated: new BMap.Icon(spritesheet, new BMap.Size(20, 29), {
        imageOffset: new BMap.Size(-40, 0),
        anchor: new BMap.Size(10, 26),
        infoWindowAnchor: new BMap.Size(10, 0),
      }),
    }
    this.infoWindow = new BMap.InfoWindow('')
  }

  initMap() {
    const { BMap, map } = this.props
    map.enableScrollWheelZoom()
    map.addControl(new BMap.NavigationControl())
    let restrictArea = new BMap.Polygon([
      { lng: 120.2781947, lat: 49.18461658 },
      { lng: 120.0943625, lat: 49.14332039 },
      { lng: 120.1884636, lat: 49.10852722 },
      { lng: 120.2938367, lat: 49.14605369 },
    ])
    restrictArea.setFillOpacity(0.8)
    map.addOverlay(restrictArea)

    // todo: delte this
    // let marker2 = new BMap.Marker(new BMap.Point(120.2027911, 49.14078494))
    // marker2['type'] = 'test.marker'
    // map.addOverlay(marker2)
    // let marker = new BMap.Marker(new BMap.Point(120.2027911, 49.14078494))
    // marker['type'] = 'test.marker'
    // marker.setIcon(this.icons.outdated)
    // marker.addEventListener('mouseover', () =>
    //   this.showInfoWindow(
    //     {
    //       lng: 120.2027911,
    //       lat: 49.14078494,
    //       imei: '123123123123',
    //       alt: 123,
    //       t: Date.now(),
    //       s: 123,
    //       d: 123,
    //       v: 123,
    //     },
    //     marker
    //   )
    // )
    // marker.addEventListener('mouseout', () => this.closeInfoWindow(marker))
    // map.addOverlay(marker)

    setTimeout(() => {
      // FIXME: auto located to current position
      map.centerAndZoom(new BMap.Point(120.2027911, 49.14078494), 12)
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
    let now = Date.now()
    this.clearMarkers()
    Object.entries(this.markers).forEach(([_, mark]) => {
      let { lng, lat } = mark
      let marker = new BMap.Marker({ lat, lng })
      marker['type'] = 'marker'
      if (now - mark.t > 60000) {
        // 1min
        marker.setIcon(this.icons.outdated)
      }
      if ('not outside') {
        marker.setIcon(this.icons.normal)
      } else {
        marker.setIcon(this.icons.warn)
      }
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
          personale.jobTitle,
          dateStr(mark.t)
        )
      )
    )
    marker.openInfoWindow(this.infoWindow)
  }

  closeInfoWindow = (marker: BMap.Marker) => {
    marker.closeInfoWindow()
  }

  componentDidMount() {
    this.initOverlays()
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