import { Navigate, useNavigate } from 'react-router-dom'
import { decodeAuthToken, getAuthToken } from '../../apis/apis'
import './NoAuthRoles.css'
import authService from '../../services/auth/AuthService'

const NoAuthRoles = () => {
  const navigate = useNavigate()

  const token = getAuthToken()
  if (!token) {
    return <Navigate to='/login' replace />
  }

  const decodedToken = decodeAuthToken(token)
  if (decodedToken.roles.length !== 0) {
    return <Navigate to='/' replace />
  }

  const handleLogOut = () => {
    authService.logout()
    navigate('/login')
  }

  return (
    <div id='no-auth-roles-container'>
      <h1>Your account does not have any assigned roles.</h1>
      <p>
        Please contact your administrator to assign roles to your account, or log out and log in
        with another account that has assigned roles.
      </p>
      <button onClick={handleLogOut}>Log out</button>
    </div>
  )
}

export default NoAuthRoles
