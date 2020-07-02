import React, { useState, useEffect } from 'react'
import moment, { Moment } from 'moment'
import { adminService } from '#/services'
import { CheckCircleOutlined } from '@ant-design/icons'
import { noop } from '@drewxiu/utils/lib'

interface Props {
  imei: string
  date: Moment
}

export function Cell({ imei, date }: Props) {
  let [state, setState] = useState(false)

  useEffect(() => {
    if (date.diff(moment()) > 0) {
      return
    }
    adminService
      .isAttendant(imei, date)
      .then(() => setState(true))
      .catch(noop)
  }, [imei, date])

  return <div>{state && <CheckCircleOutlined style={{ color: 'lime', fontSize: '2.5em' }} />}</div>
}
