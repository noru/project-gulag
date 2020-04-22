import React, { useState, useEffect } from 'react'
import { Map, Marker, InfoWindow, Polygon } from '@uiw/react-baidu-map'
import useWebSocket from 'react-use-websocket'

const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
const WSURL = protocol + '//' + window.location.host + '/ws/gps'

export function CustomMap() {
  let [cord, setCord] = useState<BMap.Point | null>(null)
  //@ts-ignore
  const [send, lastMessage, state, getSocket] = useWebSocket(WSURL)

  useEffect(() => {
    if (lastMessage !== null) {
      console.log(lastMessage.data)
      // let cord = attempt(() => JSON.parse(lastMessage.data), {})
      let cord = { lng: 120.2027911, lat: 49.14078494 }
      cord.lat += Math.random() * 0.05
      cord.lng += Math.random() * 0.05
      setCord(cord)
    }
    return getSocket().close
  }, [lastMessage])
  return (
    <>
      <Map
        center={{ lng: 120.2027911, lat: 49.14078494 }}
        widget={['NavigationControl']}
        zoom={14}
      >
        {cord && (
          <Marker
            position={cord}
            enableClicking
            // @ts-ignore
            onMouseOver={() => {
              setCord({ lng: 120.2027911, lat: 49.14078494 })
            }}
            onMouseOut={() => setCord(null)}
          />
        )}
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
          content={`<div style="font-size:16px;">${JSON.stringify(cord)}</div>`}
          height={200}
          title="<div style='font-size:18px;'>title</div>"
          offset={new BMap.Size(0, -40)}
        />
      </Map>
    </>
  )
}
