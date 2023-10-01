import { setGameToken } from '../../apis/apis'
import gameAPI from '../../apis/game/GameAPI'
import type {
  AdminGameSettingsResponse,
  AssetConfigResponse,
  AssetResponse,
  ClassResourceRepresentation,
  CreateGameRequestTravels,
  CreateGameResponse,
  GameResponseError,
  GameTokenResponse,
  ProductionResponse,
  SavedAsset,
  SavedAssetsResponse,
  UploadAssetResponse,
  UserGameSettingsResponse,
  UserGameStatusResponse,
} from '../../apis/game/Types'
import type { AssetConfig, Equipment, GameSettings, GameStatus } from './Types'

const createGame = async (
  classResourceRepresentation: ClassResourceRepresentation[],
  gameName: string,
  travels: CreateGameRequestTravels[],
  mapAssetId: number,
  tileAssetId: number,
  characterAssetId: number,
  resourceAssetsId: number,
  timeForGame: number,
  maxTimeAmount: number,
  walkingSpeed: number,
): Promise<number> => {
  return await gameAPI
    .createGame({
      travels,
      classResourceRepresentation,
      gameName,
      mapAssetId,
      tileAssetId,
      characterAssetId,
      resourceAssetsId,
      timeForGame,
      maxTimeAmount,
      walkingSpeed,
    })
    .then((res: CreateGameResponse) => {
      return res.gameSessionId
    })
    .catch((err: GameResponseError) => {
      throw new Error(err.message)
    })
}

const getAdminGameSettings = async (gameSessionId: number): Promise<GameSettings> => {
  return await gameAPI
    .getAdminGameSettings({ gameSessionId })
    .then((res: AdminGameSettingsResponse) => {
      const gameSettings: GameSettings = {
        classResourceRepresentation: res.classResourceRepresentation,
        travels: res.travels,
        gameSessionId: res.gameSessionId,
        name: res.name,
        shortName: res.shortName,
        gameAssets: res.gameAssets,
      }

      return gameSettings
    })
    .catch((err: GameResponseError) => {
      throw new Error(err.message)
    })
}

const getGameSession = async (gameCode: string, playerId: string): Promise<number> => {
  return await gameAPI
    .getGameToken({ gameCode, playerId })
    .then((res: GameTokenResponse) => {
      const gameToken: string = res.gameToken
      const gameSessionId: number = res.gameSessionId

      setGameToken(gameToken)

      return gameSessionId
    })
    .catch((err: GameResponseError) => {
      throw new Error(err.message)
    })
}

const getUserGameSettings = async (): Promise<GameSettings> => {
  return await gameAPI
    .getUserGameSettings()
    .then((res: UserGameSettingsResponse) => {
      const gameSettings: GameSettings = {
        classResourceRepresentation: res.classResourceRepresentation,
        travels: res.travels,
        gameSessionId: res.gameSessionId,
        name: res.name,
        shortName: res.shortName,
        gameAssets: res.gameAssets,
      }

      return gameSettings
    })
    .catch((err: GameResponseError) => {
      throw new Error(err.message)
    })
}

const getPlayerEquipment = async (): Promise<Equipment> => {
  return await gameAPI
    .getPlayerEquipment()
    .then((res: Equipment) => {
      return res
    })
    .catch((err: GameResponseError) => {
      throw new Error(err.message)
    })
}

const getUserGameStatus = async (): Promise<GameStatus> => {
  return await gameAPI
    .getUserGameStatus()
    .then((res: UserGameStatusResponse) => {
      const gameStatus: GameStatus = {
        coords: res.coords,
        direction: res.direction,
        className: res.className,
        playerId: res.playerId,
      }

      return gameStatus
    })
    .catch((err: GameResponseError) => {
      throw new Error(err.message)
    })
}

const uploadAsset = async (
  file: ArrayBuffer,
  fileName: string,
  fileType: string,
): Promise<number> => {
  return await gameAPI
    .uploadAsset({ file, fileName, fileType })
    .then((response: UploadAssetResponse) => {
      const assetId: number = response.assetId

      return assetId
    })
    .catch((err: GameResponseError) => {
      throw new Error(err.message)
    })
}

const getAssetConfig = async (assetId: number): Promise<AssetConfig> => {
  return await gameAPI
    .getAssetConfig({ assetId })
    .then((response: AssetConfigResponse) => {
      return response
    })
    .catch((err: GameResponseError) => {
      throw new Error(err.message)
    })
}

const getSavedAssets = async (fileType: string): Promise<SavedAsset[]> => {
  return await gameAPI
    .getSavedAssets({ fileType: fileType })
    .then((res: SavedAssetsResponse) => {
      const savedAssets: SavedAsset[] = res.assets

      return savedAssets
    })
    .catch((err: GameResponseError) => {
      throw new Error(err.message)
    })
}

const getAsset = async (assetId: number): Promise<string> => {
  return await gameAPI
    .getAsset({ assetId: assetId })
    .then((response: AssetResponse) => {
      return response.assetURL
    })
    .catch((err: GameResponseError) => {
      throw new Error(err.message)
    })
}

const produce = async (quantity: number): Promise<boolean> => {
  return await gameAPI
    .produce({ quantity: quantity })
    .then((response: ProductionResponse) => {
      return response.success
    })
    .catch((err: GameResponseError) => {
      throw new Error(err.message)
    })
}

const travel = async (city: string): Promise<boolean> => {
  return await gameAPI
    .travel({ city: city })
    .then((response: ProductionResponse) => {
      return response.success
    })
    .catch((err: GameResponseError) => {
      throw new Error(err.message)
    })
}

const increaseVisibleEquipmentSource = async (resourceName: string): Promise<null> => {
  return await gameAPI
    .increaseVisibleEquipmentSource({ resourceName: resourceName })
    .then((response: null) => {
      return response
    })
    .catch((err: GameResponseError) => {
      throw new Error(err.message)
    })
}

const decreaseVisibleEquipmentSource = async (resourceName: string): Promise<null> => {
  return await gameAPI
    .decreaseVisibleEquipmentSource({ resourceName: resourceName })
    .then((response: null) => {
      return response
    })
    .catch((err: GameResponseError) => {
      throw new Error(err.message)
    })
}

const gameService = {
  createGame,
  getAdminGameSettings,
  getUserGameSettings,
  getGameSession,
  getPlayerEquipment,
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

export default gameService
