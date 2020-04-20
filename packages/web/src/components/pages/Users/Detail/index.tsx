import React from 'react'
import { Wrapper } from '#/styles'
import { Form } from './styles'
import { Input, Tooltip, Button, Form as F, Space } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { AuthStore } from '#/stores'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },

    sm: { span: 16 },
  },
}
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
}

export function UserDetail() {
  let onFinish = (values) => {
    AuthStore.createUser(values)
  }
  return (
    <Wrapper>
      <Form
        {...formItemLayout}
        name="register"
        onFinish={onFinish}
        scrollToFirstError
      >
        <F.Item
          name="username"
          label="用户名"
          rules={[
            {
              required: true,
              message: '请输入用户名',
            },
          ]}
        >
          <Input />
        </F.Item>
        <F.Item
          name="email"
          label="E-mail"
          rules={[
            {
              type: 'email',
              message: '电子邮件格式不正确',
            },
          ]}
        >
          <Input />
        </F.Item>

        <F.Item
          name="displayName"
          label={
            <span>
              显示名称{' '}
              <Tooltip title="界面上显示的名称">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
        >
          <Input />
        </F.Item>
        <F.Item
          name="password"
          label="密码"
          rules={[
            {
              required: true,
              message: '请输入密码',
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </F.Item>

        <F.Item
          name="confirm"
          label="确认密码"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: '请重复输入密码',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve()
                }
                return Promise.reject('您两次输入的密码不一致')
              },
            }),
          ]}
        >
          <Input.Password />
        </F.Item>

        <F.Item {...tailFormItemLayout}>
          <Space size="large" />
          <Button type="primary" htmlType="submit">
            创建系统用户
          </Button>
        </F.Item>
      </Form>
    </Wrapper>
  )
}
