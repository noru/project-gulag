import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { getAuthToken } from '#/services/axios'

export const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest as any} render={(props) => (getAuthToken() ? <Component {...props as any} /> : <Redirect to="/login" />)} />
)
