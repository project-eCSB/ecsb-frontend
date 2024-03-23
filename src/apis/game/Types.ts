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
      time: number | null
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
  gameAssetsIds: GameAsset[]
  timeForGame: number
  maxPlayerAmount: number
  maxTimeTokens: number
  walkingSpeed: number
  interactionRadius: number
  defaultMoney: number
}

export interface NewGameResponse {
  gameSessionId: number
}

export interface CopyGameRequest {
  gameSessionId: number
  gameName: string
}

export interface GameSettingsResource {
  key: string
  value: number
}

export interface Travel {
  key: number
  value: {
    name: string
    time: number | null
    moneyRange: {
      from: number
      to: number
    }
    resources: GameSettingsResource[]
  }
}

export interface GameSettingsTravels {
  key: string
  value: Travel[]
}

export interface AdminGameSettingsRequest {
  gameSessionId: number
}

export interface GameSettingsResponse {
  timeForGame: number
  walkingSpeed: number
  classResourceRepresentation: ClassResourceRepresentation[]
  travels: GameSettingsTravels[]
  gameSessionId: number
  name: string
  shortName: string
  gameAssets: GameAsset[]
  interactionRadius: number
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

export interface UploadAssetResponse {
  assetId: number
}

export interface AssetConfigRequest {
  assetId: number
}

export interface AssetConfigResponse {
  lowLevelTravels: Coordinate[]
  mediumLevelTravels: Coordinate[]
  highLevelTravels: Coordinate[]
  professionWorkshops: {
    [profession: string]: Coordinate[]
  }
  startingPoint: Coordinate
}

export interface SavedAssetsRequest {
  fileType: string
}

export type SavedAssetsResponse = Asset[]

export interface Asset {
  id: number
  name: string
}

export interface AssetRequest {
  assetId: number
}

export interface AssetResponse {
  assetURL: string
}

export interface DefaultAssetsResponse {
  [fileType: string]: Asset
}

/**
  GameReponseError represents an error from the server.
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
