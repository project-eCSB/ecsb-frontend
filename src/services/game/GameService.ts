import { setGameToken } from '../../apis/apis'
import gameApi from '../../apis/game/GameApi'
import type {
  AdminGameSettingsResponse,
  AssetConfigResponse,
  ClassResourceRepresentation,
  CreateGameRequestTravels,
  CreateGameResponse,
  GameResponseError,
  GameTokenResponse,
  SavedAsset,
  SavedAssetsResponse,
  UploadAssetResponse,
  UserGameSettingsResponse,
  UserGameStatusResponse,
} from '../../apis/game/Types'
import type { AssetConfig, GameSettings, GameStatus, PlayerEquipment } from './Types'

const createGame = async (
  classResourceRepresentation: ClassResourceRepresentation[],
  gameName: string,
  travels: CreateGameRequestTravels[],
  mapAssetId: number,
  tileAssetId: number,
  characterAssetId: number,
  resourceAssetsId: number,
): Promise<number> => {
  return await gameApi
    .createGame({
      classResourceRepresentation,
      gameName,
      travels,
      mapAssetId,
      tileAssetId,
      characterAssetId,
      resourceAssetsId,
    })
    .then((res: CreateGameResponse) => {
      return res.gameSessionId
    })
    .catch((err: GameResponseError) => {
      throw new Error(err.message)
    })
}

const getAdminGameSettings = async (gameSessionId: number): Promise<GameSettings> => {
  return await gameApi
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
  return await gameApi
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
  return await gameApi
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

const getPlayerEquipment = async (): Promise<PlayerEquipment> => {
  return await gameApi.getPlayerEquipment()
}

const getUserGameStatus = async (): Promise<GameStatus> => {
  return await gameApi
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
  file: string | ArrayBuffer,
  fileName: string,
  fileType: string,
): Promise<number> => {
  return await gameApi
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
  return await gameApi
    .getAssetConfig({ assetId })
    .then((response: AssetConfigResponse) => {
      return response
    })
    .catch((err: GameResponseError) => {
      throw new Error(err.message)
    })
}

const getSavedAssets = async (fileType: string): Promise<SavedAsset[]> => {
  return await gameApi
    .getSavedAssets({ fileType: fileType })
    .then((res: SavedAssetsResponse) => {
      const savedAssets: SavedAsset[] = res.assets

      return savedAssets
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
}

export default gameService
