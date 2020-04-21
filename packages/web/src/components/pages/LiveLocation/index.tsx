import React from 'react'
import { APILoader } from '@uiw/react-baidu-map'
import { Wrapper } from './styles'
import { CustomMap } from './Map'
// import { useObserver } from 'mobx-react'
// import { AuthStore } from '#/stores/auth'

export function LiveLocation() {
  // let store = useObserver(() => AuthStore)

  return (
    <Wrapper>
      <APILoader akay="qZpPLwPWLRaSrICDaXAzDYUml0YOx9st">
        <CustomMap />
      </APILoader>
    </Wrapper>
  )
}
