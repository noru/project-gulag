import React from 'react'
import { useObserver } from 'mobx-react'
import { AuthStore } from '#/stores/auth'

export function PersonaleManagement() {
  let store = useObserver(() => AuthStore)
  return <div>Personale</div>
}
