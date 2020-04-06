import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'

const rootElement = document.getElementById('app')

const App = 
  <AppContainer>
    <div>
      stub
    </div>
  </AppContainer>


render(App, rootElement)

if (module.hot) {
  module.hot.accept()
}