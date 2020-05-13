import { useCallback } from 'react'
import { debounce } from 'lodash'
import { PersonaleStore } from '#/stores'
import { adminService } from '#/services'
import { useHistory } from 'react-router'

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
    history.push('/tracks/' + imei)
  }, [])
  let onRecenter = useCallback(() => {
    localStore.mapRef && localStore.mapRef!.initMapCenter()
  }, [])
  let onRangeChange = useCallback((range) => {
    localStore.range = range
  }, [])
  let onPaint = useCallback(() => {
    let [from, to] = localStore.range
    localStore.loading = true
    if (from && to) {
      adminService
        .getTrack(localStore.imei, from.valueOf(), to.valueOf())
        .then(({ detail }) => {
          localStore.trackData = detail
          localStore.mapRef.paint()
        })
        .finally(() => (localStore.loading = false))
    }
  }, [])

  return [onSearch, onQueryChange, onRecenter, onRangeChange, onPaint]
}
