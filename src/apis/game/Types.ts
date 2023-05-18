export interface CreateGameRequest {
  classResourceRepresentation: GameClassResourceDto[]
  charactersSpreadsheetUrl: string
  gameName: string
}

export interface GameClassResourceDto {
  gameClassName: string
  classAsset: number
  gameResourceName: string
  resourceAsset: number
}

export interface CreateGameResponse {
  gameSessionId: number
}

export interface AdminGameSettingsRequest {
  gameSessionId: number
}

export interface AdminGameSettingsResponse {
  classResourceRepresentation: GameClassResourceDto[]
  assetUrl: string
  gameSessionId: number
  name: string
  shortName: string
}

export interface GameTokenRequest {
  gameCode: string
  playerId: string
}

export interface GameTokenResponse {
  gameToken: string
  gameSessionId: number
}

export interface UserGameSettingsResponse {
  classResourceRepresentation: GameClassResourceDto[]
  assetUrl: string
  gameSessionId: number
  name: string
  shortName: string
}

export interface UserGameStatusResponse {
  coords: {
    x: number
    y: number
  }
  direction: string
  className: string
  playerId: string
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
