import { setGameToken } from '../../apis/apis'
import gameAPI from '../../apis/game/GameAPI'
import type {
  GameSettingsResponse,
  AssetConfigResponse,
  AssetResponse,
  ClassResourceRepresentation,
  CreateGameRequestTravels,
  NewGameResponse,
  GameTokenResponse,
  SavedAssetsResponse,
  UploadAssetResponse,
  UserGameStatusResponse,
  GameAsset,
  DefaultAssetsResponse,
} from '../../apis/game/Types'
import { GameResponseError } from '../../apis/game/Types'
import type { AssetConfig, EndGameStatus, Equipment, GameSettings, GameStatus } from './Types'

const createGame = async (
  classResourceRepresentation: ClassResourceRepresentation[],
  gameName: string,
  travels: CreateGameRequestTravels[],
  assets: GameAsset[],
  timeForGame: number,
  maxTimeTokens: number,
  walkingSpeed: number,
  interactionRadius: number,
  defaultMoney: number,
  minPlayersToStart: number,
): Promise<number> => {
  return await gameAPI
    .createGame({
      travels,
      classResourceRepresentation,
      gameName,
      assets,
      timeForGame,
      maxTimeTokens,
      walkingSpeed,
      interactionRadius,
      defaultMoney,
      minPlayersToStart,
    })
    .then((res: NewGameResponse) => {
      return res.gameSessionId
    })
    .catch((err: GameResponseError) => {
      throw new Error(err.message)
    })
}

const getAdminGameSettings = async (gameSessionId: number): Promise<GameSettings> => {
  return await gameAPI
    .getAdminGameSettings({ gameSessionId })
    .then((res: GameSettingsResponse) => {
      const gameSettings: GameSettings = {
        classResourceRepresentation: res.classResourceRepresentation,
        travels: res.travels,
        gameSessionId: res.gameSessionId,
        name: res.name,
        shortName: res.shortName,
        gameAssets: res.gameAssets,
        timeForGame: res.timeForGame,
        walkingSpeed: res.walkingSpeed,
        interactionRadius: res.interactionRadius,
      }

      return gameSettings
    })
    .catch((err: GameResponseError) => {
      throw new Error(err.message)
    })
}

const getAdminGameLogs = async (gameSessionId: number): Promise<string> => {
  return await gameAPI
    .getAdminGameLogs({ gameSessionId })
    .then((res: any) => {
      const fields = Object.keys(res[0])
      const replacer = function (_key: any, value: any): any {
        return value === null ? '' : value
      }
      let csv = res.map(function (row: { [x: string]: any }) {
        return fields
          .map(function (fieldName) {
            return JSON.stringify(row[fieldName], replacer)
          })
          .join(',')
      })
      csv.unshift(fields.join(','))
      csv = csv.join('\r\n')
      return csv
    })
    .catch((err) => {
      console.error(err)
    })
}

const startGame = async (gameSessionId: number): Promise<void> => {
  await gameAPI
    .startGame({ gameSessionId })
    .then()
    .catch((err) => {
      if (err.response) {
        throw new GameResponseError(err.response.status, err.response.data)
      } else {
        throw new GameResponseError(0, err.message)
      }
    })
}

const copyGame = async (gameSessionId: number, gameName: string): Promise<number> => {
  return await gameAPI
    .copyGame({ gameSessionId, gameName })
    .then((res: NewGameResponse) => {
      return res.gameSessionId
    })
    .catch((err) => {
      if (err.response) {
        throw new GameResponseError(err.response.status, err.response.data)
      } else {
        throw new GameResponseError(0, err.message)
      }
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
    .then((res: GameSettingsResponse) => {
      const gameSettings: GameSettings = {
        timeForGame: res.timeForGame,
        walkingSpeed: res.walkingSpeed,
        classResourceRepresentation: res.classResourceRepresentation,
        travels: res.travels,
        gameSessionId: res.gameSessionId,
        name: res.name,
        shortName: res.shortName,
        gameAssets: res.gameAssets,
        interactionRadius: res.interactionRadius,
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

const getPlayerResults = async (): Promise<EndGameStatus> => {
  return await gameAPI
    .getPlayerResults()
    .then((res: EndGameStatus) => {
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
      return response.assetId
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

const getSavedAssets = async (fileType: string): Promise<SavedAssetsResponse> => {
  return await gameAPI
    .getSavedAssets({ fileType: fileType })
    .then((res: SavedAssetsResponse) => {
      return res
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

const getDefaultAssets = async (): Promise<DefaultAssetsResponse> => {
  return await gameAPI
    .getDefaultAssets()
    .then((response: DefaultAssetsResponse) => {
      return response
    })
    .catch((err: GameResponseError) => {
      throw new Error(err.message)
    })
}

const gameService = {
  createGame,
  startGame,
  copyGame,
  getAdminGameSettings,
  getAdminGameLogs,
  getUserGameSettings,
  getGameSession,
  getPlayerEquipment,
  getPlayerResults,
  getUserGameStatus,
  uploadAsset,
  getAssetConfig,
  getSavedAssets,
  getAsset,
  getDefaultAssets,
}

export default gameService
