import React from 'react'
import { Route, BrowserRouter } from 'react-router-dom'
import { PrivateRoute } from '#/components/PrivateRoute'
import { Login } from './components/pages/Login'
import { Main } from './components/pages/Main'

export const Routes = () => (
  <BrowserRouter>
    <Route path="/login" component={Login} />
    <PrivateRoute path="/" component={Main} />
  </BrowserRouter>
)
