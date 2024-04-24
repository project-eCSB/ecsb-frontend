import type { AuthResponseError, UserData } from '../../apis/auth/Types'
import { removeAuthToken, removeGameToken, setAuthToken } from '../../apis/apis'
import authAPI from '../../apis/auth/AuthAPI'
import { redirect } from 'react-router-dom'

function authThen(res: UserData): UserData {
  setAuthToken(res.jwtToken)
  return res
}

function authError(err: AuthResponseError): any | undefined {
  throw new Error(err.message)
}

const login = async (email: string, password: string): Promise<UserData> => {
  return await authAPI
    .login({ email, password })
    .then(authThen)
    .catch(authError)
}

const register = async (email: string, password: string): Promise<UserData> => {
  return await authAPI
    .register({ email, password })
    .then((message) => {
      alert("Check your mailbox and confirm email")
      redirect("/login")
    })
    .catch(authError)
}

const logout = (): void => {
  removeAuthToken()
  removeGameToken()
}

const authService = {
  login,
  register,
  logout,
}

export default authService
