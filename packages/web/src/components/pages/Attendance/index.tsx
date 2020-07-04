import React, { useEffect } from 'react'
import { Wrapper, ActionWrapper, CalendarWrapper } from './styles'
import { useObserver, useLocalStore } from 'mobx-react'
import { PageHeader, Descriptions, Select, Calendar, DatePicker, Button } from 'antd'
import { IPersonale } from '@/clients/mongo/models/personale'
import { useRouteMatch } from 'react-router-dom'
import { PersonaleStore } from '#/stores'
import { useCallbacks } from './hooks'
import locale from 'antd/es/date-picker/locale/zh_CN'
import { FundOutlined } from '@ant-design/icons'
import moment from 'moment'

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

export function Attendance() {
  let {
    params: { imei },
  } = useRouteMatch()
  let local = useLocalStore(() => {
    return {
      imei: imei || null,
      loading: false,
      query: '',
      personale: null,
      range: [moment().subtract(1, 'month'), moment()],
      get personaleOptions() {
        if (!this.query) {
          return []
        }
        return PersonaleStore.personales.filter((p) => {
          return [p.id, p.name, p.imei].some((str) => str.includes(this.query))
        })
      },
    } as LocalState
  })
  useEffect(() => {
    if (imei) {
      PersonaleStore.getPersonaleByImei(imei).then((res) => (local.personale = res))
    }
  }, [imei])
  let [onSearch, onQueryChange, dateCellRender, onRangeChange, exportReport] = useCallbacks(local)
  return useObserver(() => (
    <Wrapper>
      <ActionWrapper>
        <PageHeader
          ghost={false}
          title={<span>扎尼河露天矿</span>}
          subTitle="人员考勤记录"
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
              format="YYYY-MM-DD"
              showTime={false}
              defaultValue={local.range}
              onChange={onRangeChange}
            />,
            <Button
              key="paint"
              type="primary"
              icon={<FundOutlined />}
              onClick={exportReport}
              loading={local.loading}
            >
              导出所有人员出勤报告
            </Button>,
          ]}
        >
          <Descriptions size="small" column={3}>
            <Descriptions.Item label="姓名">{local.personale?.name}</Descriptions.Item>
            <Descriptions.Item label="人员卡编码">{local.personale?.id}</Descriptions.Item>
            <Descriptions.Item label="IMEI">{local.personale?.imei}</Descriptions.Item>
            <Descriptions.Item label="部门">{local.personale?.department}</Descriptions.Item>
            <Descriptions.Item label="工种">{local.personale?.jobTitle}</Descriptions.Item>
          </Descriptions>
        </PageHeader>
      </ActionWrapper>
      <CalendarWrapper>
        <Calendar dateCellRender={(date) => dateCellRender(date, imei)} locale={locale} />
      </CalendarWrapper>
    </Wrapper>
  ))
}
