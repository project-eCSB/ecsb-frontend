export interface ClassResourceRepresentation {
  key: string
  value: {
    classAsset: number
    gameResourceName: string
    resourceAsset: number
    unitPrice: number
    maxProduction: number
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

export interface CreateGameRequest {
  classResourceRepresentation: ClassResourceRepresentation[]
  gameName: string
  travels: CreateGameRequestTravels[]
  mapAssetId: number
  tileAssetId: number
  characterAssetId: number
  resourceAssetsId: number
}

export interface CreateGameResponse {
  gameSessionId: number
}

export interface AdminGameSettingsRequest {
  gameSessionId: number
}

export interface GameAssets {
  mapAssetId: number
  tileAssetsId: number
  characterAssetsId: number
  resourceAssetsId: number
}

export interface GameSettingsResource {
  key: string
  value: number
}

export interface GameSettingsTravels {
  key: string
  value: {
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
  }[]
}

export interface AdminGameSettingsResponse {
  classResourceRepresentation: ClassResourceRepresentation[]
  travels: GameSettingsTravels[]
  gameSessionId: number
  name: string
  shortName: string
  gameAssets: {
    mapAssetId: number
    tileAssetsId: number
    characterAssetsId: number
    resourceAssetsId: number
  }
}

export interface UserGameSettingsResponse {
  classResourceRepresentation: ClassResourceRepresentation[]
  travels: GameSettingsTravels[]
  gameSessionId: number
  name: string
  shortName: string
  gameAssets: {
    mapAssetId: number
    tileAssetsId: number
    characterAssetsId: number
    resourceAssetsId: number
  }
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
  file: string | ArrayBuffer
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

export interface SavedAsset {
  id: number
  name: string
  fileType: string
  createdAt: string
}

export interface SavedAssetsResponse {
  assets: SavedAsset[]
}

export interface ProductionRequest {
  quantity: number
}

export interface ProductionResponse {
  success: boolean
}

export interface TravelRequest {
  city: string
}

export interface TravelResponse {
  success: boolean
}

/**
  GameReponseError represents an error from the server.
  Code is 0 if the error is not from the server.
*/
export class GameResponseError extends Error {
  public constructor(public code: number, public message: string) {
    super(message)
  }
}
