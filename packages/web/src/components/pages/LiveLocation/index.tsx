import React, { useCallback } from 'react'
import { APILoader } from '@uiw/react-baidu-map'
import { Wrapper, ActionWrapper, MapWrapper, ExtraWrapper } from './styles'
import { CustomMap, MapControll } from './Map'
import { useObserver, useLocalStore } from 'mobx-react'
import { PageHeader, Button, Descriptions, Select, Switch } from 'antd'
import { SyncOutlined, AimOutlined } from '@ant-design/icons'
import { dateStr } from '#/utils'
import { throttle } from 'lodash'

const Option = Select.Option

export function LiveLocation() {
  let local = useLocalStore(() => {
    return {
      lastUpdate: ' - ',
      start: false,
      total: 0,
      mapRef: null as any,
      get startTime() {
        return this.start ? dateStr() : ' - '
      },
    }
  })

  let onReceive = useCallback(
    throttle((current, all) => {
      local.lastUpdate = dateStr(current.t)
      local.total = Object.keys(all).length
    }, 3000),
    []
  )

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
            <ExtraWrapper key="0">
              <span style={{ paddingRight: 6 }}>测区图</span>
              <Switch
                key="4"
                checkedChildren="显示"
                unCheckedChildren="隐藏"
                defaultChecked
                onClick={() => local.mapRef.toggleGroundOverlay()}
              />
            </ExtraWrapper>,
            <Select
              key="0"
              defaultValue={MapControll.paintInterval}
              style={{ width: 100 }}
              onChange={(val) => (MapControll.paintInterval = val)}
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
              onClick={() => {
                local.start = !local.start
                if (local.start) {
                  local.mapRef.startPaint()
                } else {
                  local.mapRef.stopPaint()
                }
              }}
              icon={<SyncOutlined spin={local.start} />}
            >
              {local.start ? '暂停接收' : '接收数据'}
            </Button>,
            <Button
              key="2"
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
            onReceive={onReceive}
            mapRef={(ref) => (local.mapRef = ref)}
          />
        </APILoader>
      </MapWrapper>
    </Wrapper>
  ))
}
