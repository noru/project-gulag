
export interface GPSMessage {
  imei: string
  lat: number
  lng: number
  alt: number
  s: number,
  d: number,
  t: number,
  v: number,
}

export interface Fence {
  id: string
  name: string
  outer: FenceVertex[]
  inner: FenceVertex[][]
}

export interface FenceVertex {
  id: string
  index: number
  lng: number
  lat: number
  alt: number
}