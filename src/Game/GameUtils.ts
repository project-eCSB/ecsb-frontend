import { Direction, type Position } from 'grid-engine'
import { type ClassResourceRepresentation } from '../apis/game/Types'

// ASSETS
export const TILES_ASSET_KEY = 'tiles'
export const MAP_ASSET_KEY = 'glade'
export const CHARACTER_ASSET_KEY = 'player'

// MAP
export const LAYER_SCALE = 2.25
export const RANGE = 3

// PLAYERS
export const SPRITE_WIDTH = 52
export const SPRITE_HEIGHT = 72
export const MOVEMENT_SPEED = 4.5
export const PLAYER_DESC_OFFSET_LEFT = 10
export const ALL_PLAYERS_DESC_OFFSET_TOP = 75
export const getPlayerMapping =
  (initialCharacterMapping: ClassResourceRepresentation[]) =>
  (playerClass: string): number =>
    initialCharacterMapping.find((dto) => dto.key === playerClass)?.value.classAsset ?? 0

export const getDirection = (startPosition: Position, endPosition: Position): Direction => {
  const xDiff = startPosition.x - endPosition.x
  const yDiff = startPosition.y - endPosition.y

  if (xDiff === 0 && yDiff === 0) {
    return Direction.NONE
  }

  if (xDiff === 0) {
    return yDiff > 0 ? Direction.UP : Direction.DOWN
  }

  if (yDiff === 0) {
    return xDiff > 0 ? Direction.LEFT : Direction.RIGHT
  }

  if (xDiff > 0) {
    return yDiff > 0 ? Direction.UP_LEFT : Direction.DOWN_LEFT
  }

  return yDiff > 0 ? Direction.UP_RIGHT : Direction.DOWN_RIGHT
}
