import React, { useEffect } from 'react'
import { Wrapper, ActionBar } from './styles'
import { Table, Button } from 'antd'
import { useObserver } from 'mobx-react'
import { AuthStore } from '#/stores'

const Columns = [
  {
    title: '用户名',
    dataIndex: 'username',
  },
  {
    title: '显示名称',
    dataIndex: 'displayName',
  },
  {
    title: '电子邮箱',
    dataIndex: 'email',
  },
  {
    title: '角色',
    dataIndex: 'role',
  },
]

export function UserManagement() {
  let store = useObserver(() => ({ users: AuthStore.users }))

  useEffect(() => {
    AuthStore.getUsers()
  }, [])
  return (
    <Wrapper>
      <ActionBar>
        <Button type="primary">新建</Button>
      </ActionBar>
      <Table dataSource={store.users} columns={Columns as any} />
    </Wrapper>
  )
}
