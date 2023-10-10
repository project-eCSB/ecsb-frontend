import { authTokenAuthAndMenagementAPI, gameTokenAPI, gameTokenSelfInteractionsAPI } from '../apis'
import type {
  AdminGameSettingsRequest,
  AdminGameSettingsResponse,
  AssetConfigRequest,
  AssetConfigResponse,
  AssetRequest,
  AssetResponse,
  CreateGameRequest,
  CreateGameResponse,
  DecreaseVisibleEquipmentSourceRequest,
  GameTokenRequest,
  GameTokenResponse,
  IncreaseVisibleEquipmentSourceRequest,
  ProductionRequest,
  ProductionResponse,
  SavedAssetsRequest,
  SavedAssetsResponse,
  TravelRequest,
  TravelResponse,
  UploadAssetRequest,
  UploadAssetResponse,
  UserGameSettingsResponse,
  UserGameStatusResponse,
} from './Types'
import { GameResponseError } from './Types'
import { type Equipment } from '../../services/game/Types'

const createGame = async (data: CreateGameRequest): Promise<CreateGameResponse> => {
  return await authTokenAuthAndMenagementAPI
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
  return await authTokenAuthAndMenagementAPI
    .get(`/admin/settings/${data.gameSessionId}`)
    .then((response) => {
      if (response.status !== 200) {
        throw new GameResponseError(response.status, response.data)
      }

      return {
        timeForGame: response.data.timeForGame,
        walkingSpeed: response.data.walkingSpeed,
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

const getAdminGameLogs = async (data: AdminGameSettingsRequest): Promise<string> => {
  return await authTokenAuthAndMenagementAPI
    .get(`/getLogs/${data.gameSessionId}`)
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
  return await authTokenAuthAndMenagementAPI
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
        timeForGame: response.data.timeForGame,
        walkingSpeed: response.data.walkingSpeed,
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

const getPlayerEquipment = async (): Promise<Equipment> => {
  return await gameTokenSelfInteractionsAPI
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

const increaseVisibleEquipmentSource = async (
  data: IncreaseVisibleEquipmentSourceRequest,
): Promise<null> => {
  return await gameTokenSelfInteractionsAPI
    .put(`/visibleEquipment/${data.resourceName}/increase`)
    .then((response) => {
      if (response.status !== 200) {
        throw new GameResponseError(response.status, response.data)
      }

      return null
    })
    .catch((error) => {
      if (error.response) {
        throw new GameResponseError(error.response.status, error.response.data)
      } else {
        throw new GameResponseError(0, error.message)
      }
    })
}

const decreaseVisibleEquipmentSource = async (
  data: DecreaseVisibleEquipmentSourceRequest,
): Promise<null> => {
  return await gameTokenSelfInteractionsAPI
    .put(`/visibleEquipment/${data.resourceName}/decrease`)
    .then((response) => {
      if (response.status !== 200) {
        throw new GameResponseError(response.status, response.data)
      }

      return null
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
  return await authTokenAuthAndMenagementAPI
    .post(
      `/assets?fileName=${uploadAssetRequest.fileName}&fileType=${uploadAssetRequest.fileType}`,
      uploadAssetRequest.file,
      {
        headers: {
          'Content-Type': 'application/octet-stream',
        },
      },
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
  return await authTokenAuthAndMenagementAPI
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
  return await authTokenAuthAndMenagementAPI
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

const getAsset = async (request: AssetRequest): Promise<AssetResponse> => {
  return await authTokenAuthAndMenagementAPI
    .get(`/assets/${request.assetId}`, { responseType: 'arraybuffer' })
    .then((response) => {
      if (response.status !== 200) {
        throw new GameResponseError(response.status, response.data)
      }

      const blob = new Blob([response.data], { type: response.headers['content-type'] })
      const url = URL.createObjectURL(blob)

      return {
        assetURL: url,
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

const produce = async (data: ProductionRequest): Promise<ProductionResponse> => {
  return await gameTokenSelfInteractionsAPI
    .post('/production', data.quantity)
    .then((response) => {
      if (response.status !== 200) {
        throw new GameResponseError(response.status, response.data)
      }

      return {
        success: true,
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

const travel = async (data: TravelRequest): Promise<TravelResponse> => {
  return await gameTokenSelfInteractionsAPI
    .post('/travel', data.city)
    .then((response) => {
      if (response.status !== 200) {
        throw new GameResponseError(response.status, response.data)
      }

      return {
        success: true,
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
const gameAPI = {
  createGame,
  getAdminGameSettings,
  getAdminGameLogs,
  getGameToken,
  getPlayerEquipment,
  getUserGameSettings,
  getUserGameStatus,
  uploadAsset,
  getAssetConfig,
  getSavedAssets,
  getAsset,
  produce,
  travel,
  increaseVisibleEquipmentSource,
  decreaseVisibleEquipmentSource,
}

export default gameAPI
