import { identity } from '@drewxiu/utils/cjs'

export interface LocationMessage {
  IMSI: string
  UTC: number
  Latitude: number
  Longitude: number
  Altitude: number
  Speed: number
  Direction: number
  Volts: number
}

export interface LocationMeta extends LocationMessage {
  TransitCode: string
  FuncCode: string
  DataLength: number
  PDOP: number
  HDOP: number
  HACC: number
  Steps: number
  CRC: string
}

const Hex2Int = (hex: string) => Number.parseInt(hex, 16)

const StringDeserializer = (hex: string) => {
  let hexSegments = hex.match(/.{2}/g)!.map(Hex2Int)
  return String.fromCharCode(...hexSegments)
}

const HexDeserializer = Hex2Int

const DateDeserializer = (hex: string) => {
  return Hex2Int(hex) * 1000
}

const DegreeDeserializer = (hex: string) => {
  return Hex2Int(hex) / 1000000
}

export class Location implements LocationMeta {
  static readonly FRAME_FORMAT = [
    { name: 'TransitCode', deserializer: identity, from: 0, length: 4 },
    { name: 'FuncCode', deserializer: identity, from: 4, length: 2 },
    { name: 'IMSI', deserializer: StringDeserializer, from: 6, length: 30 },
    { name: 'DataLength', deserializer: HexDeserializer, from: 36, length: 2 },
    { name: 'UTC', deserializer: DateDeserializer, from: 38, length: 8 },
    { name: 'Latitude', deserializer: DegreeDeserializer, from: 46, length: 8 },
    {
      name: 'Longitude',
      deserializer: DegreeDeserializer,
      from: 54,
      length: 8,
    },
    { name: 'Speed', deserializer: HexDeserializer, from: 62, length: 2 },
    { name: 'Direction', deserializer: HexDeserializer, from: 64, length: 4 },
    { name: 'Altitude', deserializer: HexDeserializer, from: 68, length: 4 },
    { name: 'PDOP', deserializer: HexDeserializer, from: 72, length: 4 },
    { name: 'HDOP', deserializer: HexDeserializer, from: 76, length: 4 },
    { name: 'HACC', deserializer: HexDeserializer, from: 80, length: 4 },
    { name: 'Steps', deserializer: HexDeserializer, from: 84, length: 4 },
    { name: 'Volts', deserializer: HexDeserializer, from: 88, length: 2 },
    { name: 'CRC', deserializer: identity, from: 90, length: 2 },
  ]

  rawData: string = ''

  TransitCode!: string
  FuncCode!: string
  IMSI!: string
  DataLength!: number
  UTC!: number
  Latitude!: number
  Longitude!: number
  Speed!: number
  Direction!: number
  Altitude!: number
  PDOP!: number
  HDOP!: number
  HACC!: number
  Steps!: number
  Volts!: number
  CRC!: string

  constructor(raw: string) {
    // raw string example: 0114013436303131333031333936303533371A5E8EBB7501589FAE06CA2D460000000020000C00070007000053C2
    // prettier: 0114 01 343630313133303133393630353337 1A 5E8EBB75 01589FAE 06CA2D46 00 0000 0020 000C 0007 0007 0000 53 C2
    this.rawData = raw
    try {
      Location.FRAME_FORMAT.reduce((obj, nextField) => {
        let { name, deserializer, from, length } = nextField
        obj[name] = deserializer(this.rawData.substr(from, length))
        return obj
      }, this)
    } catch (e) {
      // error(e)
    }
  }

  get isValid() {
    try {
      let { rawData, DataLength, CRC /* CRC */ } = this
      let allBytes = rawData.match(/.{2}/g)!.slice(0, -1).slice(1) // remove the first byte (seems a bug), and last byte (CRC)
      let sum = allBytes.map(Hex2Int).reduce((sum, next) => sum + next, 0)
      let sum16 = sum.toString(16)
      return DataLength === 26 && sum16.endsWith(CRC.toLowerCase())
    } catch {
      return false
    }
  }

  toJson(): LocationMessage {
    return {
      IMSI: this.IMSI,
      Longitude: this.Longitude,
      Latitude: this.Latitude,
      Altitude: this.Altitude,
      Speed: this.Speed,
      Direction: this.Direction,
      UTC: this.UTC,
      Volts: this.Volts,
    }
  }
}
