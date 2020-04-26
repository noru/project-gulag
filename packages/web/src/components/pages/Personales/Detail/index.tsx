import React from 'react'
import { Wrapper, ButtonGroup } from '#/styles'
import { Input, Button, Form as F, Modal, Switch, Radio } from 'antd'
import { Form } from './styles'
import { PersonaleStore } from '#/stores'
import { useHistory, useRouteMatch } from 'react-router'
import { useSearchParam, useEffectOnce } from 'react-use'
import { useLocalStore, useObserver } from 'mobx-react'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
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
      offset: 6,
    },
  },
}
export function PersonaleDetail() {
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
    initialValues: { sex: '男', education: '初中', maritalStatus: '未婚' },
  }))
  useEffectOnce(() => {
    ;(async () => {
      if (!local.isNew) {
        local.initialValues = await PersonaleStore.getPersonale(local.id)
        formInstance.resetFields()
      }
    })()
  })
  let onFinish = async (values) => {
    let isNew = local.isNew
    let actionName = isNew ? '创建' : '编辑'
    let action = isNew ? PersonaleStore.createPersonale : PersonaleStore.updatePersonale
    try {
      await action(values)
      Modal.success({
        title: `${actionName}成功`,
        content: `人员${actionName}成功。`,
        onOk() {
          history.push('/personales')
        },
      })
    } catch (e) {
      console.error(e)
      Modal.error({
        title: `${actionName}失败`,
        content: `未知错误, 请稍后重试\n${e.message}`,
      })
    }
  }
  return useObserver(() => (
    <Wrapper>
      <Form
        {...formItemLayout}
        name="register_personale"
        onFinish={onFinish}
        scrollToFirstError
        initialValues={local.initialValues}
        form={formInstance}
      >
        <F.Item
          name="id"
          label="人员编号"
          rules={[
            {
              required: true,
              message: '请输入人员编号',
            },
          ]}
        >
          <Input disabled={!local.isEditing} />
        </F.Item>
        <F.Item
          name="name"
          label="姓名"
          rules={[
            {
              required: true,
              message: '请输入姓名',
            },
          ]}
        >
          <Input disabled={!local.isEditing} />
        </F.Item>
        <F.Item name="imei" label="IMEI">
          <Input disabled={!local.isEditing} />
        </F.Item>
        <F.Item name="sex" label="性别">
          <Radio.Group disabled={!local.isEditing}>
            <Radio value="男">男</Radio>
            <Radio value="女">女</Radio>
          </Radio.Group>
        </F.Item>
        <F.Item name="nationalId" label="身份证号">
          <Input disabled={!local.isEditing} />
        </F.Item>
        <F.Item name="phone" label="电话">
          <Input disabled={!local.isEditing} />
        </F.Item>
        <F.Item name="jobTitle" label="工种/职位">
          <Input disabled={!local.isEditing} />
        </F.Item>
        <F.Item name="department" label="部门">
          <Input disabled={!local.isEditing} />
        </F.Item>
        <F.Item name="education" label="学历">
          <Radio.Group disabled={!local.isEditing}>
            <Radio value="初中">初中</Radio>
            <Radio value="高中">高中</Radio>
            <Radio value="大专">大专</Radio>
            <Radio value="本科">本科</Radio>
            <Radio value="硕士">硕士</Radio>
            <Radio value="博士">博士</Radio>
          </Radio.Group>
        </F.Item>
        <F.Item name="maritalStatus" label="婚姻状态">
          <Radio.Group disabled={!local.isEditing}>
            <Radio value="未婚">未婚</Radio>
            <Radio value="已婚">已婚</Radio>
            <Radio value="离异">离异</Radio>
            <Radio value="丧偶">丧偶</Radio>
          </Radio.Group>
        </F.Item>
        <F.Item name="address" label="家庭住址">
          <Input disabled={!local.isEditing} />
        </F.Item>
        <F.Item name="vehicle" label="车辆编号">
          <Input disabled={!local.isEditing} />
        </F.Item>
        <F.Item name="vehicleTerminalId" label="车辆终端编号">
          <Input disabled={!local.isEditing} />
        </F.Item>
        <F.Item name="isExternal" label="是否为外部人员">
          <Switch disabled={!local.isEditing} />
        </F.Item>
        <F.Item name="certs" label="是否为外部人员">
          <Switch disabled={!local.isEditing} />
        </F.Item>
        <F.Item {...tailFormItemLayout}>
          <ButtonGroup>
            <Button type="primary" htmlType="submit" disabled={!local.isEditing}>
              {local.isNew ? '创建人员' : '保存'}
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
