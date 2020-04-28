import React, { useCallback } from 'react'
import { APILoader } from '@uiw/react-baidu-map'
import { Wrapper, ActionWrapper, MapWrapper, ExtraWrapper } from './styles'
import { CustomMap, MapControl } from './Map'
import { useObserver, useLocalStore } from 'mobx-react'
import { PageHeader, Button, Descriptions, Select, Switch, message, Drawer, Table } from 'antd'
import { SyncOutlined, AimOutlined, BugOutlined } from '@ant-design/icons'
import { dateStr } from '#/utils'
import { throttle } from 'lodash'
import { DebugTableColumns } from './helper'

const Option = Select.Option
const PLACEHOLDER = ' - '
export function LiveLocation() {
  let local = useLocalStore(() => {
    return {
      debug: window.location.search.indexOf('debug=true') > -1,
      openDebugInfo: false,
      lastUpdate: PLACEHOLDER,
      start: false,
      rate: 0,
      mapRef: null as any,
      markers: {},
      get total() {
        return Object.keys(this.markers).length
      },
      get startTime() {
        return this.start ? dateStr() : PLACEHOLDER
      },
      reset() {
        local.lastUpdate = PLACEHOLDER
        local.start = false
        local.rate = 0
        local.markers = {}
      },
    }
  })

  let onOpen = useCallback(() => {
    message.success('数据链接成功接通')
  }, [])

  let onClose = useCallback(() => {
    local.start = false
    message.info('数据链接关闭，如需显示数据请重新连接')
  }, [])

  let onReceive = useCallback(
    throttle((current, all, rate) => {
      local.lastUpdate = dateStr(current.t)
      local.rate = rate
      local.markers = all
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
            <ExtraWrapper key="groud-overlay">
              {local.debug && (
                <Button
                  type="primary"
                  icon={<BugOutlined />}
                  shape="circle"
                  danger
                  onClick={() => (local.openDebugInfo = true)}
                  style={{ marginRight: 12, paddingTop: 2 }}
                ></Button>
              )}
              <span style={{ paddingRight: 6 }}>测区图</span>
              <Switch
                checkedChildren="显示"
                unCheckedChildren="隐藏"
                defaultChecked
                onClick={() => local.mapRef.toggleGroundOverlay()}
              />
            </ExtraWrapper>,
            <Select
              key="refresh-rate"
              defaultValue={MapControl.paintInterval}
              style={{ width: 100 }}
              onChange={(val) => (MapControl.paintInterval = val)}
            >
              <Option value={3}>3秒/次</Option>
              <Option value={5}>5秒/次</Option>
              <Option value={10}>10秒/次</Option>
            </Select>,
            <Button
              key="receive"
              type="primary"
              danger={local.start}
              onClick={() => {
                local.start = !local.start
                if (local.start) {
                  local.mapRef.startPaint()
                } else {
                  local.mapRef.stopPaint()
                  local.reset()
                }
              }}
              icon={<SyncOutlined spin={local.start} />}
            >
              {local.start ? '暂停接收' : '接收数据'}
            </Button>,
            <Button key="recenter" type="primary" ghost icon={<AimOutlined />} onClick={onRecenter}>
              重置中心
            </Button>,
          ]}
        >
          <Descriptions size="small" column={4}>
            <Descriptions.Item label="在线数量">
              <a>{local.total}</a>
            </Descriptions.Item>
            <Descriptions.Item label="开始时间">{local.startTime}</Descriptions.Item>
            <Descriptions.Item label="上次更新">{local.lastUpdate}</Descriptions.Item>
            <Descriptions.Item label="数据频率">{local.rate.toFixed(2)}/s</Descriptions.Item>
          </Descriptions>
        </PageHeader>
      </ActionWrapper>
      <MapWrapper>
        <APILoader akay="qZpPLwPWLRaSrICDaXAzDYUml0YOx9st">
          <CustomMap onOpen={onOpen} onClose={onClose} onReceive={onReceive} mapRef={(ref) => (local.mapRef = ref)} />
        </APILoader>
      </MapWrapper>
      {local.debug && (
        <Drawer
          title="Marks"
          placement="right"
          width="900"
          onClose={() => (local.openDebugInfo = false)}
          visible={local.openDebugInfo}
        >
          <Table
            dataSource={Object.values(local.markers).map((m: any) => ({ ...m.data, receiveAt: m.receiveAt }))}
            columns={DebugTableColumns}
            rowKey="imei"
          />
        </Drawer>
      )}
    </Wrapper>
  ))
}
