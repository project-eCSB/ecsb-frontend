import {
  authTokenAuthAndManagementAPI,
  authTokenAuthAndManagementOctetAPI,
  gameTokenAPI,
} from '../apis'
import type {
  MapConfig,
  AssetId,
  AssetURL,
  CopyGameRequest,
  CreateGameRequest,
  DefaultAssetsResponse,
  EndGameStatus,
  FileType,
  GameSessionId,
  GameSettings,
  GameTokenRequest,
  GameTokenResponse,
  SavedAssetsResponse,
  UploadAssetRequest,
  UserGameStatusResponse,
} from './Types'
import { GameResponseError } from './Types'
import { type AxiosResponse } from 'axios'

function handleError(error: any): any | undefined {
  if (error.response) {
    throw new GameResponseError(error.response.status, error.response.data)
  } else {
    throw new GameResponseError(0, error.message)
  }
}

function standardThen(response: AxiosResponse): any {
  if (response.status !== 200) {
    throw new GameResponseError(response.status, response.data)
  }
  return response.data
}

const createGame = async (data: CreateGameRequest): Promise<GameSessionId> => {
  return await authTokenAuthAndManagementAPI
    .post('/admin/createGame', data)
    .then(standardThen)
    .catch(handleError)
}

const getAdminGameSettings = async (gameSessionId: GameSessionId): Promise<GameSettings> => {
  return await authTokenAuthAndManagementAPI
    .get(`/admin/settings/${gameSessionId}`)
    .then(standardThen)
    .catch(handleError)
}

const startGame = async (gameSessionId: GameSessionId): Promise<void> => {
  await authTokenAuthAndManagementAPI
    .post(`/admin/startGame/${gameSessionId}`)
    .then((response) => {
      if (response.status !== 200) {
        throw new GameResponseError(response.status, response.data)
      }
    })
    .catch(handleError)
}

const copyGame = async (data: CopyGameRequest): Promise<GameSessionId> => {
  return await authTokenAuthAndManagementAPI
    .post(`/admin/copyGame/${data.gameSessionId}?gameName=${data.gameName}`)
    .then(standardThen)
    .catch(handleError)
}

const getAdminGameLogs = async (gameSessionId: number): Promise<string> => {
  return await authTokenAuthAndManagementAPI
    .get(`/admin/getLogs/${gameSessionId}`)
    .then((response) => {
      if (response.status !== 200) {
        console.error(response.status)
      }
      return response.data
    })
    .catch((error) => {
      console.error(error)
    })
}

const getGameToken = async (data: GameTokenRequest): Promise<GameTokenResponse> => {
  return await authTokenAuthAndManagementAPI
    .post('/getGameToken', data)
    .then(standardThen)
    .catch(handleError)
}

const getUserGameSettings = async (): Promise<GameSettings> => {
  return await gameTokenAPI
    .get('/settings')
    .then(standardThen)
    .catch(handleError)
}

const getPlayerResults = async (): Promise<EndGameStatus> => {
  return await gameTokenAPI
    .get('/results')
    .then(standardThen)
    .catch(handleError)
}

const getUserGameStatus = async (): Promise<UserGameStatusResponse> => {
  return await gameTokenAPI
    .get('/gameStatus')
    .then(standardThen)
    .catch(handleError)
}

const uploadAsset = async (uploadAssetRequest: UploadAssetRequest): Promise<AssetId> => {
  return await authTokenAuthAndManagementOctetAPI
    .post(
      `/assets?fileName=${uploadAssetRequest.fileName}&fileType=${uploadAssetRequest.fileType}`,
      uploadAssetRequest.file,
    )
    .then(standardThen)
    .catch(handleError)
}

const getMapConfig = async (assetId: AssetId): Promise<MapConfig> => {
  return await authTokenAuthAndManagementAPI
    .get(`/assets/map/${assetId}`)
    .then(standardThen)
    .catch(handleError)
}

const getSavedAssets = async (fileType: FileType): Promise<SavedAssetsResponse> => {
  return await authTokenAuthAndManagementAPI
    .get(`/assets?fileType=${fileType}`)
    .then(standardThen)
    .catch(handleError)
}

const getAsset = async (assetId: AssetId): Promise<AssetURL> => {
  return await authTokenAuthAndManagementAPI
    .get(`/assets/${assetId}`, { responseType: 'arraybuffer' })
    .then((response) => {
      if (response.status !== 200) {
        throw new GameResponseError(response.status, response.data)
      }
      const blob = new Blob([response.data], { type: response.headers['content-type'] })
      return URL.createObjectURL(blob)
    })
    .catch(handleError)
}

const getDefaultAssets = async (): Promise<DefaultAssetsResponse> => {
  return await authTokenAuthAndManagementAPI
    .get(`/assets/default`)
    .then(standardThen)
    .catch(handleError)
}

/**
 * Game API is used to make request to the server that refers to game.
 */
const gameAPI = {
  createGame,
  startGame,
  copyGame,
  getAdminGameSettings,
  getAdminGameLogs,
  getGameToken,
  getPlayerResults,
  getUserGameSettings,
  getUserGameStatus,
  uploadAsset,
  getMapConfig,
  getSavedAssets,
  getAsset,
  getDefaultAssets,
}

export default gameAPI
