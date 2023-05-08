import { AuthResponseError } from './Types'
import type { AuthRequest, AuthResponse } from './Types'
import { authTokenAPI } from '../apis'

const login = async (data: AuthRequest): Promise<AuthResponse> => {
  return await authTokenAPI
    .post('/login', data)
    .then((response) => {
      if (response.status !== 200) {
        throw new AuthResponseError(response.status, response.data)
      }

      return {
        jwtToken: response.data.jwtToken,
        roles: response.data.roles,
        user: response.data.loginUserDTO,
      }
    })
    .catch((error) => {
      if (error.response) {
        throw new AuthResponseError(error.response.status, error.response.data)
      } else {
        throw new AuthResponseError(0, error.message)
      }
    })
}

const register = async (data: AuthRequest): Promise<AuthResponse> => {
  return await authTokenAPI
    .post('/register', data)
    .then((response) => {
      if (response.status !== 200) {
        throw new AuthResponseError(response.status, response.data)
      }

      return {
        jwtToken: response.data.jwtToken,
        roles: response.data.roles,
        user: response.data.loginUserDTO,
      }
    })
    .catch((error) => {
      if (error.response) {
        throw new AuthResponseError(error.response.status, error.response.data)
      } else {
        throw new AuthResponseError(0, error.message)
      }
    })
}

/**
 * Auth API is used to make request to the server that refers to authentication.
 */
const authApi = {
  login,
  register,
}

export default authApi
