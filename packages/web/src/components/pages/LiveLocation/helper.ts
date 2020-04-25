import { dateStr } from '#/utils'

export const DebugTableColumns = [
  {
    title: 'IMEI',
    dataIndex: 'imei',
  },
  {
    title: 'Lat',
    dataIndex: 'lat',
  },
  {
    title: 'Lng',
    dataIndex: 'lng',
  },
  {
    title: 'Alt',
    dataIndex: 'alt',
  },
  {
    title: 'Speed',
    dataIndex: 's',
  },
  {
    title: 'Direction',
    dataIndex: 'd',
  },
  {
    title: 'Timestamp',
    dataIndex: 't',
    render(v) {
      return dateStr(v)
    },
  },
  {
    title: 'Volt',
    dataIndex: 'v',
  },
  {
    title: 'Received At',
    dataIndex: 'receivedAt',
    render(v) {
      return dateStr(v)
    },
  },
]
