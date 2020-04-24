import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { Routes } from './routes'
import { authService } from './services/auth'
import './index.scss'
import 'mobx-react-lite/batchingForReactDom'

const rootElement = document.getElementById('app')

setInterval(authService.reauth, 25 * 60 * 1000)

const App = (
  <AppContainer>
    <Routes />
  </AppContainer>
)

render(App, rootElement)

if (module.hot) {
  module.hot.accept()
}
