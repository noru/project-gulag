import React, { useCallback } from 'react'
import { APILoader } from '@uiw/react-baidu-map'
import { Wrapper, ActionWrapper, MapWrapper } from './styles'
import { CustomMap } from './Map'
import { useObserver, useLocalStore } from 'mobx-react'
import { PageHeader, Button, Descriptions, Select } from 'antd'
import { SyncOutlined, AimOutlined } from '@ant-design/icons'
import { dateStr } from '#/utils'
// import { AuthStore } from '#/stores/auth'

const Option = Select.Option

export function LiveLocation() {
  // let store = useObserver(() => AuthStore)
  let local = useLocalStore(() => {
    return {
      start: false,
      refreshRate: CustomMap.paintInterval,
      lastUpdate: ' - ',
      total: 0,
      mapRef: null as any,
      get startTime() {
        return this.start ? dateStr() : ' - '
      },
    }
  })

  let onReceive = useCallback((current, all) => {
    local.lastUpdate = dateStr(current.t)
    local.total = Object.keys(all).length
  }, [])

  let onRecenter = useCallback(() => {
    local.mapRef && local.mapRef!.initMapCenter()
  }, [])

  return useObserver(() => (
    <Wrapper>
      <ActionWrapper>
        <PageHeader
          ghost={false}
          title={<span>扎尼河露天矿</span>}
          subTitle="人员位置实时数据"
          extra={[
            <Select
              key="0"
              defaultValue={3}
              style={{ width: 100 }}
              onChange={(val) => (local.refreshRate = val)}
            >
              <Option value={3}>3秒/次</Option>
              <Option value={5}>5秒/次</Option>
              <Option value={10}>10秒/次</Option>
              <Option value={30}>30秒/次</Option>
              <Option value={60}>1分钟/次</Option>
            </Select>,
            <Button
              key="1"
              type="primary"
              danger={local.start}
              onClick={() => (local.start = !local.start)}
              icon={<SyncOutlined spin={local.start} />}
            >
              {local.start ? '暂停接收' : '接收数据'}
            </Button>,
            <Button
              key="-1"
              type="primary"
              ghost
              icon={<AimOutlined />}
              onClick={onRecenter}
            >
              重置中心
            </Button>,
          ]}
        >
          <Descriptions size="small" column={3}>
            <Descriptions.Item label="在线数量">
              <a>{local.total}</a>
            </Descriptions.Item>
            <Descriptions.Item label="开始时间">
              {local.startTime}
            </Descriptions.Item>
            <Descriptions.Item label="上次更新">
              {local.lastUpdate}
            </Descriptions.Item>
          </Descriptions>
        </PageHeader>
      </ActionWrapper>
      <MapWrapper>
        <APILoader akay="qZpPLwPWLRaSrICDaXAzDYUml0YOx9st">
          <CustomMap
            start={local.start}
            rate={local.refreshRate}
            onReceive={onReceive}
            mapRef={(ref) => (local.mapRef = ref)}
          />
        </APILoader>
      </MapWrapper>
    </Wrapper>
  ))
}
