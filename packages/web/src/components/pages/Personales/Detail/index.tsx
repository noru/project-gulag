import React from 'react'
import { Wrapper } from '#/styles'
import { Input, Button, Form as F, Space, Modal, Switch, Radio } from 'antd'
import { Form } from './styles'
import { PersonaleStore } from '#/stores'
import { useHistory } from 'react-router'

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
export function PersonaleDetail() {
  let history = useHistory()

  let onFinish = (values) => {
    PersonaleStore.createPersonale(values)
      .then(() => {
        Modal.success({
          title: '创建成功',
          content: '人员创建成功。',
          onOk() {
            history.push('/personales')
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
  return (
    <Wrapper>
      <Form
        {...formItemLayout}
        name="register"
        onFinish={onFinish}
        scrollToFirstError
        initialValues={{
          sex: '男',
          education: '初中',
          maritalStatus: '未婚',
        }}
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
          <Input />
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
          <Input />
        </F.Item>
        <F.Item name="imei" label="IMEI">
          <Input />
        </F.Item>
        <F.Item name="sex" label="性别">
          <Radio.Group>
            <Radio value="男">男</Radio>
            <Radio value="女">女</Radio>
          </Radio.Group>
        </F.Item>
        <F.Item name="nationalId" label="身份证号">
          <Input />
        </F.Item>
        <F.Item name="phone" label="电话">
          <Input />
        </F.Item>
        <F.Item name="jobTitle" label="工种/职位">
          <Input />
        </F.Item>
        <F.Item name="department" label="部门">
          <Input />
        </F.Item>
        <F.Item name="education" label="学历">
          <Radio.Group>
            <Radio value="初中">初中</Radio>
            <Radio value="高中">高中</Radio>
            <Radio value="大专">大专</Radio>
            <Radio value="本科">本科</Radio>
            <Radio value="硕士">硕士</Radio>
            <Radio value="博士">博士</Radio>
          </Radio.Group>
        </F.Item>
        <F.Item name="maritalStatus" label="婚姻状态">
          <Radio.Group>
            <Radio value="未婚">未婚</Radio>
            <Radio value="已婚">已婚</Radio>
            <Radio value="离异">离异</Radio>
            <Radio value="丧偶">丧偶</Radio>
          </Radio.Group>
        </F.Item>
        <F.Item name="address" label="家庭住址">
          <Input />
        </F.Item>
        <F.Item name="vehicle" label="车辆编号">
          <Input />
        </F.Item>
        <F.Item name="vehicleTerminalId" label="车辆终端编号">
          <Input />
        </F.Item>
        <F.Item name="isExternal" label="是否为外部人员">
          <Switch />
        </F.Item>

        <F.Item {...tailFormItemLayout}>
          <Space size="large" />
          <Button type="primary" htmlType="submit">
            创建人员
          </Button>
        </F.Item>
      </Form>
    </Wrapper>
  )
}
