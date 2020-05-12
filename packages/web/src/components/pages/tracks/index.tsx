import React, { useCallback } from 'react'
import { APILoader } from '@uiw/react-baidu-map'
import { Wrapper, ActionWrapper, MapWrapper } from './styles'
import { CustomMap } from './Map'
import { useObserver, useLocalStore } from 'mobx-react'
import { PageHeader, Button, Descriptions, DatePicker } from 'antd'
import { AimOutlined, InfoCircleOutlined, FundOutlined } from '@ant-design/icons'
import { IPersonale } from '@/clients/mongo/models/personale'
import { useRouteMatch, useHistory } from 'react-router-dom'
import { useEffectOnce } from 'react-use'
import { PersonaleStore } from '#/stores'
import { adminService } from '#/services'
import moment from 'moment'

const { RangePicker } = DatePicker

interface LocalState {
  mapRef: any
  loading: boolean
  personale: IPersonale | null
  trackData: any[]
  range: [any, any]
}

export function Tracks() {
  let history = useHistory()
  let {
    params: { imei },
  } = useRouteMatch()
  useEffectOnce(() => {
    if (!imei) {
      history.push('/')
      return
    }
    PersonaleStore.getPersonaleByImei(imei)
  })

  let local = useLocalStore(() => {
    return {
      mapRef: null,
      loading: false,
      get personale() {
        return PersonaleStore.personalesByImei[imei]
      },
      trackData: [],
      range: [moment().subtract(1, 'h'), moment()],
    } as LocalState
  })
  let onRecenter = useCallback(() => {
    local.mapRef && local.mapRef!.initMapCenter()
  }, [])
  let onRangeChange = useCallback((range) => {
    local.range = range
  }, [])
  let onPaint = useCallback(() => {
    let [from, to] = local.range
    local.loading = true
    if (from && to) {
      adminService
        .getTrack(imei, from.valueOf(), to.valueOf())
        .then(({ detail }) => {
          local.trackData = detail
          local.mapRef.paint()
        })
        .finally(() => (local.loading = false))
    }
  }, [])
  return useObserver(() => (
    <Wrapper>
      <ActionWrapper>
        <PageHeader
          ghost={false}
          title={<span>扎尼河露天矿</span>}
          subTitle="人员位置轨迹"
          extra={[
            <RangePicker
              key="date-range"
              showTime={{ format: 'HH:mm' }}
              format="YYYY-MM-DD HH:mm"
              defaultValue={local.range}
              onChange={onRangeChange}
            />,
            <Button
              key="paint"
              type="primary"
              icon={<FundOutlined />}
              onClick={onPaint}
              loading={local.loading}
            >
              查看轨迹
            </Button>,
            <Button key="recenter" type="primary" ghost icon={<AimOutlined />} onClick={onRecenter}>
              重置中心
            </Button>,
            <Button
              key="clear"
              type="primary"
              ghost
              icon={<InfoCircleOutlined />}
              onClick={() => local.mapRef.claer()}
            >
              清除轨迹
            </Button>,
          ]}
        >
          <Descriptions size="small" column={3}>
            <Descriptions.Item label="姓名">{local.personale?.name}</Descriptions.Item>
            <Descriptions.Item label="人员卡编码">{local.personale?.id}</Descriptions.Item>
            <Descriptions.Item label="IMEI">{local.personale?.imei}</Descriptions.Item>
            <Descriptions.Item label="部门">{local.personale?.department}</Descriptions.Item>
            <Descriptions.Item label="工种">{local.personale?.jobTitle}</Descriptions.Item>
            <Descriptions.Item label="位置点">{local.trackData.length}</Descriptions.Item>
          </Descriptions>
        </PageHeader>
      </ActionWrapper>
      <MapWrapper>
        <APILoader akay="qZpPLwPWLRaSrICDaXAzDYUml0YOx9st">
          <CustomMap mapRef={(ref) => (local.mapRef = ref)} trackData={local.trackData} />
        </APILoader>
      </MapWrapper>
    </Wrapper>
  ))
}
