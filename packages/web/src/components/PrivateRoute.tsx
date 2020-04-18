import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { getAuthToken } from '#/services/axios'

export const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (getAuthToken() ? <Component {...props} /> : <Redirect to="/login" />)} />
)
