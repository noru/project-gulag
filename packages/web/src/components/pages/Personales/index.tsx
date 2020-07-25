import React, { useEffect, useMemo } from 'react'
import { Wrapper, ActionBar, TableActions } from '#/styles'
import { Table, Button, Modal, Input, message } from 'antd'
import { useObserver, useLocalStore } from 'mobx-react'
import { PersonaleStore } from '#/stores'
import { useHistory } from 'react-router-dom'
import { IPersonale } from '@/clients/mongo/models/personale'
import {
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  FormOutlined,
  FundOutlined,
  SearchOutlined,
  ScheduleOutlined,
} from '@ant-design/icons'
import { IMEI } from './styles'
import { ColumnFilter } from '#/components/common/ColumnFilter'

const Columns: any[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    fixed: true,
    width: 250,
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) => record.id.toString().toLowerCase().includes(value.toLowerCase()),
    render: (text, record) => {
      let history = useHistory()
      return <a onClick={() => history.push(`/personales/${record.id}`)}>{text}</a>
    },
  },
  {
    title: '姓名',
    dataIndex: 'name',
    width: 80,
    fixed: true,
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
  },
  {
    title: 'IMEI',
    dataIndex: 'imei',
    fixed: true,
    width: 250,
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
  },
  {
    title: '职务/工位',
    dataIndex: 'jobTitle',
    width: 100,
  },
  {
    title: '部门',
    dataIndex: 'department',
    width: 100,
  },
  {
    title: '性别',
    dataIndex: 'sex',
    width: 50,
    align: 'center',
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

interface LocalStore {
  editPersonale: null | IPersonale
  loading: boolean
  filters: { [dataIndex: string]: string }
  personales: IPersonale[]
  filteredPersonales: IPersonale[]
}

export function PersonaleList() {
  let history = useHistory()
  useEffect(() => {
    PersonaleStore.getAllPersonales()
  }, [])
  let store = useLocalStore<LocalStore>(() => ({
    editPersonale: null,
    loading: false,
    filters: {},
    get personales() {
      return PersonaleStore.personales
    },
    get filteredPersonales() {
      return this.personales.filter((p) => {
        return !Object.entries(store.filters).some(([id, query]) => {
          return !p[id].includes(query)
        })
      })
    },
  }))
  let columns = useMemo(() => {
    // rewrite Col IMEI render
    let cols = [...Columns]
    let [col0, col1, col2] = cols
    ;[col0, col1, col2].forEach((col) => {
      col.filterDropdown = () => (
        <ColumnFilter onChange={(val) => (store.filters[col.dataIndex] = val)} />
      )
    })
    col2.render = (text, record) => {
      return (
        <IMEI>
          <a onClick={() => (store.editPersonale = { ...record })}>
            {text ? (
              <>
                <strong>{text}</strong>
                <EditOutlined />
              </>
            ) : (
              <>
                <span>未绑定IMEI</span>
                <PlusCircleOutlined style={{ color: 'lightgreen' }} />
              </>
            )}
          </a>
        </IMEI>
      )
    }
    cols.push({
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <TableActions>
          <FundOutlined
            style={{ color: 'green' }}
            onClick={() => history.push(`/tracks/${record.imei}`)}
          />
          <ScheduleOutlined
            style={{ color: 'cornflowerblue' }}
            onClick={() => history.push(`/attendance/${record.imei}`)}
          />
          <FormOutlined onClick={() => history.push(`/personales/${record.id}?edit=true`)} />
          <DeleteOutlined
            style={{ color: 'palevioletred' }}
            onClick={() =>
              Modal.confirm({
                title: '确定要删除这个人员吗?',
                async onOk() {
                  await PersonaleStore.deletePersonale(record.id)
                },
              })
            }
          />
        </TableActions>
      ),
    })
    return cols
  }, [1])

  let updateImei = async () => {
    if (!store.editPersonale) return
    store.loading = true
    let { id, imei } = store.editPersonale!
    await PersonaleStore.updatePersonale({ id, imei })
    store.loading = false
    store.editPersonale = null
    PersonaleStore.getAllPersonales()
  }
  return useObserver(() => (
    <Wrapper>
      <ActionBar>
        <Button type="primary" onClick={() => history.push('/personales/new')}>
          新建
        </Button>
        <Button
          onClick={async () => {
            await PersonaleStore.generateRYCS()
            message.success('文件已生成')
          }}
        >
          生成RYCS文件
        </Button>
      </ActionBar>
      <Table
        dataSource={store.filteredPersonales}
        columns={columns as any}
        size="small"
        pagination={{ pageSize: 30 }}
        rowKey="id"
      />
      {store.editPersonale && (
        <Modal
          title="绑定或更改改用户的IMEI"
          visible
          onOk={updateImei}
          confirmLoading={store.loading}
          onCancel={() => (store.editPersonale = null)}
        >
          <Input
            value={store.editPersonale.imei}
            onChange={(e) => (store.editPersonale!.imei = e.target.value)}
          />
        </Modal>
      )}
    </Wrapper>
  ))
}
