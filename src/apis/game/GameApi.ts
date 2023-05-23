import { authTokenAPI, gameTokenAPI } from '../apis'
import type {
  AdminGameSettingsRequest,
  AdminGameSettingsResponse,
  AssetConfigRequest,
  AssetConfigResponse,
  CreateGameRequest,
  CreateGameResponse,
  GameTokenRequest,
  GameTokenResponse,
  SavedAssetsRequest,
  SavedAssetsResponse,
  UploadAssetRequest,
  UploadAssetResponse,
  UserGameSettingsResponse,
  UserGameStatusResponse,
} from './Types'
import { GameResponseError } from './Types'
import { type PlayerEquipment } from '../../services/game/Types'

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
        classResourceRepresentation: response.data.classResourceRepresentation,
        travels: response.data.travels,
        gameSessionId: response.data.gameSessionId,
        name: response.data.name,
        shortName: response.data.shortName,
        gameAssets: response.data.gameAssets,
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
        classResourceRepresentation: response.data.classResourceRepresentation,
        travels: response.data.travels,
        gameSessionId: response.data.gameSessionId,
        name: response.data.name,
        shortName: response.data.shortName,
        gameAssets: response.data.gameAssets,
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

const getPlayerEquipment = async (): Promise<PlayerEquipment> => {
  return await gameTokenAPI
    .get('/equipment')
    .then((response) => {
      if (response.status !== 200) {
        throw new GameResponseError(response.status, response.data)
      }

      return response.data
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
    .get('/gameStatus')
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

const uploadAsset = async (
  uploadAssetRequest: UploadAssetRequest,
): Promise<UploadAssetResponse> => {
  return await authTokenAPI
    .post(
      `/assets?fileName=${uploadAssetRequest.fileName}&fileType=${uploadAssetRequest.fileType}`,
      uploadAssetRequest.file,
    )
    .then((response) => {
      if (response.status !== 200) {
        throw new GameResponseError(response.status, response.data)
      }

      return {
        assetId: response.data,
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

const getAssetConfig = async (
  assetConfigRequest: AssetConfigRequest,
): Promise<AssetConfigResponse> => {
  return await authTokenAPI
    .get(`/assets/config/${assetConfigRequest.assetId}`)
    .then((response) => {
      if (response.status !== 200) {
        throw new GameResponseError(response.status, response.data)
      }

      return response.data as AssetConfigResponse
    })
    .catch((error) => {
      if (error.response) {
        throw new GameResponseError(error.response.status, error.response.data)
      } else {
        throw new GameResponseError(0, error.message)
      }
    })
}

const getSavedAssets = async (request: SavedAssetsRequest): Promise<SavedAssetsResponse> => {
  return await authTokenAPI
    .get(`/assets?fileType=${request.fileType}`)
    .then((response) => {
      if (response.status !== 200) {
        throw new GameResponseError(response.status, response.data)
      }

      return {
        assets: response.data,
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
  getPlayerEquipment,
  getUserGameSettings,
  getUserGameStatus,
  uploadAsset,
  getAssetConfig,
  getSavedAssets,
}

export default gameApi
