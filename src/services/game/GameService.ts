import { setGameToken } from '../../apis/apis'
import gameAPI from '../../apis/game/GameAPI'
import type {
  AssetConfig,
  AssetId,
  AssetURL,
  CreateGameRequest,
  DefaultAssetsResponse,
  EndGameStatus,
  FileType,
  GameResponseError,
  GameSessionId,
  GameSettings,
  GameTokenResponse,
  SavedAssetsResponse,
  UserGameStatusResponse,
} from '../../apis/game/Types'


function handleError(err: GameResponseError): any | undefined {
  throw new Error(err.message)
}

const createGame = async (createGameRequest: CreateGameRequest): Promise<GameSessionId> => {
  return await gameAPI.createGame(createGameRequest).catch(handleError)
}

const getAdminGameSettings = async (gameSessionId: GameSessionId): Promise<GameSettings> => {
  return await gameAPI.getAdminGameSettings(gameSessionId).catch(handleError)
}

const getAdminGameLogs = async (gameSessionId: number): Promise<string> => {
  return await gameAPI
    .getAdminGameLogs(gameSessionId)
    .then((res: any) => {
      const fields = Object.keys(res[0])
      const replacer = function(_key: any, value: any): any {
        return value === null ? '' : value
      }
      let csv = res.map(function(row: { [x: string]: any }) {
        return fields
          .map(function(fieldName) {
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

const startGame = async (gameSessionId: GameSessionId): Promise<void> => {
  await gameAPI.startGame(gameSessionId).catch(handleError)
}

const copyGame = async (gameSessionId: GameSessionId, gameName: string): Promise<GameSessionId> => {
  return await gameAPI.copyGame({ gameSessionId, gameName }).catch(handleError)
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
    .catch(handleError)
}

const getUserGameSettings = async (): Promise<GameSettings> => {
  return await gameAPI.getUserGameSettings().catch(handleError)
}

const getPlayerResults = async (): Promise<EndGameStatus> => {
  return await gameAPI.getPlayerResults().catch(handleError)
}

const getUserGameStatus = async (): Promise<UserGameStatusResponse> => {
  return await gameAPI.getUserGameStatus().catch(handleError)
}

const uploadAsset = async (file: ArrayBuffer, fileName: string, fileType: string): Promise<AssetId> => {
  return await gameAPI.uploadAsset({ file, fileName, fileType }).catch(handleError)
}

const getAssetConfig = async (assetId: AssetId): Promise<AssetConfig> => {
  return await gameAPI.getAssetConfig(assetId).catch(handleError)
}

const getSavedAssets = async (fileType: FileType): Promise<SavedAssetsResponse> => {
  return await gameAPI.getSavedAssets(fileType).catch(handleError)
}

const getAsset = async (assetId: AssetId): Promise<AssetURL> => {
  return await gameAPI.getAsset(assetId).catch(handleError)
}

const getDefaultAssets = async (): Promise<DefaultAssetsResponse> => {
  return await gameAPI.getDefaultAssets().catch(handleError)
}

const gameService = {
  createGame,
  startGame,
  copyGame,
  getAdminGameSettings,
  getAdminGameLogs,
  getUserGameSettings,
  getGameSession,
  getPlayerResults,
  getUserGameStatus,
  uploadAsset,
  getAssetConfig,
  getSavedAssets,
  getAsset,
  getDefaultAssets,
}

export default gameService
