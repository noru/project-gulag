import React from 'react'
import { withMap } from '@uiw/react-baidu-map'
import { WithMapProps } from '@uiw/react-baidu-map/lib/cjs/withMap'
import { Markers } from './helpers'
import groundOverlayUrl from '#/assets/img/ground_overlay.png'
import { RestrictArea, Center } from '../../LiveLocation/Map/helpers'

interface Props {
  onOpen?: () => void
  onReceive?: (data: any, marks: any, rate?: number) => void
  onClose?: () => void
  mapRef?: (ref: MapControl) => void
}

export class MapControl extends React.Component<Required<WithMapProps> & Props> {
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
    this.infoWindow = new BMap.InfoWindow('')
    map.addControl(new BMap.NavigationControl())
    let restrictArea = new BMap.Polygon(RestrictArea)
    restrictArea.setStrokeWeight(1)
    restrictArea.setStrokeStyle('dashed')
    restrictArea.setFillOpacity(0.05)
    restrictArea.setFillColor('limegreen')
    map.addOverlay(restrictArea)

    this.groundOverlay = new BMap.GroundOverlay(
      new BMap.Bounds(
        { lng: 120.1744636, lat: 49.10052722 },
        { lng: 120.2850001, lat: 49.17000658 }
      ),
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
    map.centerAndZoom(new BMap.Point(Center.lng, Center.lat), 14)
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

  paintMarkers() {
    // todo
  }

  paintTrack() {
    // todo
  }

  clear() {
    // todo
  }

  // showInfoWindow(mark: GPSMessage, marker: BMap.Marker) {
  //   this.infoWindow.setContent(infoWindowTemplate(mark))
  //   PersonaleStore.getPersonaleByImei(mark.imei).then((personale) =>
  //     this.infoWindow.setContent(infoWindowTemplate(mark, personale))
  //   )
  //   marker.openInfoWindow(this.infoWindow)
  // }

  // closeInfoWindow = (marker: BMap.Marker) => {
  //   marker.closeInfoWindow()
  // }

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

  render() {
    return null
  }
}

export const CustomMap: any = withMap(MapControl as any)
