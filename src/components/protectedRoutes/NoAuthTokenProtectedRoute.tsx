import type { ReactElement } from 'react'
import { Navigate } from 'react-router'
import { decodeAuthToken, getAuthToken } from '../../apis/apis'

const NoAuthTokenProtectedRoute = ({ children }: { children: ReactElement }) => {
  const token = getAuthToken()
  if (token) {
    const decodedToken = decodeAuthToken(token)
    if (decodedToken.roles.length === 0) {
      return <Navigate to='/no-auth-roles' replace />
    }

    return <Navigate to='/' replace />
  }

  return children
}

export default NoAuthTokenProtectedRoute
