import React from 'react'
import { useCallback } from 'react'
import { debounce } from 'lodash'
import { PersonaleStore } from '#/stores'
import { useHistory } from 'react-router'
import { Cell } from './Cell'
import Exporter from 'data-exporter'
import { adminService } from '#/services'

export function useCallbacks(localStore) {
  let history = useHistory()
  let onSearch = useCallback(
    debounce(async (query) => {
      localStore.query = query
      if (PersonaleStore.personales.length === 0) {
        await PersonaleStore.getAllPersonales()
      }
    }, 300),
    []
  )
  let onQueryChange = useCallback(async (imei) => {
    history.push('/attendance/' + imei)
  }, [])

  let dateCellRender = useCallback((date, imei) => {
    return <Cell date={date} imei={imei} />
  }, [])

  let onRangeChange = useCallback((range) => {
    localStore.range = range
  }, [])

  let exportReport = useCallback(() => {
    let [from, to] = localStore.range
    if (from && to) {
      localStore.loading = true
      adminService
        .getAttendanceReport(from, to)
        .then(({ detail }) => {
          new Exporter(
            detail,
            'csv',
            `出勤记录${from.format('YYYY_MM_DD')}-${to.format('YYYY_MM_DD')}`
          ).save()
        })
        .finally(() => (localStore.loading = false))
    }
  }, [])

  return [onSearch, onQueryChange, dateCellRender, onRangeChange, exportReport]
}
