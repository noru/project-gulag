import React from 'react'
import { Wrapper, LoginWrapper } from './styles'
import { Form, Input, Button, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { authService } from '#/services'
import { useHistory } from 'react-router-dom'
import { AuthStore } from '#/stores/auth'

export function Login() {
  let history = useHistory()
  let onFinish = async ({ username, password }: any) => {
    try {
      let user = await authService.login(username, password)
      AuthStore.user = user
      history.push('/')
    } catch (e) {
      message.error('登录失败，请检查输入')
    }
  }

  return (
    <Wrapper>
      <LoginWrapper>
        <Form onFinish={onFinish}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input
              prefix={<LockOutlined />}
              type="password"
              placeholder="密码"
              size="large"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              className="login-btn"
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </LoginWrapper>
    </Wrapper>
  )
}
