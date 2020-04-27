import React from 'react'
import { withMap } from '@uiw/react-baidu-map'
import { WithMapProps } from '@uiw/react-baidu-map/lib/cjs/withMap'
import { attempt } from '@drewxiu/utils/lib'
import { GPSMessage } from '@/types/shared'
import { PersonaleStore } from '#/stores'
import { Markers, wsUrl, infoWindowTemplate, MarkerType, calculateRate } from './helpers'
import spritesheet from '#/assets/img/marker.png'
import groundOverlayUrl from '#/assets/img/ground_overlay.png'

interface Props {
  onOpen?: () => void
  onReceive?: (data: any, marks: any, rate?: number) => void
  onClose?: () => void
  mapRef?: (ref: MapControll) => void
}

export class MapControll extends React.Component<Required<WithMapProps> & Props> {
  static paintInterval = 3

  timeoutId: any = 0
  markers: Markers = {}
  infoWindow!: BMap.InfoWindow
  icons!: {
    normal: BMap.Icon
    warn: BMap.Icon
    danger: BMap.Icon
    outdated: BMap.Icon
    dead: BMap.Icon
  }
  groundOverlay!: BMap.GroundOverlay

  client?: WebSocket

  initOverlays() {
    const { BMap, map } = this.props
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
      danger: new BMap.Icon(spritesheet, new BMap.Size(20, 29), {
        imageOffset: new BMap.Size(-80, 0),
        anchor: new BMap.Size(10, 26),
        infoWindowAnchor: new BMap.Size(10, 0),
      }),
      outdated: new BMap.Icon(spritesheet, new BMap.Size(20, 29), {
        imageOffset: new BMap.Size(-40, 0),
        anchor: new BMap.Size(10, 26),
        infoWindowAnchor: new BMap.Size(10, 0),
      }),
      dead: new BMap.Icon(spritesheet, new BMap.Size(20, 29), {
        imageOffset: new BMap.Size(-60, 0),
        anchor: new BMap.Size(10, 26),
        infoWindowAnchor: new BMap.Size(10, 0),
      }),
    }
    this.infoWindow = new BMap.InfoWindow('')
    map.addControl(new BMap.NavigationControl())
    let restrictArea = new BMap.Polygon([
      { lng: 120.2781947, lat: 49.18461658 },
      { lng: 120.0943625, lat: 49.14332039 },
      { lng: 120.1884636, lat: 49.10852722 },
      { lng: 120.2938367, lat: 49.14605369 },
    ])
    restrictArea.setFillOpacity(0.4)
    map.addOverlay(restrictArea)

    this.groundOverlay = new BMap.GroundOverlay(
      new BMap.Bounds({ lng: 120.1744636, lat: 49.10052722 }, { lng: 120.2850001, lat: 49.17000658 }),
      {
        imageURL: groundOverlayUrl,
        opacity: 0.3,
      }
    )
    map.addOverlay(this.groundOverlay)
  }

  initMap() {
    let { map } = this.props
    map.enableScrollWheelZoom()
    map.enableKeyboard()

    this.initMapCenter()
  }

  initMapCenter() {
    let { map } = this.props
    map.centerAndZoom(new BMap.Point(120.227, 49.15078494), 14)
  }

  initWS() {
    if (this.client) {
      return
    }
    let client = new WebSocket(wsUrl)!
    client.onmessage = this.onMessage
    client.onerror = this.onError
    client.onclose = this.onClose
    client.onopen = this.onOpen
    this.client = client
  }

  closeWS() {
    this.client && this.client.close()
    this.client = undefined
  }

  onMessage = ({ data }) => {
    let mark = attempt(() => JSON.parse(data))
    if (!mark) return
    console.debug('[WS]Incomming', data)
    mark.receiveAt = Date.now()
    if (mark) {
      this.addMarkers(mark)
    }
    let { onReceive } = this.props
    onReceive && onReceive(data, this.markers, calculateRate())
  }

  onOpen = () => {
    console.debug('[WS]Opened')
    let { onOpen } = this.props
    onOpen && onOpen()
  }

  onError = () => {
    console.debug('[WS]Error')
    this.initWS()
  }

  onClose = () => {
    console.debug('[WS]Closed')
    let { onClose } = this.props
    onClose && onClose()
  }

  toggleGroundOverlay() {
    let opacity = this.groundOverlay.getOpacity()
    if (opacity > 0) {
      opacity = 0
    } else {
      opacity = 0.3
    }
    this.groundOverlay.setOpacity(opacity)
  }

  addMarkers(data: GPSMessage) {
    const { BMap } = this.props
    let { lng, lat } = data
    let cached = this.markers[data.imei]
    if (cached) {
      if (data.t < cached.data.t) {
        return // neglect outdated data from terminal
      }
      cached.data = data
      cached.receivedAt = Date.now()
    } else {
      let marker = new BMap.Marker({ lng, lat })
      marker.addEventListener('mouseover', () => {
        marker.setPosition({ lng, lat })
        this.showInfoWindow(cached.data, marker)
      })
      marker.addEventListener('mouseout', () => this.closeInfoWindow(marker))
      cached = this.markers[data.imei] = {
        marker,
        type: MarkerType.Personale,
        data,
        receivedAt: Date.now(),
      }
    }
    let marker = cached.marker
    marker['type'] = 'marker'
    if ('not outside') {
      marker.setIcon(this.icons.normal)
    } else {
      marker.setIcon(this.icons.danger)
    }
  }

  removeMarker(imei: string) {
    const { map } = this.props
    let cached = this.markers[imei]
    if (!cached) return
    map.removeOverlay(cached.marker)
    delete this.markers[imei]
  }

  paintMarkers() {
    const { map } = this.props
    let now = Date.now()

    Object.entries(this.markers).forEach(([imei, cache]) => {
      let { data, marker } = cache
      let { lng, lat, t } = data
      let age = now - t
      if (age > 20 * 60000) {
        // remove stale marker after 20min
        this.removeMarker(imei)
        return
      }
      if (age < 5 * 60000) {
        // 5min
        marker.setIcon(this.icons.normal)
        // 30min
      } else if (age < 30 * 60000) {
        marker.setIcon(this.icons.outdated)
      } else {
        marker.setIcon(this.icons.dead)
      }
      map.addOverlay(marker)
      marker.setPosition(new BMap.Point(lng, lat))
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
    this.infoWindow.setContent(infoWindowTemplate(mark))
    PersonaleStore.getPersonaleByImei(mark.imei).then((personale) =>
      this.infoWindow.setContent(infoWindowTemplate(mark, personale))
    )
    marker.openInfoWindow(this.infoWindow)
  }

  closeInfoWindow = (marker: BMap.Marker) => {
    marker.closeInfoWindow()
  }

  startPaint() {
    this.paintMarkers()
    this.initWS()
    this.timeoutId = setTimeout(() => {
      this.startPaint()
    }, Math.max(MapControll.paintInterval * 1000, 3000))
  }

  stopPaint() {
    clearTimeout(this.timeoutId)
    this.closeWS()
  }

  componentDidMount() {
    this.initOverlays()
    this.initMap()
    let { mapRef } = this.props
    mapRef && mapRef(this)
    setTimeout(() => {
      // FIXME: auto located to current position
      this.initMapCenter()
    }, 1000)
  }

  componentWillUnmount() {
    this.stopPaint()
  }

  render() {
    return null
  }
}

export const CustomMap: any = withMap(MapControll as any)
