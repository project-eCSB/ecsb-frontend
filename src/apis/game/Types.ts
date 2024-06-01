export interface ClassResourceRepresentation {
  key: string
  value: {
    classAsset: number
    gameResourceName: string
    resourceAsset: number
    maxProduction: number
    unitPrice: number
    regenTime: number
    buyoutPrice: number
  }
}

export interface CreateGameRequestTravels {
  key: string
  value: {
    key: string
    value: {
      assets: {
        key: string
        value: number
      }[]
      moneyRange: {
        from: number
        to: number
      }
      time: number
      regenTime: number
    }
  }[]
}

export interface GameAsset {
  key: string
  value: number
}

export interface CreateGameRequest {
  travels: CreateGameRequestTravels[]
  classResourceRepresentation: ClassResourceRepresentation[]
  gameName: string
  assets: GameAsset[]
  timeForGame: number
  minPlayersToStart: number
  maxTimeTokens: number
  walkingSpeed: number
  interactionRadius: number
  defaultMoney: number
}

export type GameSessionId = number

export interface CopyGameRequest {
  gameSessionId: number
  gameName: string
}

export interface Travel {
  key: number
  value: {
    name: string
    time: number
    regenTime: number
    moneyRange: {
      from: number
      to: number
    }
    resources: {
      key: string
      value: number
    }[]
  }
}

export interface GameSettingsTravels {
  key: string
  value: Travel[]
}

export interface GameSettings {
  classResourceRepresentation: ClassResourceRepresentation[]
  travels: GameSettingsTravels[]
  gameSessionId: number
  name: string
  shortName: string
  gameAssets: GameAsset[]
  timeForGame: number
  walkingSpeed: number
  maxTimeTokens: number
  defaultMoney: number
  interactionRadius: number
  minPlayersToStart: number
}

export interface Coordinate {
  x: number
  y: number
}

export interface UserGameStatusResponse {
  coords: Coordinate
  direction: string
  className: string
  playerId: string
}

export interface GameTokenRequest {
  gameCode: string
  playerId: string
}

export interface GameTokenResponse {
  gameToken: string
  gameSessionId: number
}

export interface UploadAssetRequest {
  file: ArrayBuffer
  fileName: string
  fileType: string
}

export interface MapConfig {
  lowLevelTravels: Coordinate[]
  mediumLevelTravels: Coordinate[]
  highLevelTravels: Coordinate[]
  professionWorkshops: {
    [profession: string]: Coordinate[]
  }
  startingPoint: Coordinate
}

export type FileType = string
export type SavedAssetsResponse = Asset[]

export interface Asset {
  id: number
  name: string
}

export type AssetId = number
export type AssetURL = string

export interface DefaultAssetsResponse {
  [fileType: string]: Asset
}

export interface GameStatus {
  coords: {
    x: number
    y: number
  }
  direction: string
  className: string
  playerId: string
}

export interface GameResourceDto {
  key: string
  value: number
}

export interface TradeEquipment {
  money: number
  resources: GameResourceDto[]
}

export interface CoopEquipment {
  resources: {
    key: string
    value: AmountDiff
  }[]
  timeTokensCoopInfo: {
    time: AmountDiff
  } | null
}

export interface CoopEquipmentDto {
  key: string
  value: CoopEquipment
}

export interface Equipment {
  money: number
  time: number
  resources: GameResourceDto[]
}

export interface EndGameStatus {
  gameSessionName: string
  playersLeaderboard: {
    playerId: string
    money: number
  }[]
}

export interface AmountDiff {
  amount: number
  needed: number
}

/**
  GameResponseError represents an error from the server.
  Code is 0 if the error is not from the server.
*/
export class GameResponseError extends Error {
  public constructor(
    public code: number,
    public message: string,
  ) {
    super(message)
  }
}
