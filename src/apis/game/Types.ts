export interface CreateGameRequest {
  classRepresentation: {
    [className: string]: {assetNumber:number, resourceName:string}
  }
  charactersSpreadsheetUrl: string
  gameName: string
}

export interface CreateGameResponse {
  gameSessionId: number
}

export interface AdminGameSettingsRequest {
  gameSessionId: number
}

export interface AdminGameSettingsResponse {
  classRepresentation: {
    [className: string]: {assetNumber:number, resourceName:string}
  }
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
  classRepresentation: {
    [className: string]: {assetNumber:number, resourceName:string}
  }
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
