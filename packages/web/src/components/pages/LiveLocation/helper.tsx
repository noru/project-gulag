import React from 'react'
import { dateStr } from '#/utils'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Personale } from './Personale'

export const InfoTableColumns = [
  {
    title: 'IMEI',
    dataIndex: 'imei',
    render(v) {
      return (
        <a href={`/tracks/${v}`} target="__blank">
          {v}
        </a>
      )
    },
  },
  {
    title: '人员',
    dataIndex: 'imei',
    render(v) {
      return <Personale imei={v} />
    },
  },
  {
    title: '经度',
    dataIndex: 'lng',
  },
  {
    title: '纬度',
    dataIndex: 'lat',
  },
  // {
  //   title: 'Alt',
  //   dataIndex: 'alt',
  // },
  // {
  //   title: 'Speed',
  //   dataIndex: 's',
  // },
  // {
  //   title: 'Direction',
  //   dataIndex: 'd',
  // },
  {
    title: '信号时间',
    dataIndex: 't',
    sorter: (a, b) => a.t - b.t,
    render(v) {
      return dateStr(v)
    },
  },
  {
    title: '电量',
    dataIndex: 'v',
  },
  {
    title: '接收时间',
    dataIndex: 'receivedAt',
    sorter: (a, b) => a.t - b.t,
    render(v) {
      return dateStr(v)
    },
  },
  {
    title: '越界',
    dataIndex: 'alert',
    width: 100,
    filters: [
      { text: '是', value: true },
      { text: '否', value: false },
    ],
    onFilter: (value, record) => record.alert === value,
    render(v) {
      return v ? <ExclamationCircleOutlined style={{ color: 'red' }} /> : ''
    },
  },
]
