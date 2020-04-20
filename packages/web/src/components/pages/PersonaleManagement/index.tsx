import React, { useEffect } from 'react'
import { Wrapper, ActionBar } from './styles'
import { Table, Button } from 'antd'
import { useObserver } from 'mobx-react'
import { PersonaleStore } from '#/stores'
import { useHistory } from 'react-router-dom'

const Columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    fixed: true,
  },
  {
    title: '姓名',
    dataIndex: 'name',
    width: 80,
    render: (text, record) => {
      let history = useHistory()
      return (
        <a onClick={() => history.push(`/personale/${record.id}`)}>{text}</a>
      )
    },
  },
  {
    title: 'IMEI',
    dataIndex: 'imei',
    fixed: true,
  },

  {
    title: '工种/职务',
    dataIndex: 'jobTitle',
  },
  {
    title: '身份证号',
    dataIndex: 'nationalId',
  },
  {
    title: '性别',
    dataIndex: 'sex',
    width: 50,
    align: 'center',
  },
  {
    title: '电话',
    dataIndex: 'phone',
  },
  {
    title: '家庭住址',
    dataIndex: 'address',
    ellipsis: true,
  },
  {
    title: '本单位人员',
    dataIndex: 'isExternal',
    render(val) {
      return val ? '否' : '是'
    },
    align: 'center',
  },
]

export function PersonaleManagement() {
  let store = useObserver(() => ({ personales: PersonaleStore.personales }))

  useEffect(() => {
    PersonaleStore.getAllPersonales()
  }, [])
  return (
    <Wrapper>
      <ActionBar>
        <Button type="primary">新建</Button>
      </ActionBar>
      <Table
        dataSource={store.personales}
        columns={Columns as any}
        size="small"
        pagination={{ pageSize: 50 }}
      />
    </Wrapper>
  )
}
