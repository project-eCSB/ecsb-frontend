import { setGameToken } from '../../apis/apis'
import gameApi from '../../apis/game/GameApi'
import type {
  AdminGameSettingsResponse,
  CreateGameResponse,
  GameClassResourceDto,
  GameResponseError,
  GameTokenResponse,
  UserGameSettingsResponse,
  UserGameStatusResponse,
} from '../../apis/game/Types'
import type { GameSettings, GameStatus, PlayerEquipment } from './Types'

const createGame = async (
  classResourceRepresentation: GameClassResourceDto[],
  charactersSpreadsheetUrl: string,
  gameName: string,
): Promise<number> => {
  return await gameApi
    .createGame({ classResourceRepresentation, charactersSpreadsheetUrl, gameName })
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
        assetUrl: res.assetUrl,
        gameSessionId: res.gameSessionId,
        name: res.name,
        shortName: res.shortName,
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
        assetUrl: res.assetUrl,
        gameSessionId: res.gameSessionId,
        name: res.name,
        shortName: res.shortName,
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

const gameService = {
  createGame,
  getAdminGameSettings,
  getUserGameSettings,
  getGameSession,
  getPlayerEquipment,
  getUserGameStatus,
}

export default gameService
