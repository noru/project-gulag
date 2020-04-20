import React, { useEffect } from 'react'
import { Wrapper, ActionBar } from '#/styles'
import { Table, Button } from 'antd'
import { useObserver } from 'mobx-react'
import { AuthStore } from '#/stores'
import { useHistory } from 'react-router'

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

export function UserList() {
  let history = useHistory()
  let store = useObserver(() => ({
    users: AuthStore.users,
    user: AuthStore.user,
  }))

  useEffect(() => {
    AuthStore.getUsers()
  }, [])
  return (
    <Wrapper>
      <ActionBar>
        <Button type="primary" onClick={() => history.push('/users/new')}>
          新建
        </Button>
        <h2>你好, {store.user.displayName || store.user.username}</h2>
      </ActionBar>
      <Table dataSource={store.users} columns={Columns as any} />
    </Wrapper>
  )
}
