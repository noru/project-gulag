import React, { useCallback } from 'react'
import { APILoader } from '@uiw/react-baidu-map'
import { Wrapper, ActionWrapper, MapWrapper } from './styles'
import { CustomMap } from './Map'
import { useObserver, useLocalStore } from 'mobx-react'
import { PageHeader, Button, Descriptions, DatePicker } from 'antd'
import { AimOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { IPersonale } from '@/clients/mongo/models/personale'
import { useRouteMatch, useHistory } from 'react-router-dom'
import { useEffectOnce } from 'react-use'
import { PersonaleStore } from '#/stores'
import { adminService } from '#/services'
import moment from 'moment'

const { RangePicker } = DatePicker

interface LocalState {
  mapRef: any
  personale: IPersonale | null
  trackData: any[]
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
      get personale() {
        return PersonaleStore.personalesByImei[imei]
      },
      trackData: [],
    } as LocalState
  })
  let onRecenter = useCallback(() => {
    local.mapRef && local.mapRef!.initMapCenter()
  }, [])
  let onOk = useCallback(([from, to]) => {
    if (from && to) {
      adminService.getTrack(imei, from.valueOf(), to.valueOf()).then(({ detail }) => {
        local.trackData = detail
        console.log(local.trackData)
      })
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
              defaultValue={[moment().subtract(1, 'h'), moment()]}
              onOk={onOk}
            />,
            <Button key="recenter" type="primary" ghost icon={<AimOutlined />} onClick={onRecenter}>
              重置中心
            </Button>,
            <Button
              key="clear"
              type="primary"
              ghost
              icon={<InfoCircleOutlined />}
              onClick={onRecenter}
            >
              清除轨迹
            </Button>,
          ]}
        >
          <Descriptions size="small" column={4}>
            <Descriptions.Item label="姓名">{local.personale?.name}</Descriptions.Item>
            <Descriptions.Item label="人员卡编码">{local.personale?.id}</Descriptions.Item>
            <Descriptions.Item label="IMEI">{local.personale?.imei}</Descriptions.Item>
            <Descriptions.Item label="工种">{local.personale?.jobTitle}</Descriptions.Item>
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
