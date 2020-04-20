import React from 'react'
import { useObserver } from 'mobx-react'
import { AuthStore } from '#/stores/auth'
import { Layout, Menu } from 'antd'
import { Sider, Logo, Content, MenuSpace } from './styles'
import {
  TeamOutlined,
  LogoutOutlined,
  EnvironmentOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { Route, useHistory } from 'react-router'
import { LiveLocation } from '../LiveLocation'
import { UserManagement } from '../UserManagement'
import { PersonaleManagement } from '../PersonaleManagement'

export function Main() {
  let history = useHistory()
  let store = useObserver(() => AuthStore)

  let logout = () => {
    store.logout()
    history.push('/login')
  }

  return (
    <Layout>
      <Sider>
        <Logo />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[history.location.pathname]}
        >
          <Menu.Item key="/live" onClick={() => history.push('/live')}>
            <EnvironmentOutlined />
            <span>实时位置</span>
          </Menu.Item>
          <Menu.Item
            key="/personale"
            onClick={() => history.push('/personale')}
          >
            <TeamOutlined />
            <span>人员管理</span>
          </Menu.Item>
        </Menu>
        <MenuSpace />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['live']}>
          <Menu.Item key="/user" onClick={() => history.push('/user')}>
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
        <Route path="/user" component={UserManagement} />
        <Route path="/personale" component={PersonaleManagement} />
      </Content>
    </Layout>
  )
}
