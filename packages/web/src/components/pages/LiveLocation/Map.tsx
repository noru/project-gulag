import React, { useState } from 'react'
import { Map, Marker, InfoWindow, Polygon } from '@uiw/react-baidu-map'

export function CustomMap() {
  let [cord, setCord] = useState<BMap.Point | null>(null)

  return (
    <>
      <Map
        center={{ lng: 120.2027911, lat: 49.14078494 }}
        widget={['NavigationControl']}
        zoom={14}
      >
        <Marker
          position={{ lng: 120.2027911, lat: 49.14078494 }}
          enableClicking
          // @ts-ignore
          onMouseOver={() => {
            setCord({ lng: 120.2027911, lat: 49.14078494 })
          }}
          onMouseOut={() => {
            setCord(null)
          }}
        />
        <Polygon
          enableEditing={true}
          strokeOpacity={0.8}
          path={[
            { lng: 120.2781947, lat: 49.18461658 },
            { lng: 120.0943625, lat: 49.14332039 },
            { lng: 120.1884636, lat: 49.10852722 },
            { lng: 120.2938367, lat: 49.14605369 },
          ]}
        />
        <InfoWindow
          isOpen={!!cord}
          onClose={() => {
            setCord(null)
          }}
          position={cord!}
          content={
            '<div style="font-size:16px;">test123地址信息一地址信息一地址信息一地址信息一test123地址信息一地址信息一地址信息一地址信息一test123地址信息一地址信息一地址信息一地址信息一test123地址信息一地址信息一地址信息一地址信息一test123地址信息一地址信息一地址信息一地址信息一</div>'
          }
          height={200}
          title="<div style='font-size:18px;'>title</div>"
          offset={new BMap.Size(0, -40)}
        />
      </Map>
    </>
  )
}
