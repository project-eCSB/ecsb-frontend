import {type GameClassResourceDto} from "../../apis/game/Types";

export interface GameSettings {
  classResourceRepresentation:GameClassResourceDto[]
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
