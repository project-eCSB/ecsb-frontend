import { setGameToken } from '../../apis/apis'
import gameApi from '../../apis/game/GameApi'
import type {
  AdminGameSettingsResponse,
  CreateGameResponse,
  GameResponseError,
  GameTokenResponse,
  UserGameSettingsResponse,
  UserGameStatusResponse,
} from '../../apis/game/Types'
import type { GameSettings, GameStatus } from './Types'

const createGame = async (
  classRepresentation: { [className: string]: number },
  charactersSpreadsheetUrl: string,
  gameName: string,
): Promise<number> => {
  return await gameApi
    .createGame({ classRepresentation, charactersSpreadsheetUrl, gameName })
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
        classRepresentation: res.classRepresentation,
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
        classRepresentation: res.classRepresentation,
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
  getUserGameStatus,
}

export default gameService
