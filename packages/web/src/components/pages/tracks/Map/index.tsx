import React from 'react'
import { withMap } from '@uiw/react-baidu-map'
import { WithMapProps } from '@uiw/react-baidu-map/lib/cjs/withMap'
import { Markers, infoWindowTemplate, TrackPoint } from './helpers'
import groundOverlayUrl from '#/assets/img/ground_overlay.png'
import { RestrictArea, Center, applyOffset2 } from '../../LiveLocation/Map/helpers'

interface Props {
  onOpen?: () => void
  onReceive?: (data: any, marks: any, rate?: number) => void
  onClose?: () => void
  mapRef?: (ref: MapControl) => void
  trackData: TrackPoint[]
}

interface State {
  dataCollection: TrackPoint[]
}

export class MapControl extends React.Component<Required<WithMapProps> & Props, State> {
  static getDerivedStateFromProps({ trackData }) {
    return {
      dataCollection: trackData.map((d) => d.data),
    }
  }
  state: State = {
    dataCollection: [],
  }
  markers: Markers = {}
  infoWindow!: BMap.InfoWindow
  groundOverlay!: BMap.GroundOverlay

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

  clear() {
    let { map } = this.props
    map.clearOverlays()
    this.initOverlays()
  }

  paint() {
    let { map, BMap } = this.props
    let { dataCollection } = this.state
    let options = {
      size: BMAP_POINT_SIZE_NORMAL,
      shape: BMAP_POINT_SHAPE_STAR,
      color: '#d340c3',
    }
    let points: BMap.Point[] = []
    for (let i = 0; i < dataCollection.length; i++) {
      let data = dataCollection[i]
      let [lng, lat] = applyOffset2(data.Longitude, data.Latitude)
      let point = new BMap.Point(lng, lat)
      point['$data'] = data
      points.push(point)
    }
    let pointCollection = new BMap.PointCollection(points, options)
    pointCollection.addEventListener('mouseover', (e) => {
      this.showInfoWindow(e.point)
    })
    map.addOverlay(pointCollection)
  }

  showInfoWindow(point: BMap.Point) {
    this.infoWindow.setContent(infoWindowTemplate(point['$data']))
    this.props.map.openInfoWindow(this.infoWindow, point)
  }

  closeInfoWindow = (marker: BMap.Marker) => {
    marker.closeInfoWindow()
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

  render() {
    return null
  }
}

export const CustomMap: any = withMap(MapControl as any)
