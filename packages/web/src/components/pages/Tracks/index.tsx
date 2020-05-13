import React, { useEffect } from 'react'
import { APILoader } from '@uiw/react-baidu-map'
import { Wrapper, ActionWrapper, MapWrapper } from './styles'
import { CustomMap } from './Map'
import { useObserver, useLocalStore } from 'mobx-react'
import { PageHeader, Button, Descriptions, DatePicker, Select } from 'antd'
import { AimOutlined, InfoCircleOutlined, FundOutlined } from '@ant-design/icons'
import { IPersonale } from '@/clients/mongo/models/personale'
import { useRouteMatch } from 'react-router-dom'
import { PersonaleStore } from '#/stores'
import moment from 'moment'
import { useCallbacks } from './hooks'

const { Option } = Select
const { RangePicker } = DatePicker

interface LocalState {
  imei: string
  mapRef: any
  loading: boolean
  query: string
  personale: IPersonale | null
  personaleOptions: IPersonale[]
  trackData: any[]
  range: [any, any]
}

export function Tracks() {
  let {
    params: { imei },
  } = useRouteMatch()
  let local = useLocalStore(() => {
    return {
      imei: imei || null,
      mapRef: null,
      loading: false,
      query: '',
      personale: null,
      get personaleOptions() {
        if (!this.query) {
          return []
        }
        return PersonaleStore.personales.filter((p) => {
          return [p.id, p.name, p.imei].some((str) => str.includes(this.query))
        })
      },
      trackData: [],
      range: [moment().subtract(1, 'h'), moment()],
    } as LocalState
  })
  useEffect(() => {
    if (imei) {
      PersonaleStore.getPersonaleByImei(imei).then((res) => (local.personale = res))
    }
  }, [imei])
  let [onSearch, onQueryChange, onRecenter, onRangeChange, onPaint] = useCallbacks(local)
  return useObserver(() => (
    <Wrapper>
      <ActionWrapper>
        <PageHeader
          ghost={false}
          title={<span>扎尼河露天矿</span>}
          subTitle="人员位置轨迹"
          extra={[
            <Select
              key="search"
              showSearch
              placeholder="选择人员"
              onSearch={onSearch}
              onChange={onQueryChange}
              filterOption={false}
              style={{ width: 250, marginRight: 18 }}
            >
              {local.personaleOptions.map((p) => (
                <Option key={p.imei} value={p.imei}>{`${p.id.substr(-5)} ${p.name} ${
                  p.imei
                }`}</Option>
              ))}
            </Select>,
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
              onClick={() => {
                local.mapRef.clear()
                local.trackData = []
              }}
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
