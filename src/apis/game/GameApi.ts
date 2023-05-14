import { authTokenAPI, gameTokenAPI } from '../apis'
import type {
  AdminGameSettingsRequest,
  AdminGameSettingsResponse,
  CreateGameRequest,
  CreateGameResponse,
  GameTokenRequest,
  GameTokenResponse,
  UserGameSettingsResponse,
  UserGameStatusResponse,
} from './Types'
import { GameResponseError } from './Types'

const createGame = async (data: CreateGameRequest): Promise<CreateGameResponse> => {
  return await authTokenAPI
    .post('/admin/createGame', data)
    .then((response) => {
      if (response.status !== 200) {
        throw new GameResponseError(response.status, response.data)
      }

      return {
        gameSessionId: response.data,
      }
    })
    .catch((error) => {
      if (error.response) {
        throw new GameResponseError(error.response.status, error.response.data)
      } else {
        throw new GameResponseError(0, error.message)
      }
    })
}

const getAdminGameSettings = async (
  data: AdminGameSettingsRequest,
): Promise<AdminGameSettingsResponse> => {
  return await authTokenAPI
    .get(`/admin/settings/${data.gameSessionId}`)
    .then((response) => {
      if (response.status !== 200) {
        throw new GameResponseError(response.status, response.data)
      }

      return {
        classRepresentation: response.data.classRepresentation,
        assetUrl: response.data.assetUrl,
        gameSessionId: response.data.gameSessionId,
        name: response.data.name,
        shortName: response.data.shortName,
      }
    })
    .catch((error) => {
      if (error.response) {
        throw new GameResponseError(error.response.status, error.response.data)
      } else {
        throw new GameResponseError(0, error.message)
      }
    })
}

const getGameToken = async (data: GameTokenRequest): Promise<GameTokenResponse> => {
  return await authTokenAPI
    .post('/getGameToken', data)
    .then((response) => {
      if (response.status !== 200) {
        throw new GameResponseError(response.status, response.data)
      }

      return {
        gameToken: response.data.gameToken,
        gameSessionId: response.data.gameSessionId,
      }
    })
    .catch((error) => {
      if (error.response) {
        throw new GameResponseError(error.response.status, error.response.data)
      } else {
        throw new GameResponseError(0, error.message)
      }
    })
}

const getUserGameSettings = async (): Promise<UserGameSettingsResponse> => {
  return await gameTokenAPI
    .get('/settings')
    .then((response) => {
      if (response.status !== 200) {
        throw new GameResponseError(response.status, response.data)
      }

      return {
        classRepresentation: response.data.classRepresentation,
        assetUrl: response.data.assetUrl,
        gameSessionId: response.data.gameSessionId,
        name: response.data.name,
        shortName: response.data.shortName,
      }
    })
    .catch((error) => {
      if (error.response) {
        throw new GameResponseError(error.response.status, error.response.data)
      } else {
        throw new GameResponseError(0, error.message)
      }
    })
}

const getUserGameStatus = async (): Promise<UserGameStatusResponse> => {
  return await gameTokenAPI
    .get('/gameStatus/')
    .then((response) => {
      if (response.status !== 200) {
        throw new GameResponseError(response.status, response.data)
      }

      return {
        coords: response.data.coords,
        direction: response.data.direction,
        className: response.data.className,
        playerId: response.data.playerId,
      }
    })
    .catch((error) => {
      if (error.response) {
        throw new GameResponseError(error.response.status, error.response.data)
      } else {
        throw new GameResponseError(0, error.message)
      }
    })
}

/**
 * Game API is used to make request to the server that refers to game.
 */
const gameApi = {
  createGame,
  getAdminGameSettings,
  getGameToken,
  getUserGameSettings,
  getUserGameStatus,
}

export default gameApi
