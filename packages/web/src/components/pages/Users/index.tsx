import React, { useEffect, useMemo } from 'react'
import { Wrapper, ActionBar, TableActions } from '#/styles'
import { Table, Button, Modal } from 'antd'
import { useObserver } from 'mobx-react'
import { AuthStore } from '#/stores'
import { useHistory } from 'react-router'
import { FormOutlined, DeleteOutlined } from '@ant-design/icons'

const Columns: any[] = [
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
  let columns = useMemo(() => {
    let cols = [...Columns]
    cols.push({
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <TableActions>
          <FormOutlined
            onClick={() => history.push(`/users/${record.username}?edit=true`)}
          />
          <DeleteOutlined
            style={{ color: 'palevioletred' }}
            onClick={() =>
              Modal.confirm({
                title: '确定要删除这个人员吗?',
                async onOk() {
                  await AuthStore.deleteUser(record.username)
                },
              })
            }
          />
        </TableActions>
      ),
    })
    return cols
  }, [1])

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
      <Table
        dataSource={store.users}
        columns={columns as any}
        rowKey="username"
      />
    </Wrapper>
  )
}
