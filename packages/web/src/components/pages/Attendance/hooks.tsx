import React from 'react'
import { useCallback } from 'react'
import { debounce } from 'lodash'
import { PersonaleStore } from '#/stores'
import { useHistory } from 'react-router'
import { Cell } from './Cell'

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
    console.error(date)
    return <Cell date={date} imei={imei} />
  }, [])

  return [onSearch, onQueryChange, dateCellRender]
}
