import React from 'react'
import { useObserver } from 'mobx-react'
import { AuthStore } from '#/stores/auth'
import { Layout, Menu, Modal } from 'antd'
import { Sider, Logo, Content, MenuSpace } from './styles'
import {
  TeamOutlined,
  LogoutOutlined,
  EnvironmentOutlined,
  SettingOutlined,
  ExclamationCircleOutlined,
  FundOutlined,
  ScheduleOutlined,
} from '@ant-design/icons'
import { Route, useHistory } from 'react-router'
import { LiveLocation } from '../LiveLocation'
import { UserList } from '../Users'
import { PersonaleList } from '../Personales'
import { PersonaleDetail } from '../Personales/Detail'
import { UserDetail } from '../Users/Detail'
import { Tracks } from '../Tracks'
import { Attendance } from '../Attendance'

export function Main() {
  let history = useHistory()
  let store = useObserver(() => AuthStore)

  let logout = () => {
    Modal.confirm({
      icon: <ExclamationCircleOutlined />,
      content: '您确定要注销登录吗？',
      onOk() {
        store.logout()
        history.push('/login')
      },
    })
  }

  return (
    <Layout>
      <Sider>
        <Logo />
        <Menu theme="dark" mode="inline" selectedKeys={[history.location.pathname]}>
          <Menu.Item key="/live" onClick={() => history.push('/live')}>
            <EnvironmentOutlined />
            <span>实时位置</span>
          </Menu.Item>
          <Menu.Item key="/personales" onClick={() => history.push('/personales')}>
            <TeamOutlined />
            <span>人员管理</span>
          </Menu.Item>
          <Menu.Item key="/tracks" onClick={() => history.push('/tracks')}>
            <FundOutlined />
            <span>轨迹查询</span>
          </Menu.Item>
          <Menu.Item key="/attendance" onClick={() => history.push('/attendance')}>
            <ScheduleOutlined />
            <span>入坑统计</span>
          </Menu.Item>
        </Menu>
        <MenuSpace />
        <Menu theme="dark" mode="inline" selectedKeys={[history.location.pathname]}>
          <Menu.Item key="/users" onClick={() => history.push('/users')}>
            <SettingOutlined />
            <span>系统用户</span>
          </Menu.Item>
          <Menu.Item key="/logout" onClick={logout}>
            <LogoutOutlined />
            <span>注销登录</span>
          </Menu.Item>
        </Menu>
      </Sider>
      <Content>
        <Route path="/" exact component={LiveLocation} />
        <Route path="/live" component={LiveLocation} />
        <Route path="/users" exact component={UserList} />
        <Route path="/users/:id" component={UserDetail} />
        <Route path="/personales" exact component={PersonaleList} />
        <Route path="/personales/:id" component={PersonaleDetail} />
        <Route path="/tracks" exact component={Tracks} />
        <Route path="/tracks/:imei" component={Tracks} />
        <Route path="/attendance" exact component={Attendance} />
        <Route path="/attendance/:imei" component={Attendance} />
      </Content>
    </Layout>
  )
}
