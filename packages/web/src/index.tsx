import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { Routes } from './routes'
import './index.scss'

const rootElement = document.getElementById('app')

const App = (
  <AppContainer>
    <Routes />
  </AppContainer>
)

render(App, rootElement)

if (module.hot) {
  module.hot.accept()
}
