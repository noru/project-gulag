import React from 'react'
import { withMap } from '@uiw/react-baidu-map'
import { WithMapProps } from '@uiw/react-baidu-map/lib/cjs/withMap'
import { infoWindowTemplate, TrackPoint } from './helpers'
import {
  RestrictArea,
  Center,
  applyOffset2,
  groundOverlayUrl,
  groundOverlayBound,
} from '../../LiveLocation/Map/helpers'
import spritesheet from '#/assets/img/marker.png'

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

    this.groundOverlay = new BMap.GroundOverlay(new BMap.Bounds(...groundOverlayBound), {
      imageURL: groundOverlayUrl,
      opacity: 0.3,
    })
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

  paintStartEnd(points) {
    let { map, BMap } = this.props
    let end = points[0]
    let start = points[points.length - 1]
    ;[start, end].forEach((p, i) => {
      let icon =
        i === 0
          ? new BMap.Icon(spritesheet, new BMap.Size(20, 29), {
              imageOffset: new BMap.Size(-20, 0),
              anchor: new BMap.Size(10, 26),
              infoWindowAnchor: new BMap.Size(10, 0),
            })
          : new BMap.Icon(spritesheet, new BMap.Size(20, 29), {
              imageOffset: new BMap.Size(-80, 0),
              anchor: new BMap.Size(10, 26),
              infoWindowAnchor: new BMap.Size(10, 0),
            })

      let marker = new BMap.Marker(p, { icon })
      map.addOverlay(marker)
      marker.addEventListener('mouseover', () => {
        this.showInfoWindow(p)
      })
      marker.addEventListener('mouseout', () => this.closeInfoWindow(marker))
    })
  }

  paint() {
    let { map, BMap } = this.props
    let { dataCollection } = this.state
    let options = {
      size: BMAP_POINT_SIZE_SMALL,
      shape: BMAP_POINT_SHAPE_CIRCLE,
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
    let polyline = new BMap.Polyline(points, {
      strokeColor: 'gray',
      strokeWeight: 1,
      strokeOpacity: 0.8,
    })
    map.addOverlay(polyline)
    map.addOverlay(pointCollection)
    this.paintStartEnd(points)
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
      this.initMapCenter()
    }, 1000)
  }

  render() {
    return null
  }
}

export const CustomMap: any = withMap(MapControl as any)
