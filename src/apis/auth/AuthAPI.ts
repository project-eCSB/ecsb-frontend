import type { AuthRequest, UserData } from './Types'
import { AuthResponseError } from './Types'
import { authTokenAuthAndManagementAPI } from '../apis'
import { type AxiosResponse } from 'axios'
import { GameResponseError } from '../game/Types'

function standardThen(response: AxiosResponse): any {
  if (response.status !== 200) {
    throw new GameResponseError(response.status, response.data)
  }
  return response.data
}

function handleError(error: any): any | undefined {
  if (error.response) {
    throw new AuthResponseError(error.response.status, error.response.data)
  } else {
    throw new AuthResponseError(0, error.message)
  }
}

const login = async (data: AuthRequest): Promise<UserData> => {
  return await authTokenAuthAndManagementAPI
    .post('/login', data)
    .then(standardThen)
    .catch(handleError)
}

const register = async (data: AuthRequest): Promise<UserData> => {
  return await authTokenAuthAndManagementAPI
    .post('/register', data)
    .then(standardThen)
    .catch(handleError)
}

/**
 * Auth API is used to make request to the server that refers to authentication.
 */
const authAPI = {
  login,
  register,
}

export default authAPI
