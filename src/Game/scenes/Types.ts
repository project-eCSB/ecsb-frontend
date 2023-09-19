import Key = Phaser.Input.Keyboard.Key
import { type Direction } from 'grid-engine'

export interface Controls {
  up: Key
  down: Key
  left: Key
  right: Key
  action: Key
}

export enum CloudType {
  WORK = 'work',
  TRAVEL = 'travel',
  TALK = 'talk',
  PRODUCTION = 'production',
}

export type PlayerId = string

export interface Coordinates {
  x: number
  y: number
}

export interface PlayerState {
  coords: Coordinates
  direction: Direction
  sprite: Phaser.GameObjects.Sprite
}

