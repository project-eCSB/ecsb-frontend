import { type GameClassResourceDto } from '../../apis/game/Types'
import Key = Phaser.Input.Keyboard.Key

export interface GameSettings {
  classResourceRepresentation: GameClassResourceDto[]
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

export interface Controls {
  up: Key
  down: Key
  left: Key
  right: Key
  action: Key
}
