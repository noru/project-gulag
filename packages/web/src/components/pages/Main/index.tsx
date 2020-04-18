import React from 'react'
import { useObserver } from 'mobx-react'
import { AuthStore } from '#/stores/auth'

export function Main() {
  let store = useObserver(() => AuthStore)
  return <div>{JSON.stringify(store.user)}</div>
}
