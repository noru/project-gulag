import React from 'react'
import { useObserver } from 'mobx-react'
import { AuthStore } from '#/stores/auth'

export function UserManagement() {
  let store = useObserver(() => AuthStore)
  return (
    <div>
      user
      <div>{JSON.stringify(store.user)}</div>
    </div>
  )
}
