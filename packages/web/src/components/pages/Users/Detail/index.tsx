import React from 'react'
import { Wrapper, ButtonGroup } from '#/styles'
import { Form } from './styles'
import { Input, Tooltip, Button, Form as F, Modal } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { AuthStore } from '#/stores'
import { useHistory, useRouteMatch } from 'react-router'
import { useEffectOnce, useSearchParam } from 'react-use'
import { useLocalStore, useObserver } from 'mobx-react'

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
  let history = useHistory()
  let [formInstance] = F.useForm()
  let {
    params: { id },
  } = useRouteMatch()
  let isEditing = useSearchParam('edit') === 'true'

  let local = useLocalStore(() => ({
    get isNew() {
      return this.id === 'new'
    },
    id,
    isEditing: id === 'new' || isEditing,
    initialValues: {},
  }))
  useEffectOnce(() => {
    ;(async () => {
      if (!local.isNew) {
        local.initialValues = await AuthStore.getUser(local.id)
        formInstance.resetFields()
      }
    })()
  })

  let onFinish = (values) => {
    AuthStore.createUser(values)
      .then(() => {
        Modal.success({
          title: '创建成功',
          content: '系统用户创建成功, 您可以使用该用户登录。',
          onOk() {
            history.push('/users')
          },
        })
      })
      .catch((e) => {
        console.error(e)
        Modal.error({
          title: '创建失败',
          content: '未知错误, 请稍后重试',
        })
      })
  }
  return useObserver(() => (
    <Wrapper>
      <Form
        {...formItemLayout}
        name="register_user"
        onFinish={onFinish}
        scrollToFirstError
        initialValues={local.initialValues}
        form={formInstance}
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
          <Input disabled={!local.isEditing} />
        </F.Item>
        <F.Item
          name="email"
          label="E-mail"
          rules={[
            {
              required: true,
              message: '请输入电子邮件',
            },
            {
              type: 'email',
              message: '电子邮件格式不正确',
            },
          ]}
        >
          <Input disabled={!local.isEditing} />
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
          <Input disabled={!local.isEditing} />
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
          <Input.Password disabled={!local.isEditing} />
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
          <Input.Password disabled={!local.isEditing} />
        </F.Item>

        <F.Item
          {...tailFormItemLayout}
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <ButtonGroup>
            <Button
              type="primary"
              htmlType="submit"
              disabled={!local.isEditing}
            >
              {local.isNew ? '创建系统用户' : '保存'}
            </Button>
            {!local.isNew && local.isEditing && (
              <Button
                onClick={() => {
                  local.isEditing = false
                  formInstance.resetFields()
                }}
              >
                取消
              </Button>
            )}
            {!local.isNew && !local.isEditing && (
              <Button
                onClick={() => {
                  local.isEditing = true
                }}
              >
                编辑
              </Button>
            )}
          </ButtonGroup>
        </F.Item>
      </Form>
    </Wrapper>
  ))
}
