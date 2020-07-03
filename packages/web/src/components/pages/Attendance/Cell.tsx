import React, { useState, useEffect } from 'react'
import moment, { Moment } from 'moment'
import { adminService } from '#/services'
import { CarryOutOutlined, QuestionCircleOutlined } from '@ant-design/icons'

interface Props {
  imei: string
  date: Moment
}

export function Cell({ imei, date }: Props) {
  let [state, setState] = useState<null | boolean>(null)

  useEffect(() => {
    if (date.diff(moment()) > 0) {
      setState(null)
      return
    }
    adminService
      .isAttendant(imei, date)
      .then(() => setState(true))
      .catch(() => setState(false))
  }, [imei, date])

  return (
    <div>
      {state === null && null}
      {state === true && <CarryOutOutlined style={{ color: 'limegreen', fontSize: '2.5em' }} />}
      {state === false && <QuestionCircleOutlined style={{ color: '#ccc', fontSize: '2.5em' }} />}
    </div>
  )
}
