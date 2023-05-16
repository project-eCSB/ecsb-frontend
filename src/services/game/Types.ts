export interface GameSettings {
  classRepresentation: {
    [className: string]: {assetNumber:number, resourceName:string}
  }
  assetUrl: string
  gameSessionId: number
  name: string
  shortName: string
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
